import pool from "../../../lib/db";

async function handleDBQuery(query, params) {
  try {
    const [result] = await pool.query(query, params);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function GET(req, { params: { id } }) {
  const product_id = Number(id);
  if (isNaN(product_id)) 
    return Response.json({ message: "Invalid product ID" }, { status: 400 });
  const product = await handleDBQuery("SELECT * FROM product WHERE product_id = ?",
     [product_id]);
  return Response.json(
    product.length ? product : { 
      message: "Product not found" }, { 
        status: product.length ? 200 : 404 });
}

export async function POST(req) {
  const body = await req.json();
  if (!body.product_name) 
    return Response.json({ message: "Missing product_name" }, { status: 400 });
  const result = await handleDBQuery("INSERT INTO product SET ?", 
    [body]);
  return Response.json({ 
    message: "Product added", product_id: result.insertId }, { status: 201 });
}

export async function PUT(req, { params: { id } }) {
  const product_id = Number(id);
  const body = await req.json();
  if (isNaN(product_id) || Object.values(body).some(v => !v)) 
    return Response.json({ message: "Invalid data" }, { status: 400 });
  const result = await handleDBQuery("UPDATE product SET ? WHERE product_id = ?", 
    [body, product_id]);
  return Response.json({ 
    message: result.affectedRows ? "Product updated" : "Product not found" }, { 
      status: result.affectedRows ? 200 : 404 });
}

export async function DELETE(req, { params: { id } }) {
  const product_id = Number(id);
  if (isNaN(product_id)) 
    return Response.json({ message: "Invalid product ID" }, { status: 400 });
  const result = await handleDBQuery("DELETE FROM product WHERE product_id = ?", 
    [product_id]);
  return Response.json({ 
    message: result.affectedRows ? "Product deleted" : "Product not found" }, { 
      status: result.affectedRows ? 200 : 404 });
}
