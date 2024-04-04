import { addProduct, getProducts } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { addUserVal } from "@/validation_api/user";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: Response) {
  try {
    let page: number = Number(req.nextUrl.searchParams.get("page")) || 0;
    let limit: number = Number(req.nextUrl.searchParams.get("limit")) || 10;
    let search: string = req.nextUrl.searchParams.get("search") || "";
    let search_db = search
      ? `WHERE name LIKE '%${search}%' OR email LIKE '%${search}%'`
      : "";
    let offset = page * limit;
    let total: any = await prisma.$queryRaw`SELECT count(*) as total from user`;
    let total_page = Math.ceil(Number(total[0].total) / limit);

    const data =
      await prisma.$queryRaw`SELECT u.*, u.id as "key", d.name as division_name FROM user as u join division as d on u.divisionId = d.id`;

    return NextResponse.json(
      { message: "Success", total: total_page, data: data },
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
