import { addProduct, getProducts } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  try {
    const query = req.nextUrl.searchParams.get("query");
    console.log("query ", query);
    const product = getProducts();
    return NextResponse.json(
      { message: "Success", data: product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  const { name } = await req.json();
  try {
    const product = { id: Date.now().toString(), name, date: new Date() };
    addProduct(product);
    return NextResponse.json(
      { message: "Success", data: product },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
