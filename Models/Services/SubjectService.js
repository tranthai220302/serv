import { Op, where } from "sequelize";
import db from "../Entitys/index.js";

export const getSubjectsService = async () => {
    try {
        const subjects = await db.subject.findAll({
            where: {
                id: {
                    [Op.notIn]: [13, 14, 15]
                }
            }
        });
        return subjects;
    } catch (error) {
        return error;
    }
}