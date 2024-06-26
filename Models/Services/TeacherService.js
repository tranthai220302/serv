import { Op, where } from "sequelize";
import db from "../Entitys/index.js";
import Api from "../../ultis/Api.js";
import algoliasearch from "algoliasearch";
import { getTimeTableByTeacherService } from "./ScheduleService.js";
export const listTeacherService = async () => {
    try {
        const teachers = await db.teacher.findAll({
            include: [
                {
                    model: db.user
                },
                {
                    model: db.departement
                }
            ]
        })
        let data = [];
        teachers.map((teacher) => {
            data.push({
                id: teacher.id,
                name: teacher.User.name,
                email: teacher.User.email,
                departement: teacher.Departement.name,
                qualification: teacher.qualification
            })
        })
        return data;
    } catch (error) {
        return error;
    }
}
export const getTeacherHasSchedule = async () => {
    try {
        const TeacherId = await db.schedule.findAll({
            attributes: ['TeacherId'],
            where: {
                TeacherId: {
                    [Op.not]: null
                }
            },
            group: ['TeacherId'],
        })
        let id = [];
        TeacherId.map((teacher) => {
            id.push(teacher.TeacherId);
        })
        const teachers = await db.teacher.findAll({
            where: {
                id: id
            },
            include: [
                {
                    model: db.user
                }
            ]
        })
        return teachers;
    } catch (error) {
        return error;
    }
}

export const getScheduleByTeacherService = async (id, isMorning) => {
    try {
        let schedule = {};
        for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
            for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
                const lessonKey = `${day}-${order}`;
                if (!schedule[lessonKey]) {
                    schedule[lessonKey] = [];
                }
            }
        }
        const bestTimeTable = await getTimeTableByTeacherService(isMorning)
        for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
            for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
                if((day == 2 && order == 1 )|| (day == 7 && order == 5))
                {
                    continue;
                }
                bestTimeTable[`${day}-${order}`].map((lesson)=>{
                    if(lesson.TeacherId == id)
                    {
                        schedule[`${day}-${order}`].push(lesson);
                    }
                })
            }
        }
        return schedule;
    } catch (error) {
        return error;
    }
}
export const getScheduleByDateService = async (id, dateString) => {
    try {
        console.log(dateString)
        const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7'];
        const date = new Date(dateString);
        const dayOfWeekIndex = date.getDay();
        const index = daysOfWeek[dayOfWeekIndex];
        if(index == '1') return {
            vacation : {},
            isOrder : "Không có tiết học"
        };
        let vacation = {};
        let vacationAfternoon = {}
        const schedule = await getScheduleByTeacherService(id, 1);
        const scheduleAfternoon = await getScheduleByTeacherService(id, 0);
        for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
            vacation[`${index}-${order}`] = schedule[`${index}-${order}`];
        }
        for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
            vacationAfternoon[`${index}-${order}`] = scheduleAfternoon[`${index}-${order}`];
        }
        const keys = Object.keys(vacation);
        const keysAfterNoo =  Object.keys(vacationAfternoon);
        let nonEmptyCount = false;
        keys.forEach(key => {
            
            if (vacation[key].length > 0) {
                nonEmptyCount = true
            }
        });
        let nonEmptyCountAfter = false;
        keysAfterNoo.forEach(key => {
            
            if (vacationAfternoon[key].length > 0) {
                nonEmptyCountAfter = true
            }
        });

        return {
            vacation,
            isOrder : !nonEmptyCount ? "Không có tiết học buổi sáng" : true,
            vacationAfternoon,
            isOrderAfternoon : !nonEmptyCountAfter ? "Không có tiết học buổi chiều" : true
        };
    } catch (error) {
        return error;
    }
}


export const getTeachers = async () => {
    try {
        const client = algoliasearch(process.env.ID, process.env.API_KEY);
        const index = client.initIndex(process.env.Index1);
        const teacher = await db.teacher.findAll({
            include: [
                {
                    model: db.user,
                },
                {
                    model : db.departement
                }
            ]
        });
        let arr = [];
        teacher.map(item => {
            arr.push({
                objectID: item.id,
                name: item.User.name + " (" + item.Departement.name + ")"
            });
        });
        await index.saveObjects(arr, { autoGenerateObjectIDIfNotExist: true });
        console.log('Dữ liệu đã được đồng bộ lên Algolia thành công!');
    } catch (error) {
        console.error('Lỗi khi đồng bộ dữ liệu lên Algolia:', error);
    }
};

export const searchTeacherService = async (search) => {
    try {
        console.log(search);
        const client = algoliasearch(process.env.ID, process.env.API_KEY);
        const index = client.initIndex(process.env.Index1);
    

        const teacher = await index.search(search);
        return teacher;
    } catch (error) {
        console.log("Error:", error);
    }
};

export const getTeacherBySubjectService = async(id) => {
    try {
        const subject = await db.subject.findByPk(id);
        const teacher = await db.teacher.findAll({
            where : {
                DepartementId : subject.DepartementId
            },
            include : [
                {
                    model : db.user
                }
            ]
        })
        return teacher;
    } catch (error) {
        return error;
    }
}
