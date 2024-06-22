import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getScheduleByClazz, searchClazz } from '../Controllers/SchoolClassController.js';


const SClassRoute = express.Router()
SClassRoute.get('/search', searchClazz);
SClassRoute.get('/schedule/:isMorning', getScheduleByClazz)
export default SClassRoute;