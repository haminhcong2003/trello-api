
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body:', req.body)
    // console.log('req.query:', req.query)
    // console.log('req.params:', req.params)
    // console.log('req.files:', req.files)
    // console.log('req.cookies:', req.cookies)
    // console.log('req.jwtDecoded:', req.jwtDecoded)

    //dieu huong du lieu toi tang service

    //co ket qua thi tra ve phia client
    res.status(StatusCodes.CREATED).json({ message: 'POST from Controller: API create new boards' })
  } catch (error) { next(error) }
}


export const boardController = {
  createNew
}