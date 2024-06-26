
import createError from "../../ultis/createError.js";
import db from "../Entitys/index.js";
import { Op} from "sequelize";
import Api from "../../ultis/Api.js";

export const getBesTimeTableService = async(isMorning) => {
    try {
        const timeTable = await db.bestTimeTable.findOne({
            where : {
                isMorning : isMorning
            },
            order : [['createdAt', 'DESC']]
        })
        let data = {};
        for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
            for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
                let item = await db.bestTimeTableItem.findOne({
                    where : {
                        [Op.and] : [
                            {
                                BestTimeTableId : timeTable.id
                            },
                            {
                                key : `${day}-${order}`
                            }
                        ]
                    }
                })
                if(item){
                    data[`${day}-${order}`] = JSON.parse(item.data)
                }
            }
        }
        return data;
    } catch (error) {
        return error;
    }
}
export const getTimeTableByTeacherService = async(isMorning) =>{
    try {
        const bestTimeTable = await getBesTimeTableService(isMorning);
        // for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
        //     for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        //         if((day == 2 && order == 1 )|| (day == 7 && order == 5))
        //         {
        //             continue;
        //         }
        //         bestTimeTable[`${day}-${order}`].map((lesson)=>{
        //             if(lesson.TeacherId == id)
        //             {
        //                 schedule[`${day}-${order}`].push(lesson);
        //             }S
        //         })
        //     }
        // }
        return bestTimeTable;
    } catch (error) {
        return error;
    }
}
export const getScheduleByClazzService = async (id, page, bookPerPage) => {
    try {
        console.log(page)
        const offset = (page -1)*bookPerPage
        const schedule = await db.schedule.findAndCountAll({
            where: {
                SchoolClassId: id
            },
            include: [
                {
                    model: db.subject
                },
                {
                    model: db.teacher,
                    include: [
                        {
                            model: db.user
                        }
                    ]
                }
            ],
            limit : bookPerPage,
            offset: offset,
            order: [
                ['updatedAt', 'DESC']
            ]
        });
        const numPage = Math.ceil(schedule.count/5);
        return {
            schedule,
            numPage 
        };
    } catch (error) {
        return error;
    }
};
export const checkCreateScheduele = async(data) =>{
    try {
        const schedule = await db.schedule.find
    } catch (error) {
        
    }
}
export const createScheduleService = async(data) => {
    try {
        const checkSchedule = await db.schedule.findOne({
            where : {
                [Op.and] : [
                    {
                        SchoolClassId : data.SchoolClassId,
                        SubjectId : data.SubjectId
                    }
                ]
            }
        })
        if(checkSchedule){
            checkSchedule.TeacherId = data.TeacherId
            await checkSchedule.save();
            return checkSchedule;
        }else{
            const guardId = await db.schoolClass.findOne({
                where : { 
                    id : data.SchoolClassId
                },
            })
            console.log(guardId.GradeId);
            const guard = await db.grade.findOne({
                where: {
                    id: guardId.GradeId
                },
                include: [
                    {
                        model: db.subject,
                        through: {
                            model: db.regulation,
                            where: {
                                SubjectId: data.SubjectId
                            }
                        }
                    }
                ]
            });
            data.number_of_periods = guard.Subjects[0].Regulations.number;
            console.log(data);
            const schedule = await db.schedule.create(data);
            schedule.code = schedule.id;
            await schedule.save();
            return schedule;
        }
    } catch (error) {
        return error;
    }
}

export const deleteScheduleService = async(id) => {
    try {
        await db.schedule.destroy({
            where: {
                id: id
            }
        });
        
        return {
            message : "Xoá thành công!"
        }
    } catch (error) {
        return error;
    }
}

export const getTimeTableService = async(isMorning) => {
    try {
        console.log(isMorning);
        const timeTable = await db.bestTimeTable.findOne({
            where : {
                isMorning : isMorning
            },
            order : [['createdAt', 'DESC']]
        })
        const bestTimeTable = await getBesTimeTableService(isMorning);
        return bestTimeTable;
    } catch (error) {
        return error;
    }
}