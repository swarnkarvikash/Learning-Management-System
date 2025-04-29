import { Router } from "express";
import { allPayments, buySubcription, cancelSubscription, getrazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js";
import { authorizedRoles, isLoggedIn, authorizeSubscriber } from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route('/razorpay-key')
    .get(
        isLoggedIn,
        getrazorpayApiKey
    );

router
    .route('/subscribe')
    .post(
        isLoggedIn,
        buySubcription
    );

router
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription
    );

router
    .route('/unSubcribe')
    .post(
        isLoggedIn,
        authorizeSubscriber,
        cancelSubscription
    );

router
    .route('/')
    .get(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        allPayments
    );

export default router;