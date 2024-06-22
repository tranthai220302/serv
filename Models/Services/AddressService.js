import { Op } from "sequelize";
import createError from "../../ultis/createError.js";
import db from "../Entitys/index.js";
import dotenv from 'dotenv';
import sequelize from "sequelize";
dotenv.config()
import algoliasearch from "algoliasearch";
export const getLocationPopularService = async()=>{
    try {
        const today = new Date();
        const senvenDate = new Date(today);
        senvenDate.setDate(today.getDate()-7);
        const bookings = await db.booking.findAll({
            where: {
                createdAt: {
                    [Op.between]: [senvenDate, today]
                }
            }
        });
        const idHotel = bookings.map(item=> item.HotelId)
        const address = await db.address.findAll({
            attributes : ['id', 'province'],
            include : [
                {
                    model : db.hotel,
                    where : {
                        id : idHotel
                    },
                    attributes : ['id', 'name'],
                }
            ]
        })
        const dem = {};
        idHotel.map((item)=>{
            if(dem[item]){
                dem[item] += 1;
            }else dem[item] = 1;
        })
        console.log(dem)
        const max = {};
        address.map((item)=>{
            if(max[item.province]){
                max[item.province] += dem[item.Hotel.id]
            }else max[item.province] = dem[item.Hotel.id]
        })
        const entries = Object.entries(max);
        entries.sort((a, b) => b[1] - a[1]);
        console.log(entries)
        let location = [];
        for (let i = 0; i < 5; i++) {
            console.log(i)
            location.push(entries[i][0])
        }
        let data = [];
        for(let i = 0 ; i < location.length; i++){
            const img = await db.imgCity.findOne({
                where : {
                    name : location[i]
                }
            })
            data.push({
                name : location[i],
                img : img
            })
        }
        return data;
    } catch (error) {
        return error;
    }
}
export const getAddress = async()=>{
    try {
        const client = algoliasearch(process.env.ID, process.env.API_KEY)
        const index = client.initIndex(process.env.Index)
        const address = await db.address.findAll({
            attributes: [
                'province', 'id'
            ],
            include: [{
                model: db.hotel,
                where : {
                    id : {
                        [Op.not] : null
                    }
                },
                attributes: ['name']
            }],
            group: ['province'] 
        });
        let arr = [];
        address.map(item => {
            arr.push({
                objectID : item.id.toString(),
                name : item.province
            })
        });
        await index.saveObjects(arr,{ autoGenerateObjectIDIfNotExist: true })
        console.log('Dữ liệu đã được đồng bộ lên Algolia thành công!');
    } catch (error) {
        console.error('Lỗi khi đồng bộ dữ liệu lên Algolia:', error);
    }
}
export const searchAdressHotelService = async (search)=>{
    try {
        const client = algoliasearch(process.env.ID, process.env.API_KEY)
        const index = client.initIndex(process.env.Index)
        const address = await index.search(search);
        return address;
    } catch (error) {
        console.log("Error:", error)
    }
}