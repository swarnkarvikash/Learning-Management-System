import {FiMenu} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link , useNavigate} from 'react-router-dom';
import Footer from '../Components/Footer';
import { logout } from '../Redux/Slices/AuthSlice';

function HomeLayout({ children }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state ?.auth?.isLoggedIn);

    //for diaplaying the options acc to role
    const role = useSelector((state) => state?.auth?.role);

    function changeWidth(){
        const drawerSide = document.getElementsByClassName("drawer-side");
        drawerSide[0].style.width = 'auto';
    }

    function hideDrawer(){
        const element = document.getElementsByClassName("drawer-toggle");
        element[0].checked = false;

        const drawerSide = document.getElementsByClassName("drawer-side");
        drawerSide[0].style.width = 0;
    }

    async function handlelogout(e) {
        e.preventDefault();

        const response = await dispatch(logout());
        if(response?.payload?.data)
            navigate("/");
    }

    return (
        <div className="min-h-[90vh]">
            <div className="drawer absolute left-0 z-50 w-fit">
                <input className="drawer-toggle" id="my-drawer" type="checkbox" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer relative">
                        <FiMenu 
                            onClick={changeWidth}
                            size = {"32px"}
                            className="font-bold text-white m-4"
                        />
                    </label>
                </div>
                <div className="drawer-side w-0">
                    <label htmlFor="my-drawer" className='drawer-overlay'>
                    </label>
                    <ul className="menu p-4 w-48 h-screen sm:w-80 bg-base-100 text-base-content flex flex-col justify-between">
                        <li className='w-fit absolute right-2 z-50'>
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24}></AiFillCloseCircle>
                            </button>
                        </li>
                        <div>
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link to="/admin/dashboard">Admin DashBoard</Link>
                            </li>
                        )}
                        {isLoggedIn && role === 'ADMIN' && (
                            <li>
                                <Link to="/courses/create"> Create New courses</Link>
                            </li>
                        )}

                        <li>
                            <Link to="/courses">All Courses</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link to="/about">About Us</Link>
                        </li>
                        </div>
                        {!isLoggedIn && (
                            <li className='relative bottom-4 w-[90%]'>
                            <div className="w-full flex items-center justify-center">
                                <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full bg-blue-600'>
                                    <Link to="/login">Login</Link>
                                </button>
                                <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full bg-pink-600'>
                                    <Link to="/signup">Signup</Link>
                                </button>
                            </div>
                            </li>
                        )}

                    {isLoggedIn && (
                            <li className='relative bottom-4 w-[90%]'>
                            <div className="w-full flex items-center justify-center">
                                <button className='btn-primary px-4 py-1 font-semibold rounded-md w-full bg-blue-600'>
                                    <Link to="/user/profile">Profile</Link>
                                </button>
                                <button className='btn-secondary px-4 py-1 font-semibold rounded-md w-full bg-pink-600'>
                                    <Link onClick={handlelogout}>Logout</Link>
                                </button>
                            </div>
                            </li>
                        )}


                    </ul>
                </div>
            </div>
        
            { children }

            <Footer />
        </div>
    )
}

export default HomeLayout;