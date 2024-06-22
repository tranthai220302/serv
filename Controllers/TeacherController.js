import { getScheduleByDateService, getScheduleByTeacherService, getTeacherBySubjectService, getTeacherHasSchedule, listTeacherService, searchTeacherService } from "../Models/Services/TeacherService.js";

export const listTeacher = async(req, res, next)=>{
    try {
        return res.status(200).send(await listTeacherService());
    } catch (error) {
        next(error);
    }
}
export const listTeacherHasSchedule = async(req, res, next) =>{
    try {
        return res.status(200).send(await getTeacherHasSchedule());
    } catch (error) {
        next(error);
    }
}
export const getScheduleByTeacher = async(req, res, next) => {
    try {
        const schedule = await getScheduleByTeacherService(req.id, req.query.isMorning);
        if(schedule instanceof Error) return next(schedule);
        return res.status(200).send(schedule);
    } catch (error) {
        next(error);
    }
}

export const getScheduleByDate = async(req, res, next) => {
    try {
        const vacation = await getScheduleByDateService(req.id, req.query.date);
        if(vacation instanceof Error) return next(vacation);
        return res.status(200).send(vacation);
    } catch (error) {
        next(error);
    }
}
export const searchTeacher = async(req, res, next) => {
    try {
        const teacher = await searchTeacherService(req.query.search);
        if(teacher instanceof Error) return next(teacher);
        return res.status(200).send(teacher);
    } catch (error) {
        next(error);
    }
}

export const getTeacherBySubject = async(req, res, next) => {
    try {
        const teachder = await getTeacherBySubjectService(req.params.id);
        if(teachder instanceof Error) return next(teachder);
        return res.status(200).send(teachder);
    } catch (error) {
        next(error);
    }
}