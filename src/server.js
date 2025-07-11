/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()
  //bat cai request.body json data
  app.use(express.json())
  //su dung api v1
  app.use('/v1', APIs_V1)

  //middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3.Hello ${env.AUTHOR}, Back End Server is running successfully at host: ${env.APP_HOST} and Port: ${env.APP_PORT}`)
  })
  //thuc hien cac tac vu cleanup truoc khi dung server
  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}
//chi khi ket noi toi database thanh cong thi moi start server BE len
//IIFE len mang coi lai
(async () => {
  try {
    console.log('1.Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2.Connected to MongoDB Cloud Atlas!')
    //khoi dong server backend sau khi connect database thanh cong
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
// //chi khi ket noi toi database thanh cong thi moi start server BE len
// console.log('1.Connecting to MongoDB Cloud Atlas...')
// CONNECT_DB()
//   .then(() => console.log('2.Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
