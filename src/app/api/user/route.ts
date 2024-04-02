import { addProduct, getProducts } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addUserVal } from "@/validation_api/user";

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
    const body = await req.json();
    const validation = await addUserVal.parseAsync(body);
    // if (!validation.success) {
    //   const error = {
    //     field: validation.error.issues[0].path[0],
    //     message: validation.error.issues[0].message,
    //   };
    //   return NextResponse.json(
    //     { message: "Error", error: error },
    //     { status: 400 }
    //   );
    // }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        divisionId: Number(body.divisionId),
      },
    });

    return NextResponse.json(
      { message: "Success", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.issues) {
      const msg = {
        field: error.issues[0].path[0],
        message: error.issues[0].message,
      };
      return NextResponse.json(
        { message: "Error", error: msg },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  }
}
