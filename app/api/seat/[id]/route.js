import pool from "../../lib/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const seat_id = url.searchParams.get("id");
    
    if (seat_id) {
      const seatIdNumber = Number(seat_id);
      if (isNaN(seatIdNumber)) {
        return new Response(JSON.stringify({ message: "Invalid seat ID" }), { status: 400 });
      }
      const [seat] = await pool.query("SELECT * FROM seat WHERE seat_id = ?", [seatIdNumber]);
      if (seat.length === 0) {
        return new Response(JSON.stringify({ message: "Seat not found" }), { status: 404 });
      }
      return new Response(JSON.stringify(seat), { status: 200 });
    }
    
    const [seats] = await pool.query("SELECT * FROM seat");
    return new Response(JSON.stringify(seats), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching seat", error: error.message }), { status: 500 });
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
    return new Response(JSON.stringify({ message: "Seat added successfully", seat_id: result.insertId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error adding seat", error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const seat_id = url.searchParams.get("id");
    
    if (!seat_id || isNaN(Number(seat_id))) {
      return new Response(JSON.stringify({ message: "Invalid seat ID" }), { status: 400 });
    }
    
    const { seat_qrcode, seat_status, seat_zone } = await req.json();
    if (!seat_qrcode || !seat_status || !seat_zone) {
      return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
    }
    
    const [result] = await pool.query(
      "UPDATE seat SET seat_qrcode = ?, seat_status = ?, seat_zone = ? WHERE seat_id = ?",
      [seat_qrcode, seat_status, seat_zone, Number(seat_id)]
    );
    
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Seat not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ message: "Seat updated successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating seat", error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const seat_id = url.searchParams.get("id");
    
    if (!seat_id || isNaN(Number(seat_id))) {
      return new Response(JSON.stringify({ message: "Invalid seat ID" }), { status: 400 });
    }
    
    const [result] = await pool.query("DELETE FROM seat WHERE seat_id = ?", [Number(seat_id)]);
    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Seat not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ message: "Seat deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error deleting seat", error: error.message }), { status: 500 });
  }
}