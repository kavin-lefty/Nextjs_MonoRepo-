import { GetMongoDbConnection } from "@/lib/core/helpers/DBConnection";
import errHandler from "@/lib/core/helpers/errHandler";
import {
  ObjectId,
  Document,
  Filter,
  UpdateFilter,
  InsertOneOptions,
  UpdateOptions,
} from "mongodb";

const condition = [
  {
    $match: {
      chrStatus: "N",
    },
  },
];

export async function getListDB({
  strCollection,
  arrQuery = condition,
}: {
  strCollection: string;
  arrQuery?: Document[];
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objConnection
      .collection(strCollection)
      .aggregate(arrQuery)
      .toArray();
  } catch (error: any) {
    console.log("error", error);
    throw new errHandler(error.message);
  }
}

export async function getOneDB({
  strCollection,
  objQuery = { chrStatus: "N" },
  objProject = null,
}: {
  strCollection: string;
  objQuery?: Filter<Document>;
  objProject?: Document | null;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objProject
      ? objConnection
          .collection(strCollection)
          .findOne(objQuery, { projection: objProject })
      : objConnection.collection(strCollection).findOne(objQuery);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function getOneKeyDB({
  strCollection,
  objQuery,
  objProject = null,
}: {
  strCollection: string;
  objQuery: Filter<Document>;
  objProject?: Document | null;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objProject
      ? objConnection
          .collection(strCollection)
          .findOne(objQuery, { projection: objProject })
      : objConnection.collection(strCollection).findOne(objQuery);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function insertManyDB({
  strCollection,
  arrInsertDocuments,
  options = null,
}: {
  strCollection: string;
  arrInsertDocuments: Document[];
  options?: InsertOneOptions | null;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    const successfullyInsertedIds: ObjectId[] = [];

    for (const document of arrInsertDocuments) {
      try {
        const objInsert = options
          ? await objConnection
              .collection(strCollection)
              .insertOne(document, options)
          : await objConnection.collection(strCollection).insertOne(document);

        successfullyInsertedIds.push(objInsert.insertedId);
      } catch (error: any) {
        if (error.code === 11000) {
          console.warn(
            `Duplicate key error. Skipping document with _id: ${document._id}`
          );
        } else {
          throw new errHandler(error.message);
        }
      }
    }

    return {
      successfullyInsertedIds,
      strMessage: "Success",
    };
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function insertOneDB({
  objDocument,
  strCollection,
}: {
  objDocument: object;
  strCollection: string;
}) {
  try {
    const objConnection = await GetMongoDbConnection();

    return objConnection.collection(strCollection).insertOne({
      chrStatus: "N",
      ...objDocument,
    });
  } catch (error: any) {
    console.log(error.message, "error in insertone DB");
    // throw new errHandler(error.message);
  }
}

export async function insertOneTransaction({
  objDocument,
  strCollection,
}: {
  objDocument: Document;
  strCollection: string;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objConnection.collection(strCollection).insertOne(objDocument);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function updateOneKeyDB({
  _id,
  objMatch,
  strCollection,
  objDocument,
  options = null,
}: {
  _id?: string;
  objMatch?: Filter<Document>;
  strCollection: string;
  objDocument: UpdateFilter<Document>;
  options?: UpdateOptions | null;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    const filter = _id
      ? { ...(objMatch || {}), _id: new ObjectId(_id) }
      : objMatch!;
    return options
      ? objConnection
          .collection(strCollection)
          .updateOne(filter, { $set: objDocument }, options)
      : objConnection
          .collection(strCollection)
          .updateOne(filter, { $set: objDocument });
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function updateManyDB({
  strCollection,
  objMatch,
  objDocument,
  options = null,
}: {
  strCollection: string;
  objMatch: Filter<Document>;
  objDocument: UpdateFilter<Document>;
  options?: UpdateOptions | null;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    await objConnection
      .collection(strCollection)
      .updateMany(objMatch, { $set: objDocument }, options || undefined);
    return { strMessage: "UPDATE_SUCCESS" };
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function updateFindOneKeyDB({
  _id,
  objMatch,
  strCollection,
  objDocument,
}: {
  _id?: string;
  objMatch?: Filter<Document>;
  strCollection: string;
  objDocument: UpdateFilter<Document>;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    const filter = _id
      ? { ...(objMatch || {}), _id: new ObjectId(_id) }
      : objMatch!;
    return objConnection
      .collection(strCollection)
      .findOneAndUpdate(filter, { $set: objDocument });
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function deleteOneDB({
  strCollection,
  _id,
  timReceived,
  strUserId,
}: {
  strCollection: string;
  _id: string;
  timReceived: string;
  strUserId: string;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    await objConnection.collection(strCollection).updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          chrStatus: "D",
          strModifiedTime: timReceived,
          strModifiedUser: strUserId,
        },
      }
    );
    return {};
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function deleteHardOneDB({
  strCollection,
  objMatch,
}: {
  strCollection: string;
  objMatch: Filter<Document>;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objConnection.collection(strCollection).deleteOne(objMatch);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function deleteDB({
  strCollection,
  arrDeleteId,
  strModifiedTime,
  strModifiedUser,
}: {
  strCollection: string;
  arrDeleteId: ObjectId[];
  strModifiedTime: string;
  strModifiedUser: string;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    const arrOldItem = await objConnection
      .collection(strCollection)
      .find({ _id: { $in: arrDeleteId } })
      .toArray();

    if (arrOldItem.length !== arrDeleteId.length) {
      throw new errHandler("ITEM_MISMACTH");
    }

    await objConnection.collection(strCollection).updateMany(
      { _id: { $in: arrDeleteId } },
      {
        $set: {
          chrStatus: "D",
          strModifiedTime,
          strModifiedUser,
        },
      }
    );

    return {};
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}

export async function getCountDB({
  strCollection,
  objQuery,
}: {
  strCollection: string;
  objQuery: Filter<Document>;
}) {
  try {
    const objConnection = await GetMongoDbConnection();
    return objConnection.collection(strCollection).countDocuments(objQuery);
  } catch (error: any) {
    throw new errHandler(error.message);
  }
}
