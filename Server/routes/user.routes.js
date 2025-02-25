import {Router} from "express";
import { forgotPassword, getProfile, login, logout, register, resetPassword, changePassword, updateUser } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/register',upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);
router.post('/reset', forgotPassword);
router.post('/reset/resetToken', resetPassword);
router.post('/chaange-password', isLoggedIn, changePassword);
router.put('update',isLoggedIn, upload.single("avater", updateUser));



export default router;