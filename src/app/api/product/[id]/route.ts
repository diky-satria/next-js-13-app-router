import { NextResponse } from "next/server";
import { deleteProduct, getProductById, updateProduct } from "@/lib/data";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    let product = getProductById(params.id);
    return NextResponse.json(
      { message: "Success", data: product },
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
    const { name } = await req.json();
    let product = updateProduct(name, params.id);
    return NextResponse.json(
      { message: "Success", data: product },
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
    let product = deleteProduct(params.id);
    return NextResponse.json(
      { message: "Success", data: product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
