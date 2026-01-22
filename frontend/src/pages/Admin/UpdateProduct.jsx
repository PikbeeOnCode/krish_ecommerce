import React from 'react'
import { useState } from 'react';
import {
  useParams,
  useNavigate
}
  from 'react-router-dom';
import {
  useUpdateProductMutation,
  useGetProductsByIDQuery,
  useDeleteProductMutation,
  useUploadProductImageMutation,
}
  from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';



const UpdateProduct = () => {
  const params = useParams();
  const { data: productData } = useGetProductsByIDQuery(params._id);
  const [image, setimage] = useState(productData?.coverImage || '');
  const [title, settitle] = useState(productData?.title || '');
  const [author, setauthor] = useState(productData?.author || '');
  const [category, setcategory] = useState(productData?.category || '');
  const [genre, setgenre] = useState(productData?.genre || '');
  const [summary, setsummary] = useState(productData?.summary || '');
  const [publishedDate, setpublishedDate] = useState(productData?.publishedDate || '');
  const [language, setlanguage] = useState(productData?.language || '');
  const [price, setprice] = useState(productData?.price || '');
  const [countInStock, setcountInStock] = useState(productData?.countInStock || '');
  const navigate = useNavigate();
  const { data: categories } = useFetchCategoriesQuery();
  const [UpdateProduct] = useUpdateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setimage(productData.coverImage);
      settitle(productData.title);
      setauthor(productData.author);
      setcategory(productData.category);
      setgenre(productData.genre);
      setsummary(productData.summary);
      setpublishedDate(productData.publishedDate);
      setlanguage(productData.language);
      setprice(productData.price);
      setcountInStock(productData.countInStock);
    }
  }, [productData]);
  return (
    <div>hello</div>

  )
}

export default UpdateProduct