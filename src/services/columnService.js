
import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      //xu ly cau truc data o day truoc khi tra du lieu ve
      getNewColumn.cards = []
      //cap nhat lai mang columnorderids trong collec3tion board
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) { throw error }
}
const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    return updatedColumn
  } catch (error) { throw error }
}
const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    //xoa column
    await columnModel.deleteOneById(columnId)
    //xoa toan bo card thuoc column
    await cardModel.deleteManyByColumnId(columnId)
    //xoa columnOrderIds trong board
    await boardModel.pullColumnOrderIds(targetColumn)
    return { deleteResult: 'Column deleted successfully' }
  } catch (error) { throw error }
}
export const columnService = {
  createNew,
  update,
  deleteItem
}