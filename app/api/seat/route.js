import pool from "../../lib/db";

export async function GET() {
  try {
    const [seat] = await pool.query("SELECT * FROM seat");

    return new Response(JSON.stringify(seat), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error fetching seat",
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
    const { seat_qrcode } = await req.json();
    if (!seat_qrcode) {
      return new Response(
        JSON.stringify({ message: "Missing required field: seat_qrcode" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "INSERT INTO seat (seat_qrcode) VALUES (?)",
      [seat_qrcode]
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
