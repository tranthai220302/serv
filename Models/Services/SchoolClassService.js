import Api from "../../ultis/Api.js";
import db from "../Entitys/index.js";
import algoliasearch from "algoliasearch";
import { getBesTimeTableService } from "./ScheduleService.js";

export const getClazzs = async () => {
    try {
        const client = algoliasearch(process.env.ID, process.env.API_KEY);
        const index = client.initIndex(process.env.Index);
        const clazz = await db.schoolClass.findAll({
            attributes: [
                'name', 'id'
            ],
            include: [
                {
                    model: db.teacher,
                    include: [
                        {
                            model: db.user
                        }
                    ]
                }
            ]
        });
        let arr = [];
        clazz.map(item => {
            arr.push({
                objectID: item.id,
                name: item.name + " - " + item.Teacher.User.name
            });
        });
        await index.saveObjects(arr, { autoGenerateObjectIDIfNotExist: true });
        console.log('Dữ liệu đã được đồng bộ lên Algolia thành công!');
    } catch (error) {
        console.error('Lỗi khi đồng bộ dữ liệu lên Algolia:', error);
    }
};

export const searchClazzService = async (search) => {
    try {
        console.log(search);
        const client = algoliasearch(process.env.ID, process.env.API_KEY);
        const index = client.initIndex(process.env.Index);
        
        // Tìm kiếm với bộ lọc chính xác
        const searchParameters = {
            queryType: 'prefixNone', // Tắt khớp tiền tố
            filters: [`name:${search}`] // Chỉ tìm kiếm các lớp học có tên chính xác
        };

        const clazz = await index.search(search);
        return clazz
    } catch (error) {
        console.log("Error:", error);
    }
};

export const getScheduleByClazzService  = async(isMorning) =>{
    try {
        let schedule = {};
        const bestTimeTable = await getBesTimeTableService(isMorning);
        return bestTimeTable;
        // for (let day = Api.FIRST_DAY; day <= Api.LAST_DAY; day++) {
        //     for (let order = Api.FIRST_ORDER; order <= Api.LAST_ORDER; order++) {
        //         if((day == 2 && order == 1 )|| (day == 7 && order == 5))
        //         {
        //             continue;
        //         }
        //         bestTimeTable[`${day}-${order}`].map((lesson)=>{
        //             if(lesson.SchoolClassId == id)
        //             {
        //                 console.log("cc");
        //                 schedule[`${day}-${order}`].push(lesson);
        //             }
        //         })
        //     }
        // }
        // return schedule;
    } catch (error) {
        return error;
    }
}
