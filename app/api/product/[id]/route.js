import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
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
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const product_id = Number(id);
    const productData = await req.json();

    // ดึงข้อมูลรูปภาพเก่า
    const [oldProduct] = await pool.query(
      "SELECT product_image FROM product WHERE product_id = ?",
      [product_id]
    );

    // ถ้ามีการเปลี่ยนรูปภาพและมีรูปเก่าอยู่ ให้ลบรูปเก่า
    if (
      oldProduct[0]?.product_image &&
      oldProduct[0].product_image !== productData.product_image
    ) {
      try {
        const oldImagePath = join(
          process.cwd(),
          "public/uploads",
          oldProduct[0].product_image
        );
        await unlink(oldImagePath);
        console.log("✅ Old image deleted:", oldProduct[0].product_image);
      } catch (err) {
        console.error("❌ Error deleting old image file:", err);
      }
    }

    // อัพเดทข้อมูลในฐานข้อมูล
    const [result] = await pool.query(
      `UPDATE product 
      SET product_name = ?, product_type = ?, product_price = ?, 
          product_size = ?, product_image = ?, product_description = ?, 
          product_status = ? 
      WHERE product_id = ?`,
      [
        productData.product_name,
        productData.product_type,
        productData.product_price,
        productData.product_size,
        productData.product_image,
        productData.product_description,
        productData.product_status,
        product_id,
      ]
    );

    return Response.json(
      {
        message: result.affectedRows
          ? "Product updated successfully"
          : "Product not found",
        data: productData,
      },
      { status: result.affectedRows ? 200 : 404 }
    );
  } catch (error) {
    console.error("❌ Error in PUT:", error);
    return Response.json(
      { message: "Error updating product", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลรูปภาพก่อนลบ
    const [product] = await pool.query(
      "SELECT product_image FROM product WHERE product_id = ?",
      [product_id]
    );

    // ลบข้อมูลในฐานข้อมูลก่อน
    const [result] = await pool.query(
      "DELETE FROM product WHERE product_id = ?",
      [product_id]
    );

    if (result.affectedRows) {
      // ถ้ามีไฟล์รูปภาพ ให้ลบออกจากเซิร์ฟเวอร์
      if (product && product[0]?.product_image) {
        try {
          const imagePath = join(
            process.cwd(),
            "public/uploads",
            product[0].product_image
          );
          await unlink(imagePath);
          console.log("✅ Image deleted:", product[0].product_image);
        } catch (err) {
          console.error("❌ Error deleting image file:", err);
        }
      }

      return NextResponse.json(
        { message: "Product deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Error in DELETE:", error);
    return NextResponse.json(
      { message: "Error deleting product", error: error.message },
      { status: 500 }
    );
  }
}
