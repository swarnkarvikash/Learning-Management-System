import User from "../model/user.models.js";
import { razorpay } from "../Server.js";
import AppError from "../utils/error.util.js";
import crypto from 'crypto';
import Payment from '../model/payment.model.js'; // if defined
//import payments from "model/payment.model.js";


export const getrazorpayApiKey = async (req, res, next) => {
    try{
        res.status(200).json({
            success: true,
            message: 'Razorpay API key',
            key: process.env.RAZORPAY_KEY_ID
        });
    }catch(e){
        return next(
            new AppError(e.message, 500)
        );
    }
}

export const buySubcription = async (req, res, next) => {
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

    const subscription = await razorpay.subscription.create({
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
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id} = req.body;

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

    await Payment.create({
        razorpay_payment_id, 
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
    try{
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
   
       const subscriptionId = user.subscription.id;
   
       const subscription = await razorpay.subscriptions.cancel(
           subscriptionId
       )
   
       user.subscription.status = subscription.status;
   
       await user.save();
    }catch(e){
        return next(
            new AppError(e.message, 500)
        )
    }
}

export const allPayments = async (req, res, next) => {
    const { count } = req.query;

    const subscriptions = await razorpay.subscriptions.all({
        count : count || 10,
    });

    res.status(200).json({
        success: true,
        message: 'All Payment',
        subscriptions
    })
}
