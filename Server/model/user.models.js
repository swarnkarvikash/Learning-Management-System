import { Schema, model} from "mongoose";
//import {bcrypt,  compare } from 'bcryptjs';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new Schema({
    fullName:{
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [5, 'Name must be Atleast 5 charachter'],
        maxLength: [50, 'Name should be less than 50 characters'],
        lowercase: true,
        trim: true,
    },
    email:{
        type:'String',
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        // match: ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        //     'Please fill in a valid email address',
        // ]
    },
    password:{
        type: 'String',
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be atLeast 8 characters'],
        select: false
    },
    avatar: {
        public_id:{
            type: 'String'
        },
        secure_url: {
            type: 'String'
        }
    },
    ole:{
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }, 
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.method = {
    generateJWTToken: function() {
        return jwt.sign(
            {
                id: this._id, email: this.email, subscription: this.subscription, role: this.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )
    },
    comparePassword: async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generatePasswordResetToken: async function() {
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto
        .createHash('sha256') //sha256 is algorithm
        .update(resetToken)
        .digest('hex')
        ;
        this.forgotPasswordExpiry = Date.now()+ 15*601*1000; //15 min from now

        return 
    }
}

const User = model("User", userSchema);

export default User;