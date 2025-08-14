/* eslint-disable no-useless-catch */

import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    //xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    //goi toi tang model de xy ly luu ban ghi newBoard vao trong database
    const createdBoard = await boardModel.createNew(newBoard)
    // lay ban ghi board sau khi goi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    //lam them cac xu ly logic khac voi cac collection khac tuy dac thu du an..
    //ban email, notification ve cho admin khi co 1 cai board moi duoc tao
    //tra ket qua ve, trong service luon phai co return
    return getNewBoard
  } catch (error) { throw error }
}
const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }
    //deep clone board ra mot cai moi de xu ly, khong lam anh huong toi board ban dau, tuy muc dich ve sau ma co can clone deep hay khong
    const resBoard = cloneDeep(board)
    //dua card va dung column cua no
    resBoard.columns.forEach(column => {
      //convert ObjectId ve string bang ham toString() cua javascrip
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })
    //xoa mang card khoi board bang dau
    delete resBoard.cards
    return resBoard
  } catch (error) { throw error }
}
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) { throw error }
}
const moveCardToDifferentColumn = async ( reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return { updateResult: 'Successfully!' }
  } catch (error) { throw error }
}
export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}