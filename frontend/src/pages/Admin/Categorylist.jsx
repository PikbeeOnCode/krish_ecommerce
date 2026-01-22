import React from 'react'
import {  useState } from 'react'
import { 
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useFetchCategoriesQuery
 } from '../../redux/api/categoryApiSlice'
import { toast } from 'react-toastify'
import CategoryForm from '../../components/CategoryForm'
import Modal from '../../components/Modal'
import AdminMenu from './AdminMenu.jsx'

const Categorylist = () => {
    const {data:categories} = useFetchCategoriesQuery();
    const  [name,setName]= useState('');
    const [selectedCategory,setSelectedCategory]= useState(null);
    const [updatingName,setUpdatingName]= useState('');
    const[modalVisible,setModalVisible]= useState(false);

    const [createCategory]= useCreateCategoryMutation();
    const [updateCategory]= useUpdateCategoryMutation();
    const [deleteCategory]= useDeleteCategoryMutation();

    const submitHandler = async(e)=>{
        e.preventDefault();
        if(!name.trim()){
            toast.error("Category name is required");
        }
        try {
            const res = await createCategory({name}).unwrap();
            if(res.error){
                toast.error(res.error);
            }else{
                setName("")
                toast.success(`Category ${res.name} created successfully`);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to create category");
        }
    }

    const handleupdateCategory = async(e)=>{
        e.preventDefault();
        if(!updatingName.trim()){
            toast.error("Category name is required");
        }
        try {
            const res = await updateCategory({categoryId:selectedCategory._id,updatedCategory:{name:updatingName}}).unwrap();
            if(res.error){
                toast.error(res.error);
            }else{
                setModalVisible(false);
                setSelectedCategory(null);
                setUpdatingName("");
                toast.success(`Category ${res.name} updated successfully`);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update category");
        }
    }

    const handleDeleteCategory = async () => {
        try {
            const result = await deleteCategory(selectedCategory._id).unwrap()
            
            if (result.error) {
            toast.error(result.error)
            } else {
            toast.success(`${selectedCategory.name} is deleted.`)
            setSelectedCategory(null)
            setModalVisible(false)
            }
            
        } catch (error) {
            console.error(error)
            toast.error('Category deletion failed. Try again.')
        }
        }
  return (
    <div className='ml-[10rem] flex flex-col md-flex-row'>
        <AdminMenu />
        <div className='md:w-3/4 p-3'>
            <h1 className='h-12'> Manage Categories</h1>
            <CategoryForm value={name} 
            setValue={setName} 
            submitHandler = { submitHandler} />
            <br />
            <hr />
            <div className='flex flex-wrap'>
                {categories?.map((category)=>(
                    <div key={category._id}>
                        <button 
                        className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50" 
                        onClick={() => {
                            setModalVisible(true);
                            setSelectedCategory(category);
                            setUpdatingName(category.name);
                        }}
                        >
                        {category.name}
                        </button>
                    </div>
                ))}
            </div>

            <Modal isOpen={modalVisible} isClose={()=>setModalVisible(false)}>
                <CategoryForm
                 value={updatingName}
                 setValue={(value)=>setUpdatingName(value)}
                 submitHandler={handleupdateCategory}
                 buttonText="Update"
                 handleDelete={handleDeleteCategory}
                />
            </Modal>
        </div>

    </div>
  )
}

export default Categorylist