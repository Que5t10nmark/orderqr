"use client";
import { useEffect, useState, useCallback } from "react";
import Modal from "../components/Modal";

const ProductTypePage = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [newProductType, setNewProductType] = useState({
    product_type_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState("");

  const fetchProductTypes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/product_type");
      if (!res.ok) throw new Error("Failed to fetch product types");
      const data = await res.json();
      setProductTypes(data);
    } catch (err) {
      setError("Error fetching product types: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProductType = async (productTypeData) => {
    try {
      const res = await fetch("/api/product_type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productTypeData),
      });
      if (!res.ok) throw new Error("Failed to add product type");
      const newProductType = await res.json();
      setProductTypes((prevProductTypes) => [
        ...prevProductTypes,
        newProductType,
      ]);
      setNotification("เพิ่มประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setError("Error adding product type: " + err.message);
    }
  };

  const updateProductType = async (productTypeId, productTypeData) => {
    try {
      const res = await fetch(`/api/product_type/${productTypeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productTypeData),
      });
      if (!res.ok) throw new Error("Failed to update product type");
      const updatedProductType = await res.json();
      setProductTypes((prevProductTypes) =>
        prevProductTypes.map((productType) =>
          productType.product_type_id === productTypeId
            ? updatedProductType
            : productType
        )
      );
      setNotification("แก้ไขประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setError("Error updating product type: " + err.message);
    }
  };

  const deleteProductType = async (productTypeId) => {
    try {
      const res = await fetch(`/api/product_type/${productTypeId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product type");
      setProductTypes((prevProductTypes) =>
        prevProductTypes.filter(
          (productType) => productType.product_type_id !== productTypeId
        )
      );
      setNotification("ลบประเภทอาหารสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
      closeModal();
    } catch (err) {
      setError("Error deleting product type: " + err.message);
    }
  };

  const openModal = (productType = null) => {
    if (productType) {
      setNewProductType({
        product_type_id: productType.product_type_id,
        product_type_name: productType.product_type_name,
      });
      setIsEditing(true);
    } else {
      setNewProductType({ product_type_name: "" });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProductType({ product_type_name: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProductType((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProductType(newProductType.product_type_id, newProductType);
    } else {
      addProductType(newProductType);
    }
    closeModal();
  };

  const clearForm = () => {
    setNewProductType({ product_type_name: "" });
  };

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">ประเภทอาหาร</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {notification && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {notification}
        </div>
      )}

      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white p-2 rounded mb-6"
      >
        เพิ่มประเภทอาหาร
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">รายการประเภทอาหาร</h2>
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ชื่อประเภทอาหาร</th>
              <th className="px-4 py-2 border">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {productTypes.map((productType) => (
              <tr key={productType.product_type_id}>
                <td className="px-4 py-2 border">
                  {productType.product_type_name}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => openModal(productType)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() =>
                      deleteProductType(productType.product_type_id)
                    }
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
          {isEditing ? "แก้ไขประเภทอาหาร" : "เพิ่มประเภทอาหารใหม่"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_type_name" className="block">
              ชื่อประเภทอาหาร
            </label>
            <input
              type="text"
              id="product_type_name"
              name="product_type_name"
              value={newProductType.product_type_name}
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

export default ProductTypePage;
