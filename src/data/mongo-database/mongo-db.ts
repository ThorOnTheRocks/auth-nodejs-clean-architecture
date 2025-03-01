import mongoose from "mongoose";

interface Options {
  url: string;
  dbName: string;
}


export class MongoDatabase {


  static async connect(options: Options) {
    const { url, dbName } = options;
    try {
      await mongoose.connect(url, {
        dbName: dbName
      })
      console.log('Mongo db connected successfully')
    } catch (error) {
      console.error(error);
      throw error
    }
  }
}