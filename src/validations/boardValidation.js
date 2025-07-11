
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  //mac dinh chung ta khogn can custom message o phia be vi de cho fe tu validate va custom messagep phia fe cho dep
  //be chi can validate dam bao du lieu chuan xac va tra ve message mac dinh tu thu vien la duoc
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (obito)',
      'string.empty': 'Title cannot be empty (obito)',
      'string.min': 'Title must be at least 3 characters long (obito)',
      'string.max': 'Title length must be less than or equal to 5 characters long (obito)',
      'string.trim': 'Title cannot have leading or trailing spaces (obito)'
    }),
    description: Joi.string().required().min(3).max(255).trim().strict()
  })
  try {
    // console.log(req.body)
    //chi dinh abortEarly: false de truong hop co nhieu loi validation thi tra ve tat ca loi
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //validate du lieu xong hop le thi cho req di sang controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
export const boardValidation = {
  createNew
}
