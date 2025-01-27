"use client";
import { useState, useEffect, useCallback } from "react";
import Modal from "../components/Modal";
import Swal from "sweetalert2";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
<<<<<<< HEAD
    product_name: "",
    product_type: "",
    product_price: "",
    product_size: "",
    product_image: "",
    product_description: "",
=======
    product_name: '',
    product_price: '',
    product_size: '',
    product_image: '',
    product_description: '',
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
    product_status: true,
    product_type: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState("");

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
  const fetchProductTypes = useCallback(async () => {
    try {
      const res = await fetch("/api/product_type");
      if (!res.ok) throw new Error("Failed to fetch product types");
      const data = await res.json();
      setProductTypes(data);
    } catch (err) {
      setError("Error fetching product types: " + err.message);
    }
  }, []);

=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/product");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Error fetching products: " + err.message);
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
      setProducts((prevProducts) => [...prevProducts, newProduct]);
<<<<<<< HEAD
      setNotification("เพิ่มรายการสำเร็จ!");
=======
      setNotification('เพิ่มรายการสำเร็จ!');
      setTimeout(() => setNotification(''), 3000);
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
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
      if (!res.ok) throw new Error("Failed to update product");
      const updatedProduct = await res.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.product.id === productId ? updatedProduct : product
        )
      );
      setNotification("แก้ไขสำเร็จ!");
    } catch (err) {
      setError("Error updating product: " + err.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product.id !== productId)
      );
      setNotification("ลบสำเร็จ!");
      closeModal();
    } catch (err) {
      setError("Error deleting product: " + err.message);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setNewProduct({
        product_id: product.product_id,
        product_name: product.product_name,
        product_size: product.product_size,
        product_price: product.product_price,
        product_image: product.product_image,
        product_description: product.product_description,
        product_status: product.product_status,
        product_type: product.product_type,
      });
      setIsEditing(true);
    } else {
      setNewProduct({ product_name: '' });
      setNewProduct({ product_size: '' });
      setNewProduct({ product_price: '' });
      setNewProduct({ product_image: '' });
      setNewProduct({ product_description: '' });
      setNewProduct({ product_status: '' });
      setNewProduct({ product_type: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProduct({
      product_name: "",
      product_price: "",
      product_size: "",
      product_image: "",
      product_description: "",
      product_status: true,
      product_type: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(newProduct.id, newProduct);
    } else {
      addProduct(newProduct);
    }
    closeModal();
  };

  const clearForm = () => {
    setNewProduct({
      product_name: "",
      product_price: "",
      product_size: "",
      product_image: "",
      product_description: "",
      product_status: true,
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
      product_type: "",
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
    });
  };

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const renderError = () =>
    error && <p className="text-red-500 mb-4">{error}</p>;
  const renderLoading = () => loading && <p>กำลังโหลด...</p>;

  const handleEdit = (product) => {
    setNewProduct({
      id: product.id,
      product_name: product.product_name,
      product_price: product.product_price,
      product_size: product.product_size,
      product_image: product.product_image,
      product_description: product.product_description,
      product_status: product.product_status,
    });
    setIsEditing(true);
    openModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">รายการอาหาร</h1>

      {renderError()}

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
        onClick={openModal}
        className="bg-blue-500 text-white p-2 rounded mb-6"
      >
        เพิ่มข้อมูล
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">รายการอาหาร</h2>
        {renderLoading()}
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ชื่อสินค้า</th>
              <th className="px-4 py-2 border">ประเภทอาหาร</th>
              <th className="px-4 py-2 border">ราคา</th>
              <th className="px-4 py-2 border">ขนาด</th>
              <th className="px-4 py-2 border">สถานะ</th>
              <th className="px-4 py-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border">{product.product_name}</td>
                <td className="px-4 py-2 border">
                  {product.product_price} บาท
                </td>
                <td className="px-4 py-2 border">{product.product_size}</td>
                <td className="px-4 py-2 border">{product.product_type}</td>
                <td className="px-4 py-2 border">
                  {product.product_status ? "เปิดใช้งาน" : "ปิดการใช้งาน"}
                </td>

                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
=======
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
      {filteredProducts.map((product) => (
        <tr key={product.id}>
          <td className="px-4 py-2 border">{product.product_name}</td>
          <td className="px-4 py-2 border">{product.product_price} บาท</td>
          <td className="px-4 py-2 border">{product.product_size}</td>
          <td className="px-4 py-2 border">
            {product.product_status ? 'เปิดใช้งาน' : 'ปิดการใช้งาน'}
        </td>
          <td className="px-4 py-2 border">
        <button
          onClick={() => handleEdit(product)}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          แก้ไข
        </button>
        <button
          onClick={() => deleteProduct(product.id)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ลบ
        </button>
      </td>
    </tr>
  ))}
</tbody>
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
        </table>
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <h2 className="text-xl font-semibold mb-4">
<<<<<<< Updated upstream
          {isEditing ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหารใหม่'}
=======
<<<<<<< HEAD
<<<<<<< HEAD
          {isEditing ? "แก้ไข" : "เพิ่มรายการอาหารใหม่"}
=======
          {isEditing ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหารใหม่'}
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
          {isEditing ? 'แก้ไขรายการอาหาร' : 'เพิ่มรายการอาหารใหม่'}
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block">
              ชื่อสินค้า
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
            <label htmlFor="product_price" className="block">
              ราคา
            </label>
            <input
              type="text"
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
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label htmlFor="product_description" className="block">
              รายละเอียด
            </label>
            <textarea
              id="product_description"
              name="product_description"
              value={newProduct.product_description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div>
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
            <label htmlFor="product_type" className="block">
              ประเภท
            </label>
            <select
              id="product_type"
              name="product_type"
              value={newProduct.product_type}
=======
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
            <label htmlFor="product_status" className="block">สถานะ</label>
            <textarea
              id="product_status"
              name="product_status"
              value={newProduct.product_status}
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
=======
>>>>>>> a35710a88df51a73354ef0dd0f92aac7a1a8e2a8
>>>>>>> Stashed changes
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? "อัปเดต" : "เพิ่ม"}
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
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
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
