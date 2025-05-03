import { BsPersonCircle } from 'react-icons/bs';
import HomeLayout from '../Layouts/HomeLayout';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
//import { createAccount } from '../Redux/Slices/AuthSlice';
import { createAccount } from '../Redux/Slices/AuthSlice';
import { isEmail, isValidPassword } from '../Helpers/regexMatcher';



function Signup() {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [prevImage, setPreviewImage] = useState("");

    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
        avatar: ""
    });

    function handleUserInput(e){
        const {name, value} = e.target;
        setSignupData({
            ...signupData,
            [name] : value
        })
    }

    function getImage(event) {
        event.preventDefault();
        //getting the image
        const uploadedImage = event.target.files[0];

        if(!uploadedImage) return;
        setSignupData({
                ...signupData,
                avatar: uploadedImage
            });
        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImage);
        fileReader.addEventListener("load", function () {
            setPreviewImage(this.result);
        })
        
    }

    async function createNewAccount(event){
        event.preventDefault();
        if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar){
            toast.error("Please fill all the details");
            return;
        }

        if(signupData.fullName.length < 5){
            toast.error("Name should be atleast of 5 characters");
            return;
        }

        if(!isEmail(signupData.email)){
            toast.error("Invalid email id");
            return;
        }
        

        if (!isValidPassword(signupData.password)) {
            toast.error("Password should contain at least one uppercase letter, one lowercase letter, and one digit");
            return;
        }
        
        
          
        
        

        const formData = new FormData();
        formData.append("fullName", signupData.fullName);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);

        //dispatch create account action

        const response = await dispatch(createAccount(formData));


        if(response?.payload?.data) {
            navigate("/");
        }
        setSignupData({
            fullName: "",
            email: "",
            password: "",
            avatar: ""
        });
        setPreviewImage("");
    }

    return(
        <HomeLayout>
            <div className='flex items-center justify-center h-[90vh] '>
                <form noValidate onSubmit={createNewAccount} className='flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]'>
                    <h1 className='text-center text-2xl font-bold'>Registration Page</h1>

                    <label htmlFor="image_uploads" className='cursor-pointer'>
                        {prevImage  ? (
                            <img src={prevImage} alt="" className='w-24 h-24 rounded-full m-auto'/>
                        ) : (
                            <BsPersonCircle className='w-24 h-24 rounded-full m-auto' />
                        )}
                    </label>
                    <input 
                    onChange={getImage}
                    type="file" 
                    className='hidden'
                    name='image_uploads'
                    id='image_uploads'
                    accept='.jpg, .jpeg, .png, .svg'
                    />

                    <div className='flex flex-col gap-1'>
                        <label htmlFor="email" className='font-semibold'>Email</label>
                        <input 
                        type="email"
                        required
                        name='email'
                        id='email'
                        placeholder='Enter your email'
                        className='bg-transparent px-2 py-1 border'
                        onChange={handleUserInput}
                        value={signupData.email}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="password" className='font-semibold'>Password</label>
                        <input 
                        type="password"
                        required
                        name='password'
                        id='password'
                        placeholder='Enter your password'
                        className='bg-transparent px-2 py-1 border'
                        onChange={handleUserInput}
                        value={signupData.password}
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="fullName" className='font-semibold'>Name</label>
                        <input 
                        type="text"
                        required
                        name='fullName'
                        id='fullName'
                        placeholder='Enter your name..'
                        className='bg-transparent px-2 py-1 border'
                        onChange={handleUserInput}
                        value={signupData.fullName}
                        />
                    </div>

                    <button type='submit' className=' mt-2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-n-out duration-300 rounded py-2 font-semibold test-lg cursor-pointer'>
                        Create Account
                    </button>
                        <p className='text-center'>
                            Already have an account ? <Link to="/login" className="link text-accent cursor-pointer">Login</Link>
                        </p>
                </form>
            </div>
        </HomeLayout>
    )
}

export default Signup;