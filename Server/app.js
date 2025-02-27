import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import useRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.routes.js';
config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());

app.use('/ping',function(req,res){
    res.send('Pong');
});

app.use(morgan('dev'));

// routes of 3 modules

app.use('/api/v1/user', useRoutes);
app.use('/api/v1/courses',courseRoutes);


app.all('*',(req,res) => {
    res.status(400).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);

export default app;