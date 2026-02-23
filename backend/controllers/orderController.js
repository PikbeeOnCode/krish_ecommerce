import { supabase, formatId } from "../config/supabaseClient.js";

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);
  const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!req.user) return res.status(401).json({ message: "Not authorized, no user found" });
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: "No order items" });

    const productIds = orderItems.map((x) => x._id);
    const { data: itemsFromDB, error: productError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (productError) throw productError;

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItem = itemsFromDB.find((p) => p.id === itemFromClient._id);
      if (!matchingItem) throw new Error(`Product not found: ${itemFromClient._id}`);

      return {
        product_id: matchingItem.id,
        title: matchingItem.title,
        cover_image: matchingItem.cover_image,
        price: matchingItem.price,
        qty: itemFromClient.qty,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    const { data: createdOrder, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: req.user._id,
        shipping_address: shippingAddress,
        payment_method: "Cash on Delivery",  // hardcoded COD
        items_price: itemsPrice,
        tax_price: taxPrice,
        shipping_price: shippingPrice,
        total_price: totalPrice,
        is_paid: false,
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItemsToInsert = dbOrderItems.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);
    if (itemsError) throw itemsError;

    const { data: fullOrder } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", createdOrder.id)
      .single();

    res.status(201).json(formatId(fullOrder));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, users(id, username)");

    if (error) throw error;
    res.json(formatId(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", req.user._id);

    if (error) throw error;
    res.json(formatId(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ totalOrders: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const { data, error } = await supabase.from("orders").select("total_price");
    if (error) throw error;

    const totalSales = data.reduce((sum, order) => sum + Number(order.total_price), 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateTotalSalesByDate = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("paid_at, total_price")
      .eq("is_paid", true);

    if (error) throw error;

    const salesByDate = data.reduce((acc, order) => {
      const date = new Date(order.paid_at).toISOString().split("T")[0];
      const existing = acc.find((x) => x._id === date);
      if (existing) {
        existing.totalSales += Number(order.total_price);
      } else {
        acc.push({ _id: date, totalSales: Number(order.total_price) });
      }
      return acc;
    }, []);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), users(username, email)")
      .eq("id", req.params.id)
      .single();

    if (error || !data) return res.status(404).json({ message: "Order not found" });

    res.json(formatId(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin marks order as paid after receiving cash
const markOrderAsPaid = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        is_paid: true,
        paid_at: new Date(),
        payment_result: {
          status: "Cash Received",
          update_time: new Date().toISOString(),
        },
        updated_at: new Date(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(formatId(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        is_delivered: true,
        delivered_at: new Date(),
        updated_at: new Date(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: "Order not found" });

    res.json(formatId(data));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};