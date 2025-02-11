import pool from "../../lib/db";

export async function GET() {
  try {
    const [product] = await pool.query(`
      SELECT p.*, pt.product_type_name, 
        CASE 
          WHEN p.product_status = 1 THEN 'มีสินค้า' 
          ELSE 'ไม่มีสินค้า' 
        END AS product_status_name
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
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// ✅ เพิ่มข้อมูลสินค้า
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

    // ✅ ตรวจสอบค่าที่จำเป็นต้องมี
    if (!product_name || !product_type || !product_price || !product_size || product_status === undefined) {
      return new Response(
        JSON.stringify({ message: "❌ Missing or invalid required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ ถ้าไม่มี product_description ให้ใช้ค่าเริ่มต้นเป็น string ว่าง
    const productDescription = product_description ?? "";
    const statusValue = product_status === true || product_status === "1" ? 1 : 0;
    const productImage = product_image ?? "";

    // ✅ ใช้ try-catch รอบ SQL query ป้องกัน syntax error
    try {
      const [result] = await pool.query(
        `INSERT INTO product 
          (product_name, product_type, product_price, product_size, product_image, product_description, product_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product_name, product_type, product_price, product_size, productImage, productDescription, statusValue]
      );

      if (result.affectedRows === 0) {
        throw new Error("❌ Failed to insert product");
      }

      console.log("✅ Product added:", result.insertId);

      return new Response(
        JSON.stringify({
          id: result.insertId, // ✅ ส่ง `id` กลับไปให้ Frontend
          product_name,
          product_type,
          product_price,
          product_size,
          product_image: productImage,
          product_description: productDescription,
          product_status: statusValue,
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (sqlError) {
      return new Response(
        JSON.stringify({
          message: "❌ SQL Syntax Error",
          error: sqlError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    return new Response(
      JSON.stringify({
        message: "❌ Error adding product",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
