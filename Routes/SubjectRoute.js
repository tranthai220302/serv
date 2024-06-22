import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getSubjectsService } from '../Models/Services/SubjectService.js';
import { getSubjects } from '../Controllers/SubjectController.js';


const subjectRoute = express.Router()
subjectRoute.get('/', getSubjects);
export default subjectRoute;