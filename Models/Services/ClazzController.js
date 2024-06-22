import { Model } from "firebase-admin/machine-learning"
import db from "../Entitys/index.js"

export const getListClazzService = async()=>{
    try {
        return await db.schoolClass.findAll({
            include : [
                {
                    model : db.teacher,
                    include : [
                        {
                            model : db.user
                        }
                    ]
                },
                {
                    model : db.infrastructure
                },
                {
                    model : db.student
                }
            ]
        })
    } catch (error) {
        return error;
    }
}