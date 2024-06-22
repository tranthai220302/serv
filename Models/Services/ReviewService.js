import { Op, where } from "sequelize";
import createError from "../../ultis/createError.js";
import db from "../Entitys/index.js";
import Sequelize from "sequelize";
export const deleteReviewService = async(id,customer_id)=>{
    try {
        const user = await db.user.findOne({
            where : {
                id : customer_id
            },
            include : [
                {
                    model : db.customer
                }
            ]
        });
        if(!user) return createError(400, 'Không tìm thấy người dùng!')
        const delete_review = await db.review.destroy({
            where : {
                [Op.and] : [
                    {id},
                    {CustomerId : user.Customer.id}
                ]
            }
        })
        if(delete_review == 0) return createError(400, 'Xoá đánh giá không thành công!')
        return {
            status: true,
            meessage: 'Xoá thành công!'
        };
    } catch (error) {
        return error;
    }
}
export const updateReviewService = async(category, desc, img, customer_id,id)=>{
    try {
        const update_review = await db.review.update({
            desc,
            img
        }, {
            where : {
                [Op.and] : [
                    {id},
                    {CustomerId : customer_id}
                ]
            }
        })
        if(update_review[0] == 0) return createError(400, 'Update không thành công!')
        for(let i = 0 ; i < category.length ; i++){
            const updateRating = await db.rating.update({
                score : category[i].score,
            }, {
                where : {
                    [Op.and] : [
                        {ReviewId : id},
                        {CategoryRatingId : category[i].id}
                    ]
                }
            })
            console.log(updateRating)
            if(updateRating[0] == 0) return createError(400, 'Update không thành công!')
        }
        return {
            status: true,
            message: 'Chỉnh sửa thành công!'
        }
    } catch (error) {
        return error;
    }
}
export const createReviewService = async(data, id) =>{
    try {
        console.log(data)
        const { idRoom,category, ...res} = data;
        const user = await db.user.findOne({
            where : {id},
            include : [
                {
                    model : db.customer
                }
            ]
        })
        const findReview = await db.review.findOne({
            where : {
                [Op.and] : [
                    {PriceRoomId : idRoom},
                    {CustomerId : user.Customer.id}
                ]
            }
        })
        if(findReview){
            const updateReview = await updateReviewService(category, res.desc, res.img, user.Customer.id, findReview.id)
            return updateReview;
        }
        const review = await db.review.create({
            desc : res.desc,
            img : res.img,
            PriceRoomId : idRoom,
            CustomerId : user.Customer.id
        })
        if(!review) return createError(400, 'Đánh giá không thành công!');
        for(let i = 0; i < category.length; i++){
            const rating = await db.rating.create({
                ReviewId : review.id,
                score : category[i].score,
                CategoryRatingId : category[i].id
            })
            if(!rating) return createError(400, 'Chấm điểm không thành công!')
        }

        return {
            message : 'Đánh giá thành công!'
        }

    } catch (error) {
        return error;
    }
}
export const getReviewsService = async(id) =>{
    try {
        const review = await db.review.findAll({
            include : [
                {
                    model : db.price,
                    attributes : ['id'],
                    where : {
                        id : {
                            [Op.not] : null
                        }
                    },
                    include : [
                        {
                            model : db.room,
                            attributes : ['name'],
                            where : {
                                HotelId: id
                            }
                        }
                    ]
                },
                {
                    model : db.rating,
                    include : [
                        {
                            model : db.categoryRating,
                            attributes : ['name']
                        }
                    ]
                },
                {
                    model : db.customer,
                    attributes : ['id'],
                    include : [
                        {
                            model : db.user,
                            attributes : ['name', 'avatar']
                        }
                    ]
                },
            ]
        })
        return review;
    } catch (error) {
        return error;
    }
}
const xepLoai=  (total)=>{
    let result;
    switch (true) {
        case total >= 9:
            result = 'Xuất sắc';
            break;
        case total >= 8 && total < 9:
            result = 'Tuyệt hảo';
            break;
        case total >= 7 && total < 8:
            result = 'Tốt';
            break;
        default:
            result = 'Bình thường';
    }
    return result;
}
export const getReviewsByHotelService = async(id, page, bookPerPage) =>{
    try {
        const offset = (page - 1) *bookPerPage;
        const listReview = await db.review.findAll({
            include : [
                {
                    model : db.price,
                    attributes : ['id'],
                    where : {
                        id : {
                            [Op.not] : null
                        }
                    },
                    include : [
                        {
                            model : db.room,
                            attributes : ['name'],
                            where : {
                                HotelId: id
                            },
                        }
                    ]
                },
                {
                    model : db.rating,
                    include : [
                        {
                            model : db.categoryRating,
                            attributes : ['name']
                        }
                    ]
                },
                {
                    model : db.customer,
                    attributes : ['id'],
                    include : [
                        {
                            model : db.user,
                            attributes : ['name', 'avatar']
                        }
                    ]
                },
            ],
            offset : offset,
            limit : bookPerPage
        })

        const review = await getReviewsService(id)   
        const categoryRating = await db.categoryRating.findAll();
        let score = [];
        let  n = {}
        let percent = {}
        const categoryScore = categoryRating.map((category)=> {
            return {
                name : category.name,
                score : 0,
                percent : 0,
                n : 0
            }
        })
        review.map((item, i)=>{
            item.Ratings.map((rating)=>{
                categoryScore.map((category, i)=>{
                    if(rating.CategoryRating.name == category.name){
                        category.score += rating.score;
                        category.n += 1;
                        category.percent = category.score/category.n
                    }
                })
            })
        })
        let total = 0;
        let i = 0;
         categoryScore.map((item)=>{
            if(item.score > 0){
                i+=1
                total += item.percent;
            }
        })
        return {
            categoryScore,
            listReview,
            n : review.length,
            page : Math.ceil(review.length/3),
            t : {
                total : total/i,
                name : xepLoai(total/i)
            }
        }
    } catch (error) {
        return error;
    }
}
export const categoryRatingServices = async()=>{
    try {
        const category = await db.categoryRating.findAll();
        return category;
    } catch (error) {
        return error;
    }
}
export const checkReviewService = async (data, id) =>{
    try {
        const user = await db.user.findOne({
            where : {id},
            include : [
                {
                    model : db.customer
                }
            ]
        })
        console.log(data, id)
        const check = await db.booking.findOne({
            where : {
                [Op.and] : [
                    {pinCode : data.pinCode},
                    {CustomerId : user.Customer.id}
                ]
            },
            include : [
                {
                    model : db.price,
                    as : 'price',
                    where : {
                        id : data.idRoom
                    }
                },
            ]
        })
        if(!check) return createError(400, 'Thông tin không chính xác!')
        return {
            message : "Thông tin chính xác!"
        }
    } catch (error) {
        return error;
    }
}