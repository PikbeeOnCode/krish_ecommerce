import React from 'react'
import { useEffect,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'
import { setCredintials } from '../../redux/features/auth/authSlice'
import { Link } from 'react-router'
import { useProfileMutation } from '../../redux/api/userApiSlice'

const Profile = () => {

  const [username ,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const {userInfo} = useSelector(state => state.auth);
  const [updateProfile,{isLoading:loadingUpdateprofile}] = useProfileMutation();

 useEffect(() => {
  // Add a check to ensure userInfo exists before accessing its properties
  if (userInfo) {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }
}, [userInfo]); // Also simplified the dependency array

const dispatch = useDispatch();

const submitHandler = async(e) => {
  e.preventDefault();

  if (!userInfo) {
    toast.error('User not logged in!');
    return;
  }
  if(password && confirmPassword){
        if(password !== confirmPassword) {
    toast.error('Passwords do not match');
  } else {
    try {
      const res = await updateProfile({
        _id:userInfo._id,
        username,
        password
      }).unwrap();
      dispatch(setCredintials({...res}));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  }
  }else{
    toast.error('enter both password')
  }

}
  return (
    <div className='container  mx-auto  p-4 mt-[10rem]'>
      <div className='flex justify-center align-center md:flex md:space-x-4'>
        <div className='md:w-1/3'>
            <h2 className='text-2xl font-semibold mb-4'> update  profile</h2>
              <form onSubmit={submitHandler} >
                <div className='mb-4'>
                  <label className='block text-white mb-2'>Name</label>
                  <input
                   type="text"
                   placeholder='Enter name'
                   className='form-input p-4 rounded-sm w-full'
                   value={username}
                   onChange={(e)=>setUsername(e.target.value)}
                   />
                </div>
                 <div className='mb-4'>
                  <label className='block text-white mb-2'>Email</label>
                  <input
                   type="email"
                   placeholder='Enter email'
                   className='form-input p-4 rounded-sm w-full'
                   value={email}
                   onChange={(e)=>setEmail(e.target.value)}
                   />
                </div>
                 <div className='mb-4'>
                  <label className='block text-white mb-2'>Password</label>
                  <input
                   type="password"
                   placeholder='Enter password'
                   className='form-input p-4 rounded-sm w-full'
                   value={password}
                   onChange={(e)=>setPassword(e.target.value)}
                   />
                </div>
                 <div className='mb-4'>
                  <label className='block text-white mb-2'>Confirm Password</label>
                  <input
                   type="password"
                   placeholder='Enter confirm password'
                   className='form-input p-4 rounded-sm w-full'
                   value={confirmPassword}
                   onChange={(e)=>setConfirmPassword(e.target.value)}
                   />
                </div>
                <div 
                className='flex justify-between'>
                  <button
                  type='submit'
                  className='bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600'>
                    update
                  </button>
                  <Link 
                  to='/userorder'
                  className='bg-pink-600 text-white py-2 px-4 rounded hover:bg-pink-600'>
                    My orders 
                  </Link>
                </div>
              </form>
        </div>
        {loadingUpdateprofile && <Loader />}
      </div>
    </div>
  )
}

export default Profile