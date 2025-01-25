import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-black text-xl">
          <Link href="/">Steak NiWha</Link>
        </div>
        <div className="space-x-4">
          <Link href="/backoffice/product" className="hover:bg-orange-500 text-black px-4 py-2 rounded-md">เมนูอาหาร</Link>
          <Link href="/backoffice/staff" className="hover:bg-orange-500 text-black px-4 py-2 rounded-md">ข้อมูลพนักงาน</Link>
          <Link href="/backoffice/reports" className="hover:bg-orange-500 text-black px-4 py-2 rounded-md">รายงาน</Link>
          <Link href="/backoffice/about" className="hover:bg-orange-500 text-black px-4 py-2 rounded-md">เกี่ยวกับ</Link>
          <Link href="/backoffice/login" className="hover:bg-orange-500 text-black px-4 py-2 rounded-md">เข้าสู่ระบบ</Link>
        </div>
      </div>
    </nav>
  );
}
