import pool from "../../../lib/db";
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [product] = await pool.query(
      "SELECT * FROM product WHERE product_id = ?",
      [product_id]
    );

    if (product.length === 0) {
      return new Response(
        JSON.stringify({ message: "Product type not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

export async function POST(req) {
  try {

    const body = await req.json();
    const { product_name } = body || {};

    if (!product_name) {
      return new Response(
        JSON.stringify({ message: "Missing required field: product_name" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO product (product_name, product_type, product_price, product_size, product_image, product_description, product_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [product_name, product_type, product_price, product_size, product_image, product_description, product_status]
    );

    if (!result || result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to add product" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        message: "Product added successfully",
        product_id: result.insertId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error adding product",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const {
      product_name,
      product_type,
      product_price,
      product_size,
      product_image,
      product_description,
      product_status,
    } = await req.json();

    if (!product_name || !product_type || !product_price || !product_size || !product_image || !product_description === undefined) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "UPDATE product SET product_name = ?, product_type = ?, product_price = ?, product_size = ?, product_image = ?, product_description = ?, product_status = ? WHERE product_id = ?",
      [
        product_name,
        product_type,
        product_price,
        product_size,
        product_image,
        product_description,
        product_status,
        product_id,
      ]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error updating product",
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


export async function DELETE(req, { params }) {
  try {
    if (req.method !== "DELETE") {
      return new Response(
        JSON.stringify({ message: "Method Not Allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { id } = params;
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM product WHERE product_id = ?",
      [product_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error deleting product",
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
