import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  './index.css'
import App from './App.jsx'
import { Route,RouterProvider,createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/features/store.js';
import Profile from './pages/user/profile.jsx'

// navigation
import Home from './Home.jsx'
import Favorites from './pages/Products/Favourites.jsx'
import ProductDetails from './pages/Products/ProductDetails.jsx'
// private route
import PrivateRoutes from './components/PrivateRoutes.jsx'

//  auth
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx'

// admin Route
import AdminRoutes from './pages/Admin/AdminRoutes.jsx'
import UserList from './pages/Admin/UserList.jsx'
import CategoryList from './pages/Admin/Categorylist.jsx'
import ProductList from './pages/Admin/ProductList.jsx';
import UpdateProduct from './pages/Admin/UpdateProduct.jsx';
import AllProductList from './pages/Admin/AllProductList.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >

   <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route index={true} path='/' element={<Home />} />
    <Route path='/favorite' element={<Favorites />} />
    <Route path='/product/:id' element={<ProductDetails />} />

    <Route path='' element={<PrivateRoutes />} >
      <Route path='/profile' element={<Profile />} />
    </Route>
   {/* admin route */}
   <Route path='/admin'element={<AdminRoutes />}>
      <Route path='userlist' element={<UserList />} />
      <Route path='categorylist' element={<CategoryList />} />
      <Route path='productlist' element={<ProductList />} />
      <Route path='allproductslist' element={<AllProductList />} />
      <Route path='product/update/:_id' element={<UpdateProduct />} />
   </Route>
     </Route>
     )
)


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  
)
