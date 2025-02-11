import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req) {
  try {
    // ✅ ใช้ `req.formData()` เพื่อดึงข้อมูลไฟล์จากฟอร์ม
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "❌ No file uploaded" }, { status: 400 });
    }

    // ✅ อ่านข้อมูลไฟล์
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // ✅ ตั้งชื่อไฟล์ใหม่
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = join(process.cwd(), "public/uploads", fileName);

    // ✅ บันทึกไฟล์ไปที่ `public/uploads`
    await writeFile(filePath, buffer);

    return NextResponse.json(
      { message: "✅ File uploaded successfully", fileName },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "❌ Error uploading file", error: error.message },
      { status: 500 }
    );
  }
}
