import pool from "../../lib/db";

export async function GET() {
  try {
    const [productTypes] = await pool.query("SELECT * FROM product_type");

    return new Response(JSON.stringify(productTypes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching product types",
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
    const { product_type_name } = await req.json();
    if (!product_type_name) {
      return new Response(
        JSON.stringify({ message: "Missing required field: product_type_name" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO product_type (product_type_name) VALUES (?)",
      [product_type_name]
    );

    return new Response(
      JSON.stringify({
        message: "Product type added successfully",
        id: result.insertId,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error adding product type",
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
