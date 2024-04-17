import { addProduct, getProducts } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { addUserVal } from "@/validation_api/user";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: Response) {
  try {
    const data = await prisma.$queryRaw(
      Prisma.raw(
        `SELECT id as value, UPPER(name) as label FROM division ORDER BY name ASC`
      )
    );
    return NextResponse.json(
      {
        message: "All division",
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
