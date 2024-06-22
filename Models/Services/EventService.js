import db from "../Entitys/index.js";
import dayjs from 'dayjs'
export const createEventService = async (data) => {
    try {
        const event = await db.event.create({
            name : data.name,
            start_date : data.start_date,
            end_date : data.end_date,
            start_time : data.start_time,
            end_time : data.end_time,
            desc : data.desc
        });

        if (data.img && data.img.length > 0) {
            const imageRecords = data.img.map((url) => ({
              url,
              EventId: event.id
            }));
            await db.image.bulkCreate(imageRecords);
          }
        return {
            "message" : "Tạo sự kiện thành công!"
        }
    } catch (error) {
        return error;
    }
}
export const getEventService = async() =>{
    try {
        const events = await db.event.findAll({
            include : [
                {
                    model : db.image
                }
            ]
        })
        let data = [];
        events.map((item)=>{
            data.push({
                id :item.id,
                title : item.name,
                date : dayjs(item.start_date).format('YYYY-MM-DD'),
                end_date : item.end_date,
                start_time : item.start_time,
                start_end : item.start_end,
                desc : item.desc,
                img: item.Images
            })
        })
        return data;
    } catch (error) {
        return error;
    }
}