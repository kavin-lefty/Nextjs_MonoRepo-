import { NextRequest, NextResponse } from "next/server";
import { getCountDB, getListDB } from "@/lib/common/functions/DB/mongoQueries";

export async function POST(req: NextRequest) {
  try {
    const strCollection = "users";
    const body = await req.json();
    const page = parseInt(body?.strPage) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const arrQuery = [];
    const matchStage = {};

    if (body?.strSearch) {
      const searchRegex = {
        $regex: body.strSearch.trim().replace(/\s+/g, ".*"),
        $options: "i",
      };

      matchStage.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (Object.keys(matchStage).length) {
      arrQuery.push({ $match: matchStage });
    }

    arrQuery.push({ $sort: { year: -1 } }, { $skip: skip }, { $limit: limit });

    const arrList = await getListDB({ strCollection, arrQuery });

    const totalCount = await getCountDB({
      strCollection,
      objQuery: matchStage,
    });

    return NextResponse.json({
      success: true,
      arrList,
      pagination: {
        pageSize: limit,
        current: page,
        total: totalCount,
      },
    });
  } catch (err) {
    console.error("GET /api/user error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

