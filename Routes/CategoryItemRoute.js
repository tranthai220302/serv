import express from 'express'
import { verifyjson } from '../middleware/jwt.js';
import { getCategoryItem, getItemByCategory, getItemByCategorys } from '../Controllers/CategoryItemController.js';

const routerCategoryItem = express.Router()
routerCategoryItem.get('/:id', getCategoryItem)
routerCategoryItem.get('/item/:id', getItemByCategory)
routerCategoryItem.get('/list/items', getItemByCategorys)
export default routerCategoryItem;  