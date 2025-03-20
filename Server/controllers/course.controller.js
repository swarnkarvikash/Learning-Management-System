 import { response } from "express";
import Course from"../model/course.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const getAllCourses = async function(req, res, next){

    try{
        const courses = await Course.find({}).select('-lectures');

    res.status(200).json({
        success: true,
        message: 'All course',
        courses,
    });
    }catch(e){
        return next(
            new AppError(e.message,500)
        )
    }
    
}

const getLecturesByCourseId = async function(req, res, nex){
    try{
        const {id} = req.paramas;

        const course = await Course.findById(id);

        if(!course){
            return next(
                new AppError('Invalid course id',400)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures
        });
    }catch(e){
        return next(
            new AppError(e.message,500)
        )
    }
}

const createCourse = async (req,res,next) => {
     const { title, description, category, createdBy } = req.body;

     if(!title || !description || !category || !createdBy){
        return next(
            new AppError('All fields are required',400)
        )
     }

     const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbanail: {
            public_id: 'Dummy',
            secure_url: 'Dummy',
        }
     });

     if(!course) {
        return next(
            new AppError('Course Could not create, please try agaain',500)
        )
     }

     if(req.file){
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
            if(result){
                course.thumbanail.public_id = result.public_id;
                course.thumbanail.secure_url = result.secure_url;
            }
    
            fs.rm(`uploads/${req.file.filename}`);
        }catch(e){
            return next(
                new AppError(e.message,500)
            )
        }

     }
     await course.save();

     res.status(200).json({
        success: true,
        message: 'Course created successfully',
        course,
     })
}

const updateCourse = async(req,res,next) => {
    try{
        const { id } = req.paramas;
        const course = await Course.findByIdAndUpdate({
            id,
            $set : req.body
        },
    {
        runValidators: true
    });
    if(!course){
        return next(
            new AppError(`Course with given id does not exist`,500)
        )
    }

    res.status({
        success:true,
        message: 'Course updated succesfully',
        course
    })
    }catch(e){
        return next(
            new AppError(e.message,500)
        )
    }
}

const removeCourse = async(req,res,next) => {
    try{
        const { id } = req.paramas;
        const course = await Course.findById(id);

        if(!course){
            return next(
                new AppError(`Course with given id does not exist`,500)
            )
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted succesfully'
        })

    }catch(e){
        return next(
            new AppError(e.message,500)
        )
    }
}

const addLectureToCourseById = async (req, res, next) => {
        try{
            const {title, description} = req.body;
            const {id} = req.paramas;
    
            if(!title || !description){
                return next(
                    new AppError('All fields are required',400)
                )
             }
    
            const course = await Course.findById(id);
    
            if(!course) if(!course){
                return next(
                    new AppError(`Course with given id does not exist`,500)
                )
            }
    
            const lectureData = {
                title,
                description,
                lecture:{}
            };
    
            if(req.file){
                try{
                    const result = await cloudinary.v2.uploader.upload(req.file.path, {
                        folder: 'lms'
                    });
                    if(result){
                        lectureData.lecture.public_id = result.public_id;
                        lectureData.lecture.secure_url = result.secure_url;
                    }
            
                    fs.rm(`uploads/${req.file.filename}`);
                }catch(e){
                    return next(
                        new AppError(e.message,500)
                    )
                }
        
             }
    
             course.lectures.push(lectureData);
    
             course.numbersOfLectures = course.lectures.length;
    
             await course.save();
    
             res.status(200).json({
                success: true,
                message: 'lecture successfully added to the course',
                course
             })
        }catch(e){
            return next(
                new AppError(e.message,500)
            )
        }
        
}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}