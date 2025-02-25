import mongoose from "mongoose";
// import dotenv from 'dotenv';
// dotenv.config();

mongoose.set('strictQuery', false);

const connectToDB = async () => {
    try{
        const { connection } = await mongoose.connect(
            process.env.MONGO_URI || `mongodb://localhost:27017/lms`
        );
        if(connection) {
            console.log(`Connected to MongoDB : ${connection.host}`);
        }
    }catch(e){
        console.log(e);
        process.exit(1);
    }

}

export default connectToDB;