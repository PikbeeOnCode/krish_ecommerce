import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  './index.css'
import App from './App.jsx'
import { Route,RouterProvider,createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/features/store.js';
import Profile from './pages/User/Profile.jsx';

import Home from './pages/Home.jsx'
import Favorites from './pages/Products/Favourites.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Shop from './pages/Shop.jsx'
import UserOrder from './pages/User/UserOrder.jsx'
import PrivateRoutes from './components/PrivateRoutes.jsx'
import Shipping from './pages/orders/Shipping.jsx'
import PlaceOrder from './pages/orders/PlaceOrder.jsx'
import Order from './pages/orders/Order.jsx'

import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx'

import AdminRoutes from './pages/Admin/AdminRoutes.jsx'
import UserList from './pages/Admin/UserList.jsx'
import CategoryList from './pages/Admin/Categorylist.jsx'
import ProductList from './pages/Admin/ProductList.jsx';
import UpdateProduct from './pages/Admin/UpdateProduct.jsx';
import AllProductList from './pages/Admin/AllProductList.jsx';
import OrderList from './pages/Admin/OrderList.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >

   <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route index={true} path='/' element={<Home />} />
    <Route path='/favorite' element={<Favorites />} />
    <Route path='/product/:id' element={<ProductDetails />} />
    <Route path='/cart' element={<Cart />} />
    <Route path='/shop' element={<Shop />} />
    <Route path='/userorder' element={<UserOrder />} />


    <Route path='' element={<PrivateRoutes />} >
      <Route path='/profile' element={<Profile />} />
      <Route path='/shipping' element={<Shipping />} />
      <Route path='/placeorder' element={<PlaceOrder />} />
      <Route path='/order/:id' element={<Order />} />
    </Route>
   <Route path='/admin'element={<AdminRoutes />}>
      <Route path='userlist' element={<UserList />} />
      <Route path='categorylist' element={<CategoryList />} />
      <Route path='productlist' element={<ProductList />} />
      <Route path='allproductslist' element={<AllProductList />} />
      <Route path='product/update/:_id' element={<UpdateProduct />} />
      <Route path='orderlist' element={<OrderList />} />
      <Route path='dashboard' element={<AdminDashboard />} />
   </Route>
     </Route>
     )
)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <PayPalScriptProvider>
    <RouterProvider router={router} />
     </PayPalScriptProvider>
   
  </Provider>
  
)
