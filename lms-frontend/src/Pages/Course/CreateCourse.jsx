import {  useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast'; 
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../layouts/HomeLayout"; 
import { AiOutlineArrowLeft } from "react-icons/ai";


function CreateCourse(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail : null,
        previewImage: ""
    });

  function handleImageUpload(e) {
        e.preventDefault();
        const uploadImage = e.target.files[0];
        if(uploadImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadImage);
            fileReader.addEventListener("load",function(){
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadImage
                })
            })
        }
        
    }

    function handleUserInput(e){
        const {name, value} = e.target;
        setUserInput({
            ...userInput,
            [name]:value
        })
    }

   async function onFormSubmit(e){
        e.preventDefault();

        if(!userInput.title || !userInput.description || !userInput.category || !userInput.thumbnail || !userInput.createdBy){
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));

        if(response?.payload?.success){
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail : null,
                previewImage: ""
            })
            navigate("/courses");
        }
        
    }

    return (
        <HomeLayout>
           <div className="flex items-center justify-center h-[100vh]">
           <form
             onSubmit={onFormSubmit}
             className="flex flex-col justify-center gap-5 p-4 rounded-lg text-white w-[700px]my-10 shadow-[0_0_10px_black] relative"
             action="">

                <Link className="absolute top-8 text-2xl link text-accent cursor-pointer">
                    <AiOutlineArrowLeft />
                </Link>
                <h1 className="text-center text-2xl font-bold">
                    Create New Courses
                </h1>

                <main className="grid grid-col-2 gap-x-10">
                    <div className="gap-y-6">
                        <div>
                            <label htmlFor="image_uploads" className="cursor-pointer">
                                { userInput.previewImage ? (
                                    <img 
                                    className="w-full h-44 m-auto border"
                                    src= {userInput.previewImage}
                                    />
                                ): (
                                    <div className="w-full h-44 m-auto flex items-center justify-center border">
                                        <h1 className="font-bold text-lg">Upload Your course thumbnail</h1>
                                    </div>
                                )}
                            </label>
                            <input 
                            className="hidden"
                            id="image_uploads"
                            accept=".jpg,.jpeg,.png"
                            name="image_uploads"
                            type="file"
                            onChange={handleImageUpload} />
                        </div>
                        <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="text-lg font-semibold">
                                    Course title
                                </label>
                                <input 
                                required
                                name="title"
                                id="title"
                                placeholder="Enter course title"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.title}
                                onChange={handleUserInput}
                                type="text" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col gap-1">
                                <label htmlFor="createdBy" className="text-lg font-semibold">
                                    Course Instructor
                                </label>
                                <input 
                                required
                                name="createdBy"
                                id="createdBy"
                                placeholder="Enter course instructor"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.createdBy}
                                onChange={handleUserInput}
                                type="text" 
                                />
                        </div>

                        <div className="flex flex-col gap-1">
                                <label htmlFor="category" className="text-lg font-semibold">
                                    Course Category
                                </label>
                                <input 
                                required
                                name="category"
                                id="category"
                                placeholder="Enter course category"
                                className="bg-transparent px-2 py-1 border"
                                value={userInput.category}
                                onChange={handleUserInput}
                                type="text" 
                                />
                        </div>
                        <div className="flex flex-col gap-1">
                                <label htmlFor="description" className="text-lg font-semibold">
                                    Course description
                                </label>
                                <textarea
                                required
                                name="description"
                                id="description"
                                placeholder="Enter course description"
                                className="bg-transparent px-2 py-1 border h-24 overflow-y-scroll resize-none"
                                value={userInput.description}
                                onChange={handleUserInput}
                                type="text" 
                                />
                        </div>
                    </div>
                </main>
                
                <button type="submit" className="font-semibold w-full py-2 rounded-sm bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 text-lg ">
                    Create Course
                </button>
            </form>
           </div>
        </HomeLayout>
    )
}

export default CreateCourse;