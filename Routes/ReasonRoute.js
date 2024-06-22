import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { createReason, getReasonByDate, getReasonTeacher, getReasons } from '../Controllers/ReasonController.js';


const reasonRoute = express.Router()
reasonRoute.post('/create', verifyjson, createReason);
reasonRoute.get('/', verifyjson, getReasonTeacher);
reasonRoute.get('/date', verifyjson, getReasonByDate);
reasonRoute.get('/confirm/:isConfirm', getReasons)
export default reasonRoute;