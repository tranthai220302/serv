import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getScheduleByDate, getScheduleByTeacher, getTeacherBySubject, listTeacher, listTeacherHasSchedule, searchTeacher } from '../Controllers/TeacherController.js';
import { searchTeacherService } from '../Models/Services/TeacherService.js';


const teacherRoute = express.Router()
teacherRoute.get('/', listTeacher);
teacherRoute.get('/hasSchedule', listTeacherHasSchedule);
teacherRoute.get('/schedule', verifyjson, getScheduleByTeacher);
teacherRoute.get('/date', verifyjson, getScheduleByDate);
teacherRoute.get('/search', searchTeacher)
teacherRoute.get('/subject/:id', getTeacherBySubject)
export default teacherRoute;