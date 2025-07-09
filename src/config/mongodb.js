
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from '~/config/environment'

//khoi tao mot doi tuong trelloDatabaseInstance ban dau la null( vi chua connect)
let trelloDatabaseInstance = null
//khoi tao mot doi tuong mongoclientInstance de connect toi mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
//serverApi co tu phien ban moi tu 5.0.0
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
//ket noi toi database
export const CONNECT_DB = async () => {
  //goi ket noi toi mongodb atlas voi uri da khai bao trong than mongoClientInstance
  await mongoClientInstance.connect()
  //ket noi thanh cong thi lay ra database theo ten va gan nguoc no lai vao bien trelloDatabaseInstance o tren
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

//dong ket noi toi database khi can
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

// function GET_DB (khong co async) nay co nhiem vu export ra cai trelloDatabaseInstance sau khi da connect mongodb de chung ta co the su dung o nhieu noi khac nhau trong code
// luu y phai dam bao chi luon goi getdb nay sau khi da ket noi thanh cong voi mongodb
export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first.')
  return trelloDatabaseInstance
}
