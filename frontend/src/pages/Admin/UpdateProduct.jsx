import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useUpdateProductMutation,
  useGetProductsByIDQuery,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} from '../../redux/api/productApiSlice'
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice'
import { toast } from 'react-toastify'
import AdminMenu from './AdminMenu'

const UpdateProduct = () => {
  const params = useParams()
  const navigate = useNavigate()

  const { data: productData, isLoading, error } = useGetProductsByIDQuery(params._id)
  const { data: categories = [] } = useFetchCategoriesQuery()

  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [genre, setGenre] = useState('')
  const [summary, setSummary] = useState('')
  const [publishedDate, setPublishedDate] = useState('')
  const [language, setLanguage] = useState('')
  const [price, setPrice] = useState(0)
  const [countInStock, setCountInStock] = useState(0)

  const [updateProduct] = useUpdateProductMutation()
  const [uploadProductImage] = useUploadProductImageMutation()
  const [deleteProduct] = useDeleteProductMutation()

  useEffect(() => {
    if (!params._id) {
      toast.error('Invalid product ID')
      navigate('/admin/allproductslist')
      return
    }
  }, [params._id, navigate])

  useEffect(() => {
    if (productData && productData._id) {
      setImageUrl(productData.coverImage || '')
      setTitle(productData.title || '')
      setAuthor(productData.author || '')
      setCategory(productData.category || '')
      setGenre(productData.genre || '')
      setSummary(productData.summary || '')
      
      // Format date properly for date input
      if (productData.publishedDate) {
        const dateObj = new Date(productData.publishedDate)
        const formattedDate = dateObj.toISOString().split('T')[0]
        setPublishedDate(formattedDate)
      } else {
        setPublishedDate('')
      }
      
      setLanguage(productData.language || '')
      setPrice(productData.price || 0)
      setCountInStock(productData.countInStock || 0)
    }
  }, [productData])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await uploadProductImage(formData).unwrap()
      toast.success(res.message || 'Image uploaded successfully')
      setImage(file)
      setImageUrl(res.imageUrl || res.image)
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to upload image')
      console.error('Upload error:', error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    // Validate non-empty fields
    if (!title?.trim()) {
      toast.error('Title cannot be empty')
      return
    }

    if (!author?.trim()) {
      toast.error('Author cannot be empty')
      return
    }

    if (!category) {
      toast.error('Category cannot be empty')
      return
    }

    if (!genre?.trim()) {
      toast.error('Genre cannot be empty')
      return
    }

    if (!summary?.trim()) {
      toast.error('Summary cannot be empty')
      return
    }

    if (!publishedDate) {
      toast.error('Published Date cannot be empty')
      return
    }

    if (!language?.trim()) {
      toast.error('Language cannot be empty')
      return
    }

    if (!price || price <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    if (countInStock < 0) {
      toast.error('Stock count cannot be negative')
      return
    }

    if (!imageUrl) {
      toast.error('Cover Image is required')
      return
    }

    try {
      // Format the date properly (yyyy-MM-dd)
      let formattedDate = publishedDate
      if (publishedDate) {
        const dateObj = new Date(publishedDate)
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0]
        }
      }

      // Build update object with all fields
      const productData = {
        title: title.trim(),
        author: author.trim(),
        category,
        genre: genre.trim(),
        summary: summary.trim(),
        publishedDate: formattedDate,
        language: language.trim(),
        price: parseFloat(price),
        countInStock: parseInt(countInStock),
        coverImage: imageUrl,
      }

      console.log('Sending update data:', productData) // Debug

      await updateProduct({ productId: params._id, formData: productData }).unwrap()
      toast.success('Product updated successfully')
      navigate('/admin/allproductslist')
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to update product')
      console.error('Update error:', error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      await deleteProduct(params._id).unwrap()
      toast.success('Product deleted successfully')
      navigate('/admin/allproductslist')
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to delete product')
      console.error('Delete error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container xl:mx-[9rem] sm:mx-[0]">
        <AdminMenu />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Loading product...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container xl:mx-[9rem] sm:mx-[0]">
        <AdminMenu />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl text-red-500">
            Error: {error?.data?.message || 'Failed to load product'}
          </div>
        </div>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="container xl:mx-[9rem] sm:mx-[0]">
        <AdminMenu />
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl">Product not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <h2 className="text-xl font-bold mb-4">Update Product</h2>

        {imageUrl && (
          <div className="text-center mb-4">
            <img 
              src={imageUrl} 
              alt="product" 
              className="block mx-auto max-h-[200px] rounded-lg"
            />
          </div>
        )}

        <div className="mb-3">
          <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 hover:bg-gray-800 transition">
            {image ? image.name : 'Upload Image'}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>
        </div>

        <form className="p-3" onSubmit={handleUpdate}>
          <div className="flex flex-wrap">
            <div className="one">
              <label className="block mb-2">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </div>

            <div className="two ml-10">
              <label className="block mb-2">Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="three">
              <label className="block mb-2">Author <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="four ml-10">
              <label className="block mb-2">Category <span className="text-red-500">*</span></label>
              <select
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose Category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="five">
              <label className="block mb-2">Genre <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Enter genre"
                required
              />
            </div>

            <div className="six ml-10">
              <label className="block mb-2">Published Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
              />
            </div>

            <div className="seven md:col-span-2">
              <label className="block mb-2">Summary <span className="text-red-500">*</span></label>
              <textarea
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[50rem] text-white h-32"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter product summary"
                required
              ></textarea>
            </div>

            <div className="flex justify-between w-full">
              <div className="eight">
                <label className="block mb-2">Language <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="Enter language"
                  required
                />
              </div>

              <div className="nine">
                <label className="block mb-2">Stock Count <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <button 
              type="submit" 
              className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-500 hover:bg-pink-600 transition"
            >
              Update
            </button>
            <button 
              type="button" 
              onClick={handleDelete} 
              className="py-4 px-6 rounded-lg text-lg font-bold bg-red-600 hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProduct