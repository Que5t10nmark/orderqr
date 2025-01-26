'use client';
import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const toggleReportMenu = () => {
    setIsReportOpen((prev) => !prev);
  };

  return (
    <aside className="bg-orange-500 text-white w-1/6 h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Steak NiWha</h2>
      <nav className="flex flex-col space-y-8">
        <Link href="/" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          หน้าหลัก
        </Link>
        <Link href="/backoffice/product" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          เมนูอาหาร
        </Link>
        <Link href="/backoffice/product_type" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          ประเภทอาหาร
        </Link>
        <Link href="/backoffice/product_size" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          ขนาดอาหาร
        </Link>
        <Link href="/backoffice/seat" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          ข้อมูลโต๊ะ
        </Link>
        <Link href="/backoffice/staff" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
          ข้อมูลพนักงาน
        </Link>
        
        <button
          onClick={toggleReportMenu}
          className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md text-left"
        >
          รายงาน
        </button>
        {isReportOpen && (
          <div className="flex flex-col space-y-4 pl-4">
            <Link href="/report1" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
              รายงานรายการอาหารรายวันหรือรายเดือน
            </Link>
            <Link href="/report2" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
              รายงานการขายรายวันหรือรายเดือน
            </Link>
            <Link href="/report3" className="hover:bg-white hover:text-orange-500 text-white px-4 py-2 rounded-md">
              รายงานยอดขายรายการอาหารที่ขายดีหรือไม่ดี
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}
