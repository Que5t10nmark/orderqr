"use client";
import { useState, useEffect, useCallback } from "react";
import Modal from "../components/Modal";
import Image from "next/image";
("use client");
import { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";

const ProductsPage = () => {
  const [product, setProduct] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_type: "",
    product_price: "",
    product_size: "",
    product_image: "",
    product_description: "",
    product_status: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState("");

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/product");
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setError("Error fetching product: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to add product");
      const newProduct = await res.json();
      setProduct((prevProduct) => [...prevProduct, newProduct]);
      setNotification("เพิ่มประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setError("Error adding product: " + err.message);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to update product ");
      const updatedProduct = await res.json();
      setProduct((prevProduct) =>
        prevProduct.map((product) =>
          product.product_id === productId ? updatedProduct : product
        )
      );
      setNotification("แก้ไขประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setError("Error updating product type: " + err.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProduct((prevProduct) =>
        prevProduct.filter((product) => product.product_id !== productId)
      );
      setNotification("ลบประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
      closeModal();
    } catch (err) {
      setError("Error deleting product type: " + err.message);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setNewProduct({
        product_id: product.product_id,
        product_name: product.product_name,
        product_type: product.product_type,
        product_price: product.product_price,
        product_size: product.product_size,
        product_image: product.product_image,
        product_description: product.product_description,
        product_status: product.product_status,
      });
      setIsEditing(true);
    } else {
      setNewProduct({ product_name: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProduct({
      product_name: "",
      product_type: "",
      product_price: "",
      product_size: "",
      product_image: "",
      product_description: "",
      product_status: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(newProduct.product_id, newProduct);
    } else {
      addProduct(newProduct);
    }
    closeModal();
  };

  const clearForm = () => {
    setNewProduct({
      product_name: "",
      product_type: "",
      product_price: "",
      product_size: "",
      product_image: "",
      product_description: "",
      product_status: "",
    });
  };

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const renderError = () => {
    if (error) {
      return <p className="text-red-500 mb-4">{error}</p>;
    }
    return null;
  };

  const filteredProduct = product.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">รายการอาหาร</h1>

      {renderError()}

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {notification && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {notification}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาอาหาร"
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded mb-6"
      >
        เพิ่มรายการอาหาร
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">รายการอาหาร</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ชื่ออาหาร</th>
              <th className="px-4 py-2 border">ประเภทอาหาร</th>
              <th className="px-4 py-2 border">ราคา</th>
              <th className="px-4 py-2 border">ขนาด</th>
              <th className="px-4 py-2 border">รูปภาพ</th>
              <th className="px-4 py-2 border">คําอธิบาย</th>
              <th className="px-4 py-2 border">สถานะ</th>
              <th className="px-4 py-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((product) => (
              <tr key={product.product_id}>
                <td className="px-4 py-2 border">{product.product_name}</td>
                <td className="px-4 py-2 border">{product.product_type}</td>
                <td className="px-4 py-2 border">{product.product_price}</td>
                <td className="px-4 py-2 border">{product.product_size}</td>
                <td className="px-4 py-2 border">{product.product_image}</td>
                <td className="px-4 py-2 border">
                  {product.product_description}
                </td>
                <td className="px-4 py-2 border">{product.product_status}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => openModal(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteProduct(product.product_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "แก้ไขรายการอาหาร" : "เพิ่มอาหารใหม่"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block">
              ชื่ออาหาร
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={newProduct.product_name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <lable htmlFor="product_type" classname="block">
              ประเภทอาหาร
            </lable>
            <input
              type="text"
              id="product_type"
              name="product_type"
              value={newProduct.product_type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="product_price" className="block">
              ราคา
            </label>
            =======
            <label htmlFor="product_type" className="block">
              ประเภทอาหาร
            </label>
            <input
              type="text"
              id="product_type"
              name="product_type"
              value={newProduct.product_type}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_price" className="block">
              ราคา
            </label>
            <input
              type="string"
              id="product_price"
              name="product_price"
              value={newProduct.product_price}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_size" className="block">
              ขนาด
            </label>
            <input
              type="text"
              id="product_size"
              name="product_size"
              value={newProduct.product_size}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_image" className="block">
              รูปภาพ
            </label>
            <input
              type="text"
              id="product_image"
              name="product_image"
              value={newProduct.product_image}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_description" className="block">
              คําอธิบาย
            </label>
            <input
              type="text"
              id="product_description"
              name="product_description"
              value={newProduct.product_description}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_status" className="block">
              สถานะ
            </label>
            <input
              type="text"
              id="product_status"
              name="product_status"
              value={newProduct.product_status}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded"
            >
              {isEditing ? "บันทึกการแก้ไข" : "บันทึก"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              เคลียร์
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-6 py-2 rounded"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
