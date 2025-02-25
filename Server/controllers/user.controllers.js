import AppError from "../utils/error.util.js";
//const { User } = require('./models');
import User from "../model/user.models.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

const cookeOptions = {
    maxAge: 7*24*60*60*1000, // 7days
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({email });

    if(userExists) {
        return next(new AppError('Email already exists', 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id : email,
            secure_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoFRQjM-wM_nXMA03AGDXgJK3VeX7vtD3ctA&s',
        }
    });

    if(!user) {
        return next(new AppError('User registration failed, please try again', 400));
    }

    //TODO: File upload

    if(req.file){
        console.log(" File Details",JSON.stringify(req.file));
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure.url;

                //Remove file from server
                FileSystem.rm(`uploads/${req.file.filename}`)
            }
        }catch(e){
            return next(
                new AppError(error || 'File not uploaded, please try again', 500)
            )
        }
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookeOptions)

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user,
    });
};

const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return next(new AppError('All fields are required', 400));
        }
    
        const user = await User.findOne({
            email
        }).select('+password');;
    
        if(!user || !user.comparePassword(password)){
            return next(new AppError('Email or password does not match', 400));
        }
    
        const token = await user.generateJWTToken();
        user.password = undefined;
    
        res.cookie('token', token, cookeOptions);
    
        res.status(200).json({
            success: true,
            message: 'User loggedin successfully',
            user,
        });
    }catch(e){
        return next(new AppError(e.message, 500));
    }
};

const logout = (req,res) => {
    res.cookie('token',null,{
        secure: true,
        maxge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
};

const getProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User Details',
            user,
        });
    }catch(e){
        return next(new AppError('Failed to fetch profile detail',500));
    }

};

const forgotPassword = async (req, res, next) => {
    const {email} = req.email;

    if(!email){
        return next(new AppError('Email is required',400));
    }

    const user = await User.findOne({email});
    if(!user) {
        return next(new AppError('Email not registered',400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = 'Reset password';
    const message = `${resetPasswordURL}`;
    try{
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`
        })
    }
    catch(e){

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();
        return next(new AppError(e.message,400));
    }
}

const resetPassword = async (req, res) => {
    const { resetToken } =  req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: date.now()}
    });

    if(!user) {
        return next(
            new AppError('Token is invalid or expired, please try again', 400)
        )
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.save();

    res.state(200).json({
        success: true,
        message: 'Password changed successfully'
    })
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if(!oldPassword || !newPassword){
        return next(
            new AppError('All fields are mandatory', 400)
        )
    }

    const user = await User.findById(id).select('+password');

    if(!user) {
        return next(
            new AppError('User does not exist', 400)
        )
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if(!isPasswordValid) {
        return next(
            new AppError('User does not exist', 400)
        )
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Password changed successfully!"
    });
}

const updateUser = async  (req,res) => {
    const { fullName } = req.body;
    const { id } = req.user.id;

    const user = await User.findById(id);

    if(!user){
        return next(
            new AppError('User does not exist',400)
        )
    }

    if(req.fullName) {
        user.fullName = fullName;
    }

    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try{
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure.url;

                //Remove file from server
                FileSystem.rm(`uploads/${req.file.filename}`)
            }
        }catch(e){
            return next(
                new AppError(error || 'File not uploaded, please try again', 500)
            )
        }
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Use details updated successfully!'
    });

}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser,
}