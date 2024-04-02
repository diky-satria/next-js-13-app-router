import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data =
      await prisma.$queryRaw`select * from user where id = ${params.id}`;

    return NextResponse.json(
      { message: "Success", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, password, divisionId } = await req.json();
    const user = await prisma.user.update({
      where: {
        id: Number(params.id),
      },
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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
