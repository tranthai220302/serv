
import dayjs from "dayjs";
import db from "../Entitys/index.js"
import { DATE, Op } from "sequelize";
import moment from "moment";

export const createReasonService = async(data, id) =>
{
    try {
        const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7'];
        const date = new Date(data.date);
        const dayOfWeekIndex = date.getDay();
        const index = daysOfWeek[dayOfWeekIndex];
        const reason = await db.reason.create({
            date : data.date,
            reason : data.reason,
            day : index,
            TeacherId : id
        })
        return reason;
    } catch (error) {
        return error;
    }
}
export const getReasonTeacherService = async(id) => {
    try {
        const reasons = await db.reason.findAll({
            where : {
                TeacherId : id
            },
            include : [
                {
                    model : db.teacher,
                    include : [
                        {
                            model : db.user
                        }
                    ]
                }
            ]
        })
        let data = [];
        reasons.map((item)=>{
            data.push({
                id : item.id,
                name : item.Teacher.User.name,
                reason : item.reason,
                date : dayjs(item.date).format('YYYY-MM-DD')
            })
        })
        return data;
    } catch (error) {
        return error;
    }
}
export const getReasonByDateService = async(date) =>
    {
        try {
            const validDate = moment(date, 'DD-MM-YYYY', true).isValid() ? moment(date, 'DD-MM-YYYY').toISOString() : date;
            const reason = await db.reason.findAll({
                where : {
                    date : {
                        [Op.gte] : validDate
                    }
                },
                include : [
                    {
                        model : db.teacher,
                        include : [
                            {
                                model : db.user
                            }
                        ]
                    }
                ]
            })
            return reason;
        } catch (error) {
            return error;
        }
    }
export const getReasonsService = async(isConfirm) =>{
    try {
        const date = new Date();
        const validDate = moment(date, 'DD-MM-YYYY', true).isValid() ? moment(date, 'DD-MM-YYYY').toISOString() : date;
        const reasons = await db.reason.findAll({
            where : {
                [Op.and] : [
                    {
                        date : {
                            [Op.gte] : validDate
                        }
                    },
                    {
                        isConfirm
                    }
                ]
            },
            include : [
                {
                    model : db.teacher,
                    include : [
                        {
                            model : db.user
                        }
                    ]
                }
            ],
            order: [['createdAt', 'ASC']],
        })
        let data = [];
        reasons.map((item)=>{
            data.push({
                id : item.id,
                name : item.Teacher.User.name,
                reason : item.reason,
                date : dayjs(item.date).format('YYYY-MM-DD')
            })
        })
        return data;
    } catch (error) {
        return error;
    }
}