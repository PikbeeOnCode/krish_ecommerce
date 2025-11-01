import React from 'react'
import { useState,useEffect } from 'react'
import { Link,useLocation,useNavigate } from 'react-router'
import { useSelector,useDispatch } from 'react-redux'
import { useLoginMutation } from '../../redux/api/userApiSlice'
import { setCredintials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader'


const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login,{isLoading}] = useLoginMutation();
  const {userInfo} = useSelector(state => state.auth);

  const {search} = useLocation();
   const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  },[navigate,redirect,userInfo]);

  const submitHandler = async (e)=>{
    e.preventDefault();
    try{
          const res = await login({email,password}).unwrap();
      console.log(res);
      dispatch(setCredintials({...res}));
    }catch(error){
      toast.error(error?.data?.message|| error.message);
    }
  }
  return (
    <div>
      <section className='pl-[10rem] flex flex-wrap'>
        <div className='mr-[4rem] mt-[5rem]'>
          <h1 className="text-2xl font-semibold mb-4">signIn</h1>

          <form  onSubmit={submitHandler} className='container 2-[40rem]'>

            {/* email input */}
            <div className='my-[2rem]'>
              <label htmlFor="email" className='block text-sm font-medium text-black'>
                Email Address  
              </label>
              <input
               type="email"
                id='email'
                 className='mt-1 p-2 border rounded w-full'
                 value={email}
                 onChange={e => setEmail(e.target.value)} 
                 />
            </div>

            {/* password input */}
            <div className='my-[2rem]'>
              <label htmlFor="password" className='block text-sm font-medium text-black'>
                Password
              </label>
              <input
               type="password"
                id='password'
                 className='mt-1 p-2 border rounded w-full'
                 value={password}
                 onChange={e => setPassword(e.target.value)} 
                 />
            </div>
            <button disabled={isLoading} type='submit' className='bg-pink-500 text-black px-4 py-2 rounded cursor-pointer my-[1rem]'>{isLoading? "signing in ....":"sign in "}</button>
            {isLoading &&<Loader />}
          </form>
          
        <div className='mt-4'>
          <p className='text-black'>
            New Customer ? {""}
            <Link to={redirect ? `/register?redirect=${redirect}` :'/register'}
            className='text-pink-500 hover:underline'>register</Link>
          </p>
        </div>
        </div>
      </section>
    </div>
  )
}

export default Login
