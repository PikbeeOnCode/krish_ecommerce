import React from 'react'
import { useState,useEffect } from 'react'
import { Link,useLocation,useNavigate } from 'react-router'
import { useDispatch,useSelector } from 'react-redux'
import Loader from '../../components/Loader'
import { setCredintials } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import { useRegisterMutation } from '../../redux/api/userApiSlice'



const Register = () => {
    const [userName,setUserName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[ confirmpassword,setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isloading}] = useRegisterMutation();
    const {userInfo} = useSelector(state => state.auth);

    const {search} = useLocation()
    const sp = new URLSearchParams(search);
    const redirect  = sp.get('redirect') || '/'

    useEffect(()=>{
    if(userInfo){
        navigate(redirect);
    }
    },[navigate,redirect,userInfo]);

    // submit handler 

    const submithandler =async(e)=>{
        e.preventDefault();
        if(password !== confirmpassword){
            toast.error("passwords do not matched");
        }else{
            try {
                const  res = await register({username:userName,email,password}).unwrap();
                dispatch(setCredintials({...res}))
                navigate(redirect)
                toast.success("User sucessfully registred");
            } catch (error) {
                console.log(error);
                 toast.error(error?.data?.message || "Registration failed");
            }
        }
    }
  return (
   <section className='pl-[10rem] flex  flex-wrap'>
    <div className='mr-[4rem] mt-[5rem]'>
        <h1 className='text-2xl  font-semibold mb-4'>Register</h1>
        <form
        onSubmit={submithandler}
         className='container w-[35rem]' >
            {/* user name input  */}
            <div className='my-[2rem]'>
                <label
                 htmlFor="name"
                 className='block text-sm font-medium text-white'
                >Name</label>
                <input type="text"
                id='name'
                className='mt-1 p-2 border rounded w-full'
                placeholder='Enter your name'
                value={userName}
                onChange={e=> setUserName(e.target.value)} />
            </div>
            {/* email input */}
                 <div className='my-[2rem]'>
                <label
                 htmlFor="email"
                 className='block text-sm font-medium text-white'
                >email</label>
                <input type="email"
                id='email'
                className='mt-1 p-2 border rounded w-full'
                placeholder='Enter your email'
                value={email}
                onChange={e=> setEmail(e.target.value)} />
            </div>
            {/* password input */}
                 <div className='my-[2rem]'>
                <label
                 htmlFor="password"
                 className='block text-sm font-medium text-white'
                >password</label>
                <input type="password"
                id='password'
                className='mt-1 p-2 border rounded w-full'
                placeholder='Enter  password'
                value={password}
                onChange={e=> setPassword(e.target.value)} />
            </div>

{/* confirm password input  */}
                 <div className='my-[2rem]'>
                <label
                 htmlFor="confirmPassword"
                 className='block text-sm font-medium text-white'
                >Confirm Password</label>
                <input type="Password"
                id='confirmPassword'
                className='mt-1 p-2 border rounded w-full'
                placeholder='Enter confirm password '
                value={confirmpassword}
                onChange={e=> setConfirmPassword(e.target.value)} />
            </div>

    {/* register button */}
    <button 
    disabled={isloading}
    type='submit'
    className='bg-pink-500 text-white px-4 py-2 rounded cursor-pointer  my-[1rem]'>
        {isloading? "registering ....." : "register"}
    </button>
    {isloading && <Loader/>}
        </form>

        <div className='mt-4'>
            <p className='text-white'>
                already have an account ? {""}
                <Link 
                to={redirect? `/login?redirect=${redirect}` : "/login"}
                className='text-pink-500 hover:underline'>
                    login
                </Link>
            </p>
        </div>    
    </div>
    <img src="https://images.unsplash.com/photo-1741682044306-68905693a8e8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt=""
    className='mt-[3rem] ml-[3rem] h-[45rem] w-[45%] xl:block md:hidden sm:hidden rounded-lg' />
   </section>
  )
}

export default Register