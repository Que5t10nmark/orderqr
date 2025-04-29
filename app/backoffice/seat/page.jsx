"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "../components/Modal";
import { useRouter } from "next/navigation";

const SeatPage = () => {
  const router = useRouter();
  const qrRef = useRef();
  const [seats, setSeats] = useState([]);
  const [newSeat, setNewSeat] = useState({
    seat_qrcode: "",
    seat_status: "เปิด",
    seat_zone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSeatId, setEditingSeatId] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchSeats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/seat");
      if (!res.ok) throw new Error("Failed to fetch seats");
      const data = await res.json();
      setSeats(data);
    } catch (err) {
      setError("Error fetching seats: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSeat((prev) => ({ ...prev, [name]: value }));
  };
  const handleQRCodeClick = (seat_qrcode) => {
    router.push(`/backoffice/product`);
  };
  const addOrUpdateSeat = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await fetch(`/api/seat/${editingSeatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSeat),
        });
        if (!res.ok) throw new Error("Failed to update seat");
        setSeats((prevSeats) => prevSeats.map((seat) => (seat.seat_id === editingSeatId ? { ...seat, ...newSeat } : seat)));
        setNotification("แก้ไขที่นั่งสำเร็จ!");
      } else {
        const seatData = { ...newSeat, seat_qrcode: `seat-${newSeat.seat_zone}-${Date.now()}` };
        const res = await fetch("/api/seat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(seatData),
        });
        if (!res.ok) throw new Error("Failed to add seat");
        const newSeatData = await res.json();
        setSeats((prevSeats) => [...prevSeats, { ...seatData, seat_id: newSeatData.seat_id }]);
        setNotification("เพิ่มที่นั่งสำเร็จ!");
      }
      setTimeout(() => setNotification(""), 3000);
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingSeatId(null);
    } catch (err) {
      setError("Error processing seat: " + err.message);
    }
  };

  const deleteSeat = async (seat_id) => {
    try {
      const res = await fetch(`/api/seat/${seat_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete seat");
      setSeats((prevSeats) => prevSeats.filter((seat) => seat.seat_id !== seat_id));
      setNotification("ลบที่นั่งสำเร็จ!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      setError("Error deleting seat: " + err.message);
    }
  };

  const openEditModal = (seat) => {
    setNewSeat(seat);
    setIsEditing(true);
    setEditingSeatId(seat.seat_id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">จัดการที่นั่ง</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {notification && <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">{notification}</div>}

      <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded mb-6">เพิ่มที่นั่ง</button>

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">โซน</th>
            <th className="px-4 py-2 border">สถานะ</th>
            <th className="px-4 py-2 border">QR Code</th>
            <th className="px-4 py-2 border">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((seat) => (
            <tr key={seat.seat_id}>

              <td className="px-4 py-2 border">{seat.seat_zone}</td>
              <td className="px-4 py-2 border">{seat.seat_status}</td>
              <td className="px-4 py-2 border cursor-pointer" onClick={() => handleQRCodeClick(seat.seat_qrcode)}>
                <QRCodeCanvas value={seat.seat_qrcode} size={50} />
              </td>
              <td className="px-4 py-2 border">
                <button onClick={() => openEditModal(seat)} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">แก้ไข</button>
                <button onClick={() => deleteSeat(seat.seat_id)} className="bg-red-500 text-white px-4 py-2 rounded">ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal title={isEditing ? "แก้ไขที่นั่ง" : "เพิ่มที่นั่งใหม่"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={addOrUpdateSeat} className="space-y-4">
          <div>
            <label htmlFor="seat_zone" className="block">โซนที่นั่ง</label>
            <input type="text" id="seat_zone" name="seat_zone" value={newSeat.seat_zone} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label htmlFor="seat_status" className="block">สถานะ</label>
            <select id="seat_status" name="seat_status" value={newSeat.seat_status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
              <option value="เปิด">เปิด</option>
              <option value="ปิด">ปิด</option>
            </select>
          </div>
          <div className="mt-4 flex gap-4">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">บันทึก</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-6 py-2 rounded">ยกเลิก</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SeatPage;