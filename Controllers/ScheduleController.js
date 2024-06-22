
import createError from "../ultis/createError.js";
import GeneticAlgorithmService from "../Models/Services/GeneticAlgorithmService.js";
import { createScheduleService, deleteScheduleService, getScheduleByClazzService, getTimeTableByTeacherService, getTimeTableService } from "../Models/Services/ScheduleService.js";
export const generateTimeTable = async(req, res, next) =>{
    try {
        const geService = new GeneticAlgorithmService();
        await geService.prepareData();
        await geService.generateBase();
        geService.addDataMorning();
        return res.status(200).send(geService.results);
    } catch (error) {
        next(error)
    }
}
export const sortTimeTable = async(req, res, next) =>{
    try {
        const geService = new GeneticAlgorithmService(req.query.date);
        await geService.prepareData();
        await geService.generateBase();
        geService.addDataMorning();
        await geService.evolutionToCorrect();
        const isMorning = 1;
        await geService.fineTuning(1, 20, isMorning)    
        return res.status(200).send({
            data : geService.bestTimeTable,
            run : geService.run
        });
    } catch (error) {
        next(error)
    }
}
export const generateTimeTableAfternoon = async(req, res, next) =>{
    try {
        const geService = new GeneticAlgorithmService();
        await geService.prepareData();
        await geService.generateBaseAfterNoon();
        
        return res.status(200).send(geService.results);
    } catch (error) {
        next(error)
    }
}
export const sortTimeTableAfterNoon = async(req, res, next) =>{
    try {
        const geService = new GeneticAlgorithmService(req.query.date);
        await geService.prepareData();
        await geService.generateBaseAfterNoon();
        geService.addData()
        await geService.evolutionToCorrect();
        const isMorning = 0;
        await geService.fineTuning(1, 20, isMorning);
        return res.status(200).send({
            data : geService.bestTimeTable,
            run : geService.run
        });
    } catch (error) {
        next(error)
    }
}
export const getTimeTableByTeacher = async(req, res, next) =>{
    try {
        const timeTable = await getTimeTableByTeacherService(req.query.isMorning);
        return res.status(200).send(timeTable);
    } catch (error) {
        next(error);   
    }
}

export const getScheduleByClazz = async(req, res, next) => {
    try {
        const schedule = await getScheduleByClazzService(req.params.id, req.query.page, 5);
        if(schedule instanceof Error) return next(schedule);
        return res.status(200).send(schedule);
    } catch (error) {
        next(error);
    }
}

export const createSchedule = async(req, res, next) => {
    try {
        const schedule = await createScheduleService(req.body.data);
        if(schedule instanceof Error) return next(schedule);
        return res.status(200).send(schedule);
    } catch (error) {
        next(error);
    }
}

export const deleteSchedule = async(req, res, next) => {
    try {
        const deleteS = await deleteScheduleService(req.params.id);
        if(deleteS instanceof Error) return next(deleteS);
        return res.status(200).send(deleteS);
    } catch (error) {
        next(error);
    }
}
export const getTimeTable = async(req, res, next) => {
    try {
        console.log("cc");
        const timeTable = await getTimeTableService(req.query.isMorning);
        if(timeTable instanceof Error) return next(timeTable);
        return res.status(200).send(timeTable);
    } catch (error) {
        next(error);
    }
}
