import pool from "../../lib/db";

export async function GET() {
  try {
    const [products] = await pool.query("SELECT * FROM product");
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching products",
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

    // Check for required fields
    if (
      !product_name ||
      !product_type ||
      !product_price ||
      !product_size ||
      product_status === undefined ||
      !product_image ||
      !product_description
    ) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

