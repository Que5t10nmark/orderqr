import pool from "../../lib/db";

export async function GET() {
  try {
    const [Purchase] = await pool.query("SELECT * FROM purchase");

    return new Response(JSON.stringify(Purchase), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching purchase",
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
    const { purchase_date } = await req.json();
    if (!purchase_date) {
      return new Response(
        JSON.stringify({ message: "Missing required field: purchase_date" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO purchase (purchase_date) VALUES (?)",
      [purchase_date]
    );

    return new Response(
      JSON.stringify({
        message: "purchase added successfully",
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
        message: "Error adding purchase",
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
