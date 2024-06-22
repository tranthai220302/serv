import { searchClazzService, getScheduleByClazzService } from "../Models/Services/SchoolClassService.js"

export const searchClazz = async(req, res, next) =>{
    try {
        console.log(req.query)
        const found = await searchClazzService(req.query.search);
        return res.status(200).send(found)
    } catch (error) {
        next(error);
    }
}

export const getScheduleByClazz = async(req, res, next) => {
    try {
        const schedule = await getScheduleByClazzService(req.params.isMorning);
        if(schedule instanceof Error) return next(schedule);
        return res.status(200).send(schedule);
    } catch (error) {
        next(error)
    }
}