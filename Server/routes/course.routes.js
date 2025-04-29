import {Router} from 'express';
import {removeCourse,updateCourse,createCourse, getAllCourses, getLecturesByCourseId, addLectureToCourseById } from '../controllers/course.controller.js';
import { isLoggedIn, authorizedRoles, authorizeSubscriber } from '../middlewares/auth.middleware.js';
import upload from "../middlewares/multer.middleware.js";

const router = new Router(); 

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single("thumbnail"),
        createCourse)
        .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse);
router.route('/:id')
    .get(isLoggedIn, getLecturesByCourseId,authorizeSubscriber)
    .put(isLoggedIn, authorizedRoles('ADMIN'),updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'),removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'),upload.single('lecture'),addLectureToCourseById);

export default router;