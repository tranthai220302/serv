import { Op, where } from "sequelize";
import db from "../Entitys/index.js"
import createError from "../../ultis/createError.js";

export const createNewService = async (data) => {
    try {
        const newService = await db.new.create({
            name: data.name,
            desc: data.des,
            img : data.img,
            created_at: data.date
        })
        return newService;
    } catch (error) {
        return error;
    }
}

export const getNewServiceCurren = async () => {

    try {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const listServices = await db.new.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startOfToday,
                    [Op.lte]: endOfToday
                }
            }
        });
        return listServices;
    } catch (error) {
        return error;
    }
}

export const getNewById = async (id) => {
    try {
        const newId = await db.new.findOne({
            where : {id}
        })
        if(!newId) return createError(400, "New not found!");
        return newId;
    } catch (error) {
        return error;
    }
}

export const deleteNewById = async(id) => {
    try {
        await db.new.destroy({
            where : {id}
        })
    } catch (error) {
        return error;
    }
}