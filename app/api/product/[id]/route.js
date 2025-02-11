import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import pool from "../../../lib/db";

async function handleDBQuery(query, params) {
  try {
    const [result] = await pool.query(query, params);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req, { params: { id } }) {
  const product_id = Number(id);
  if (isNaN(product_id))
    return Response.json({ message: "Invalid product ID" }, { status: 400 });
  const product = await handleDBQuery(
    `
    SELECT p.*, pt.product_type_name 
    FROM product p
    JOIN product_type pt ON p.product_type = pt.product_type_id
    WHERE p.product_id = ?
    `,
    [product_id]
  );

  return Response.json(
    product.length
      ? product
      : {
          message: "Product not found",
        },
    {
      status: product.length ? 200 : 404,
    }
  );
}

export async function PUT(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split("/").pop();
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return NextResponse.json({ message: "❌ Invalid product ID" }, { status: 400 });
    }

    // ✅ ตรวจสอบ Content-Type ว่าเป็น `multipart/form-data` หรือ `application/json`
    const contentType = req.headers.get("content-type") || "";
    let productData = {};
    let product_image = "";

    if (contentType.includes("multipart/form-data")) {
      // ✅ ใช้ `FormData` (รองรับอัปโหลดไฟล์)
      const formData = await req.formData();
      console.log("🔹 Received formData:", formData);

      productData = {
        product_name: formData.get("product_name") || "",
        product_type: formData.get("product_type") || "",
        product_price: formData.get("product_price") || "0",
        product_size: formData.get("product_size") || "",
        product_description: formData.get("product_description") || "",
        product_status: formData.get("product_status") === "1" ? 1 : 0,
      };

      // ✅ ตรวจสอบว่ามีการอัปโหลดไฟล์ใหม่หรือไม่
      const file = formData.get("file");
      if (file && file.name) {
        const ext = file.name.split(".").pop();
        product_image = `${Date.now()}.${ext}`;
        const filePath = join(process.cwd(), "public/uploads", product_image);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        console.log("✅ Image uploaded:", product_image);
      } else {
        product_image = formData.get("product_image") || ""; // ใช้ค่าภาพเดิมถ้าไม่มีอัปโหลดใหม่
      }
    } else {
      // ✅ ใช้ JSON (ไม่รองรับอัปโหลดไฟล์)
      productData = await req.json();
      product_image = productData.product_image || "";
    }

    console.log("🔹 Parsed productData:", productData);
    console.log("🔹 Using product_image:", product_image);

    // ✅ อัปเดตฐานข้อมูล
    const query = `
      UPDATE product 
      SET product_name = ?, product_type = ?, product_price = ?, 
          product_size = ?, product_image = ?, product_description = ?, 
          product_status = ? 
      WHERE product_id = ?
    `;

    const params = [
      productData.product_name,
      productData.product_type,
      productData.product_price,
      productData.product_size,
      product_image,
      productData.product_description,
      productData.product_status,
      product_id,
    ];

    console.log("🔹 Executing SQL Query:", query);
    console.log("🔹 Query Parameters:", params);

    const [result] = await pool.query(query, params);

    console.log("✅ Query result:", result);

    return NextResponse.json(
      { message: result.affectedRows ? "✅ Product updated" : "❌ Product not found" },
      { status: result.affectedRows ? 200 : 404 }
    );
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json(
      { message: "❌ Error updating product", error: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  const url = new URL(req.nextUrl);
  const id = url.pathname.split("/").pop();

  const product_id = Number(id);
  if (isNaN(product_id))
    return Response.json({ message: "Invalid product ID" }, { status: 400 });

  const result = await handleDBQuery(
    "DELETE FROM product WHERE product_id = ?",
    [product_id]
  );

  return Response.json(
    {
      message: result.affectedRows ? "Product deleted" : "Product not found",
    },
    { status: result.affectedRows ? 200 : 404 }
  );
}
