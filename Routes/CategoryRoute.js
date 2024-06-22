import express from 'express'
import { 
    deleteCategory,  
    createCategory,
    getCategorys,
    updateCategory
} from '../Controllers/CategoryController.js';
import { verifyjson } from '../middleware/jwt.js';

const routerCategory = express.Router()
routerCategory.post('/create', verifyjson, createCategory)
routerCategory.delete('/delete/:idCategory', verifyjson, deleteCategory)
routerCategory.get('/', getCategorys)
routerCategory.put('/update/:idCategory', verifyjson, updateCategory)
export default routerCategory;  