import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { updateUserVal } from "@/validation_api/user";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data =
      await prisma.$queryRaw`select * from user where id = ${params.id}`;

    if (data.length > 0) {
      return NextResponse.json(
        { message: "Success", data: data },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await updateUserVal.parseAsync(body);

    const user = await prisma.user.update({
      where: {
        id: Number(params.id),
      },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data =
      await prisma.$queryRaw`select * from user where id = ${params.id}`;
    if (data.length <= 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    const user = await prisma.user.delete({
      where: {
        id: Number(params.id),
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
