import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { createEvent, getEvent } from '../Controllers/EventController.js';



const routerEvent = express.Router()
routerEvent.post('/create', createEvent);
routerEvent.get('/', getEvent);
export default routerEvent;