import { addProduct, getProducts } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: Response) {
  try {
    const data = await prisma.$queryRaw`select * from user`;

    return NextResponse.json(
      { message: "Success", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: Response) {
  try {
    const { name, email, password, divisionId } = await req.json();

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        divisionId: divisionId,
      },
    });

    return NextResponse.json(
      { message: "Success", data: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
