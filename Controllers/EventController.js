import { createEventService, getEventService } from "../Models/Services/EventService.js";

export const createEvent = async(req, res, next) => {
    try {
        const data = req.body;
        console.log(data);
        const event = await createEventService(data);
        if(event instanceof Error) return next(event);
        return res.status(200).send(event);
    } catch (error) {
        next(error);   
    }
}

export const getEvent = async(req, res, next) => {
    try {
        const events = await getEventService();
        if(events instanceof Error) return next(events);
        return res.status(200).send(events);
    } catch (error) {
        next(error);
    }
}