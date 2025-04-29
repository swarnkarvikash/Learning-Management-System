// //import express from 'express';
// import { v2 } from 'cloudinary';
// import { config } from 'dotenv';  
// config();
// import app from './app.js';
import connectToDB from './config/dbconnection.js';
// import  cloudinary from 'cloudinary';
// import Razorpay from 'razorpay';
import { v2 } from 'cloudinary';
import Razorpay from 'razorpay';

import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';


  //Cloudinary configuration
  v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ this is the correct env variable name
  });
  

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, async () => {
    await connectToDB();
    console.log(`App is running at http://localhost:${PORT}`);
  });