import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { creatQueston, getQuestionByHotel } from '../Controllers/QuestionController.js';
import { getQuestionByHotelService } from '../Models/Services/QuestionService.js';
const routerQuestion = express.Router()
routerQuestion.post('/create/:id', verifyjson, creatQueston);
routerQuestion.get('/:id', getQuestionByHotel)
export default routerQuestion;