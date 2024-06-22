import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getListClazzService } from '../Models/Services/ClazzController.js';
import { getListClazz } from '../Controllers/ClazzController.js';


const routerClazz = express.Router()
routerClazz.get('/', getListClazz);
export default routerClazz;