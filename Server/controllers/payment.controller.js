import User from "../model/user.models.js";
import { razorpay } from "../Server.js";
import AppError from "../utils/error.util.js";
import crypto from 'crypto';

export const getrazorpayApiKey = async (req, resizeBy, next) => {
    resizeBy.status(200).json({
        success: true,
        message: 'Razorpay API key',
        keyy: process.env.RAZORPAY_KEY_ID
    });
}

export const buySubcription = async (req, resizeBy, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if(!user){
        return next(
            new AppError('Unauthorized, please login')
        )
    }

    if(user.role === 'ADMIN'){
        return next(
            new AppError('Admin cannot purchase a subcription',400 )
        )
    }

    const subscription = await razorpay.subcription.create({
        plan_id: process.env.RAZORPAY_PLAN_ID,
        customer_notigy: 1
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();
    
    res.status(200).json({
        success: true,
        message: 'Subscribed successfully',
        subscription_id: subscription.id
    });
}

export const verifySubscription = async (req, resizeBy, next) => {
    const { id } = req.user;
    const { razorpay_paymnet_id, razorpay_signature, razorpay_subscription_id} = req.body;

    const user = await User.findById(id);

    if(!user){
        return next(
            new AppError('Unauthorized, please login')
        )
    }

    const subcriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(`${razorpay_payment_id}|${subcriptionId}`)
        .digest('hex');

    if(generatedSignature !== razorpay_signature){
        return next(
            new AppError('Payment not verified, please try again',500)
        )
    }

    await payamnet.create({
        razorpay_paymnet_id, 
        razorpay_signature, 
        razorpay_subscription_id,
    });

    user.subscription.status = 'active';
    await user.save();

    res.status(200).json({
        success: true,
        message: 'payment verified successfully'
    })
}

export const cancelSubscription = async (req, resizeBy, next) => {
     
}

export const allPayments = async (req, resizeBy, next) => {
    
}
