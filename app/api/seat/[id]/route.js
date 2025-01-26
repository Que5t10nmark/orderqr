import pool from "../../../lib/db";
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const seat_id = Number(id);

    if (isNaN(seat_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid seat ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [seat] = await pool.query(
      "SELECT * FROM seat WHERE seat_id = ?",
      [seat_id]
    );

    if (seat.length === 0) {
      return new Response(
        JSON.stringify({ message: "seat not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const [result] = await pool.query(
        "INSERT INTO seat (seat_qrcode) VALUES (?)",
        [seat_qrcode]
      );
  
      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ message: "Failed to add seat" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify({ message: "seat added successfully", seat_id: result.insertId }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: "Error adding seat",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const seat_id = Number(id);

    if (isNaN(seat_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid seat ID" }),
        {
          status: 400, 
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { seat_qrcode } = await req.json();
    if (!seat_qrcode) {
      return new Response(
        JSON.stringify({ message: "seat_qrcode is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "UPDATE seat SET seat_qrcode = ? WHERE seat_id = ?",
      [seat_qrcode, seat_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "seat not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "seat updated successfully" }),
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
        message: "Error updating seat",
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
    const seat_id = Number(id);

    if (isNaN(seat_id)) {
      return new Response(
        JSON.stringify({ message: "Invalid seat ID" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [result] = await pool.query(
      "DELETE FROM seat WHERE seat_id = ?",
      [seat_id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "seat not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "seat deleted successfully" }),
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
        message: "Error deleting seat",
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

