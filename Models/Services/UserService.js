import db from "../Entitys/index.js";
import { Op, where } from "sequelize";
import createError from "../../ultis/createError.js";
import Sequelize from "sequelize";
import {addYears, format} from 'date-fns'
import sendRequestShipperByEmail from "../../ultis/sendRequestShipperByEmail.js";
import argon2 from 'argon2'
export const updateUserService = async (data, id) =>{
    try {
        const address = data.address;
        delete data.address
        const checkUser = await db.user.findByPk(id);
        if(!checkUser) return createError(400, 'Không tìm thấy người dùng!');
        if(data.email){
            const checkEmail = await db.user.findOne({
                where : {
                    [Op.and] : [
                        {id : {[Op.ne] : id}},
                        {email : data.email}
                    ]
                }
            })
            if(checkEmail) return createError(400, 'Email này đã tồn tại!');
        }
        await db.user.update(data, {
            where: {id},
        })    
        if(!checkUser.AddressId){
            const createAddress = await db.address.create(address);
            if(!createAddress) return createError(400, 'Thêm địa chỉ không thành công!')
            await db.user.update({
                AddressId : createAddress.id
            },{
                where : {
                    id : checkUser.id
                }
            })
        }else{
            const updateAddress = await db.address.update(address,{
                where : {
                    id : checkUser.AddressId
                }
            })
            if(updateAddress[0] == 0) return createError(400, 'Chỉnh sửa thông tin không thành công!')
        }
        return {
            status: true,
            messgae: 'Update thanh cong!',
            user : checkUser
        };  
    } catch (error) {
        return error;
    }
}
export const changPassService = async (data, id) =>{
    try {
        const user = await db.user.findByPk(id);
        if(!user) return createError(400, 'Không tìm thấy người dùng!');
        const checkPass = await argon2.verify(user.password, data.passOld);
        if(!checkPass) return createError(400, 'Mật khẩu cũ không chính xác!');
        if(data.passNew.length <= 6) return createError(400, 'Mật khẩu mới phải lớn hơn 6 chữ số!');
        if(data.passNew !== data.confirmPassNew) return createError(400, 'Mật khẩu nhập lại không chính xác!')
        const pass = await argon2.hash(data.passNew);
        user.password = pass;
        await user.save()
        return {
            message : 'Đổi mật khẩu thành công!'
        }
    } catch (error) {
        return error;
    }
}
export const deleteUserService = async (id) =>{
    try {
        const user = await db.user.findByPk(id);
        if(!user) return createError(400, 'Không tìm thấy người dùng!')
        const deleteUser = await db.user.destroy({where : {id}})
        if(deleteUser == 0) return createError(400, 'Xoá tài khoản không thành công!')
        return true;
    } catch (error) {
        return error;
    }
}

export const getUserByIdService = async(id) =>{
    try {
        const user = await db.user.findOne({
            where: { id },
            include: [
                {
                    model : db.address
                }
            ]
        });
        if(!user) return createError(400, 'Không tìm thấy người dùng!')
        return user;
    } catch (error) {
        return error;
    }
}

export const getInforAdminService = async()=>{
    try {
        const currentDate = new Date();
        console.log(currentDate)
        const sevenDate = new Date();
        sevenDate.setDate(currentDate.getDate() - 7);
        const dateEnd = format(currentDate, 'yyyy-MM-dd')
        const dateStart = format(sevenDate, 'yyyy-MM-dd')
        const user = await db.user.count({
            where : {
                idRole : 1
            }
        })
        const hotelOwner = await db.user.count({
            where : {
                idRole : 2
            }
        })
        const hotel = await db.hotel.count({
            where : {
                isConfirm : true
            }
        })
        const booking = await db.booking.findAll({
            where : {
                createdAt : {
                    [Op.between] : [
                        `${dateStart} 00:00:00`,
                        `${dateEnd} 23:59:59`  
                    ]
                }
            }
        })
        let total = 0;
        booking.map((item)=>{
            total += item.priceTotal
        })
        return {
            user,
            hotelOwner,
            hotel,
            booking : booking.length
        }
    } catch (error) {
        return error;
    }
}
export const revenueAdminService = async(dateStart, dateEnd)=>{
    try {
        const startDate = new Date(dateStart);
        const endDate = new Date(dateEnd);
        const dateRange = [];
        let data = []
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            dateRange.push(formattedDate);       
            const bookings = await db.booking.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [
                            `${formattedDate} 00:00:00`,
                            `${formattedDate} 23:59:59`  
                        ]
                    }
                },
            });
            let total = 0;
            bookings.map((item, i)=>{
                total += item.priceTotal*0.15
            })
            data.push({
                name : `${day}/${month  }`,
                Total : total
            })
        }       
        return data
    } catch (error) {
        return error;
    }
}
export const revenueCurrentDateService = async()=>{
    try {
        const currentDate = new Date();
        const yesterDate = new Date(currentDate);
        yesterDate.setDate(currentDate.getDate() - 1)
        const date = format(currentDate, 'yyyy-MM-dd')
        const booking = await db.booking.findAll({
            where : {
                createdAt : {
                    [Op.between] : [
                        `${date} 00:00:00`,
                        `${date} 23:59:59`  
                    ]
                }
            }
        })
        const bookingY = await db.booking.findAll({
            where : {
                createdAt : {
                    [Op.between] : [
                        `${yesterDate} 00:00:00`,
                        `${yesterDate} 23:59:59`  
                    ]
                }
            }
        })
        let total = 0;
        let totalY = 0;
        booking.map((item)=>{total += item.priceTotal})
        bookingY.map((item)=>{totalY += item.priceTotal})
        return {
           total : total*0.15,  
        };
    } catch (error) {
        return error;
    }
}
export const get5HotelRevenueHighService = async () =>{
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const hotel = await db.hotel.findAll({
            include : [
                {

                    model : db.booking,
                    where: {
                        createdAt: {
                            [Op.between]: [
                                `${format(startOfMonth, 'yyyy-MM-dd')} 00:00:00`,
                                `${format(endOfMonth, 'yyyy-MM-dd')} 23:59:59`
                            ]
                        }
                    }
                },
                {
                    model  : db.hotelOwner,
                    include : [
                        {
                            model : db.user
                        }
                    ]
                },
                {
                    model : db.address
                },
                {
                    model : db.image
                }
            ]
        })
        let hotelTotals = [];
        hotel.forEach((item) => {
            let total = 0;
            item.Bookings.forEach((booking) => {
                total += booking.priceTotal;
            });
            hotelTotals.push({ 
                id : item.id,
                img : item.Images[0].filename,
                name : item.name,
                hotelOwner : item.HotelOwner.User.name,
                address : item.Address.province,
                total :  total *0.85,
                payment : item.isPaymentOff ? 'Thanh toán tại quầy' : 'Thanh toán trực tuyến',
                status : item.isConfirm ? "Approved" : "Pending",
             });
        });
        hotelTotals.sort((a, b) => b.total - a.total);
        if(hotelTotals.length >= 5){
            let top5Hotels = hotelTotals.slice(0, 5);
            return top5Hotels;
        }else return hotel.slice(0, hotelTotals.length)
    } catch (error) {
        return error;
    }
}
export const getCustomerService = async()=>{
    try {
        const user = await db.customer.findAll({
            include : [
                {
                    model : db.user
                }
            ]
        });
        let data = [];
        user.map((item)=>{
            data.push({
                id : item.id,
                name : item.nameBook,
                avatar : item.User.avatar,
                email : item.emailBook,
                phone : item.phoneBook,
                address : item.addressBooking,
                status : item.User ? 'active' : 'pending'
            })
        })
        if(data.length === 0) return createError(400, 'Không có khách hàng!');
        return data;
    } catch (error) {
        return error;
    }
}