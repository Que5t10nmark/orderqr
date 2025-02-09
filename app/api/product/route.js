import pool from "../../lib/db";

export async function GET() {
  try {
    const [product] = await pool.query(`
      SELECT p.*, pt.product_type_name 
      FROM product p
      JOIN product_type pt ON p.product_type = pt.product_type_id
    `);
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching product",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// เพิ่มข้อมูลสินค้า
export async function POST(req) {
  try {
    const {
      product_name,
      product_type,
      product_price,
      product_size,
      product_image,
      product_description,
      product_status,
    } = await req.json();

    // ตรวจสอบค่าที่ส่งมาว่าถูกต้องและไม่ว่าง
    if (
      !product_name ||
      !product_type ||
      !product_price ||
      !product_size ||
      !product_status ||
      !product_image
    ) {
      return new Response(
        JSON.stringify({ message: "Missing or invalid required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ถ้าไม่มี product_description ให้ใส่เป็นค่าว่าง ("")
    const productDescription = product_description || "";

    // เพิ่มข้อมูลลงฐานข้อมูล
    const [result] = await pool.query(
      "INSERT INTO product (product_name, product_type, product_price, product_size, product_image, product_description, product_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        product_name,
        product_type,
        product_price,
        product_size,
        product_image,
        product_description,
        product_status,
      ]
    );

    // ตรวจสอบว่าเพิ่มสำเร็จหรือไม่
    if (result.affectedRows === 0) {
      throw new Error("Failed to insert product");
    }

    return new Response(
      JSON.stringify({
        id: result.insertId,
        product_name,
        product_type,
        product_price,
        product_size,
        product_image,
        product_description,
        product_status,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding product:", error.message);
    return new Response(
      JSON.stringify({
        message: "Error adding product",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
