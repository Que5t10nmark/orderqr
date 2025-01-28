import pool from "../../../lib/db";
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const product_type_id = Number(id);

    if (isNaN(product_type_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product type ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [productTypes] = await pool.query(
      "SELECT * FROM product_type WHERE product_type_id = ?",
      [product_type_id]
    );

    if (productTypes.length === 0) {
      return new Response(
        JSON.stringify({ message: "Product type not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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

    const body = await req.json();
    const { product_type_name } = body || {};

    if (!product_type_name) {
      return new Response(
        JSON.stringify({ message: "Missing required field: product_type_name" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO product_type (product_type_name) VALUES (?)",
      [product_type_name]
    );

    if (!result || result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to add product type" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        message: "Product type added successfully",
        product_type_id: result.insertId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error adding product type",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const product_type_id = Number(id);

    if (isNaN(product_type_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product type ID" }),
        {
          status: 400, 
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { product_type_name } = await req.json();
    if (!product_type_name) {
      return new Response(
        JSON.stringify({ message: "Product type name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "UPDATE product_type SET product_type_name = ? WHERE product_type_id = ?",
      [product_type_name, product_type_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Product type not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product type updated successfully" }),
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
        message: "Error updating product type",
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
    const { id } = params;
    const product_type_id = Number(id);

    if (isNaN(product_type_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product type ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM product_type WHERE product_type_id = ?",
      [product_type_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Product type not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Product type deleted successfully" }),
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
        message: "Error deleting product type",
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
