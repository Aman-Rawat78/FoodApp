
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom"
import Login from './auth/Login'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import VerifyEmail from "./auth/VerifyEmail"
import MainLayout from "./layout/MainLayout"
import HereSection from "./components/HereSection"
import Profile from "./components/Profile"
import SearchPage from "./components/SearchPage"
import RestaurantDetail from "./components/RestaurantDetail"
import Cart from "./components/Cart"
import Restaurant from "./admin/Restaurant"
import AddMenu from "./admin/AddMenu"
import Orders from "./admin/Orders"
import Success from "./components/Success"
import { useUserStore } from "./store/useUserStore"
import { useEffect } from "react"
import Loading from "./components/Loading"
import { useThemeStore } from "./store/useThemeStore"

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
};


const AuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useUserStore();
  if(isAuthenticated && user?.isVerified){
    return <Navigate to="/" replace/>
  }
  return children;
};

const AdminRoute = ({children}:{children:React.ReactNode}) => {
  const {user, isAuthenticated} = useUserStore();
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }
  if(!user?.admin){
    return <Navigate to="/" replace/>
  }

  return children;
}

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:(  <ProtectedRoutes><MainLayout /></ProtectedRoutes>),
    children:[
      {
        path:"/",
        element:<HereSection/>
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/search/:text",
        element:<SearchPage/>
      },
      {
        path:"/restaurant/:id",
        element:<RestaurantDetail/>
      },
      {
        path:"/cart",
        element:<Cart/>
      },
      {
        path:"/order/status",
        element:<Success/>
      },
   

      //admin service start form here
      {
        path:"/admin/restaurant",
        element:<AdminRoute><Restaurant /></AdminRoute>,
      },
      {
        path:"/admin/menu",
        element:<AdminRoute><AddMenu /></AdminRoute>,
      },
      {
        path:"/admin/orders",
        element:<AdminRoute><Orders /></AdminRoute>,
      },
    ]
  },
  {
    path:"/login",
    element:<AuthenticatedUser><Login /></AuthenticatedUser>,
  },
  {
    path:"/signup",
    element:<AuthenticatedUser><Signup /></AuthenticatedUser> ,
  },
  {
    path:"/forgot-password",
    element: <AuthenticatedUser><ForgotPassword /></AuthenticatedUser>,
  },
  {
    path:"/resetpassword/:token",
    element:<ResetPassword/>
  },
  {
    path:"/verify-email",
    element: <AuthenticatedUser><VerifyEmail/></AuthenticatedUser>,
  },
  
])
function App() {
  const { checkAuthentication ,isCheckingAuth} = useUserStore();
  const initializeTheme = useThemeStore((state:any) => state.initializeTheme);
  
  // checking auth every time when app is loaded
  useEffect(()=>{
    checkAuthentication();
    initializeTheme();
  },[checkAuthentication])

  if(isCheckingAuth) return  <Loading/>
    
  return (
    <main>
      <RouterProvider router={appRouter}>

      </RouterProvider>
    </main>
  )
}

export default App;
