import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { createSchedule, deleteSchedule, generateTimeTable, generateTimeTableAfternoon, getScheduleByClazz, getTimeTable, getTimeTableByTeacher, sortTimeTable, sortTimeTableAfterNoon } from '../Controllers/ScheduleController.js';
import { getTimeTableService } from '../Models/Services/ScheduleService.js';

const routerSchedule = express.Router()
routerSchedule.get('/generate', generateTimeTable);
routerSchedule.get('/generate/afternoon', generateTimeTableAfternoon);
routerSchedule.get('/sort', sortTimeTable)
routerSchedule.get('/sort/afternoon', sortTimeTableAfterNoon)
routerSchedule.get('/teacher', getTimeTableByTeacher)
routerSchedule.get('/class/:id', getScheduleByClazz)
routerSchedule.post('/create', createSchedule)
routerSchedule.delete('/delete/:id', deleteSchedule)
routerSchedule.get('/timetable', getTimeTable)
export default routerSchedule;