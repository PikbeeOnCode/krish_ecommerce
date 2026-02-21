import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import {
  useCreateProductMutation,
  useUploadProductImageMutation
} from '../../redux/api/productApiSlice'
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice'
import { toast, ToastContainer } from 'react-toastify'
import AdminMenu from './AdminMenu.jsx'

const ProductList = () => {
  const [image, setImage] = useState('');
  const [title, settitle] = useState('');
  const [author, setauthor] = useState('');
  const [category, setcategory] = useState('');
  const [genre, setgenre] = useState('');
  const [summary, setsummary] = useState('');
  const [publishedDate, setpublishedDate] = useState('');
  const [language, setlanguage] = useState('');
  const [price, setprice] = useState(0);
  const [countInStock, setcountInStock] = useState(0);
  const [imageUrl, setimageurl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append('title', title);
      productData.append('author', author);
      productData.append('category', category);
      productData.append('genre', genre);
      productData.append('summary', summary);
      productData.append('publishedDate', publishedDate);
      productData.append('language', language);
      productData.append('price', price);
      productData.append('countInStock', countInStock);
      productData.append('coverImage', image);

      const { data } = await createProduct(productData).unwrap();
      toast.success("Product created successfully");
      navigate('/');

    } catch (error) {
      toast.error(error?.data?.message || error.error);
      console.log(error);
    }
  }

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      console.log(res);
      toast.success(res.message);
      setImage(res.image);
      setimageurl(res.imageUrl);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <div className='container xl:mx-[9rem] sm:mx-[0]'>
      <div className='flex flex-col md:flex-row'></div>
      <AdminMenu />
      <div className='md:w-3/4 p-3'>
        <div className='h-12'> create product</div>
        {imageUrl && (
          <div className='text-center'>
            <img src={imageUrl} alt="products" className='block mx-auto max-h-[200px]' />
          </div>
        )}
        <div className="mb-3">
          <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
            {image ? image.name : "Upload Image"}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className={!image ? "hidden" : "text-white"}
            />
          </label>
        </div>
        <div className='p-3'>
          <div className='flex flex-wrap'>

            <div className='one'>
              <label htmlFor="title">title</label> <br />
              <input type="text"
                className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                value={title}
                onChange={(e) => settitle(e.target.value)}
                placeholder='title name' />
            </div>

            <div className='two ml-10'>
              <label htmlFor="name block">price</label> <br />
              <input type="number"
                className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                value={price}
                onChange={(e) => setprice(e.target.value)} />
            </div>

            <div className='three'>
              <label htmlFor="name block">author</label> <br />
              <input type="text"
                className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                value={author}
                onChange={(e) => setauthor(e.target.value)}
                placeholder='author name ' />
            </div>

            <div className='four ml-10'>
              <label htmlFor="name block">category</label> <br />
              <select
                placeholder="Choose Category"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={category}
                onChange={(e) => setcategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='five'>
              <label htmlFor="name block">genre</label> <br />
              <input type="text"
                className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                value={genre}
                onChange={(e) => setgenre(e.target.value)}
              />
            </div>

            <div className='six ml-10'>
              <label htmlFor="name block">publishedDate</label> <br />
              <input type="date"
                className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                value={publishedDate}
                onChange={(e) => setpublishedDate(e.target.value)} />
            </div>


            <div className='seven  md:col-span-2'>
              <label htmlFor="name block">summary</label> <br />
              <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[50rem] text-white h-32"
                value={summary}
                onChange={(e) => setsummary(e.target.value)}
              ></textarea>
            </div>

            <div className='flex justify-between'>
              <div className='eight'>
                <label htmlFor="name block">language</label> <br />
                <input type="text"
                  className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                  value={language}
                  onChange={(e) => setlanguage(e.target.value)} />
              </div>

              <div className='nine '>
                <label htmlFor="name block">add stock</label> <br />
                <input type="number"
                  className='p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white'
                  value={countInStock}
                  onChange={(e) => setcountInStock(e.target.value)} />
              </div>


            </div>

          </div>
          <button
            onClick={handleSubmit}
            className='py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-500'>
            submit
          </button>

        </div>

      </div>

    </div>
  )
}

export default ProductList