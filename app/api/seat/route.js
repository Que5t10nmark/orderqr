import pool from "../../lib/db";

export async function GET() {
  try {
    const [seats] = await pool.query("SELECT * FROM seat");
    return new Response(JSON.stringify(seats), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching seats", error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { seat_qrcode, seat_status, seat_zone } = await req.json();

    if (!seat_qrcode || !seat_status || !seat_zone) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO seat (seat_qrcode, seat_status, seat_zone) VALUES (?, ?, ?)",
      [seat_qrcode, seat_status, seat_zone]
    );

    return new Response(
      JSON.stringify({ message: "Seat added successfully", seat_id: result.insertId }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error adding seat", error: error.message }), { status: 500 });
  }
}
