import pool from "../../../lib/db";
export async function GET(req, { params }) {
  try {
    const product_id = Number(params.id);
    if (isNaN(product_id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [products] = await pool.query(
      "SELECT * FROM product WHERE product_id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return new Response(
        JSON.stringify({ message: "Product not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(products[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const product_id = Number(id);

    if (isNaN(product_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid product_ID" }),
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
