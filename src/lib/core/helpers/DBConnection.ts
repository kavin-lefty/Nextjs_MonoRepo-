import { MongoClient, Db } from "mongodb";
import {
  MONGODB_URL,
  STR_DB_NAME,
} from "@/lib/common/constants/objCommonConstants";
import errHandler from "./errHandler";

let mongoConnection: MongoClient | null = null;

const CreateMongoConnection = async (): Promise<void> => {
  try {
    mongoConnection = await MongoClient.connect(MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoClient Created");
  } catch (error: any) {
    console.log("❌ Error connecting to the DB");
    throw new errHandler(error.message);
  }
};

export const GetMongoDbConnection = async (): Promise<Db> => {
  try {
    if (!mongoConnection) await CreateMongoConnection();
    return mongoConnection!.db(STR_DB_NAME);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
};
