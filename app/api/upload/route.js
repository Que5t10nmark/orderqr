import multer from "multer";
import path from "path";
import fs from "fs";
import nc from "next-connect"; // ใช้ next-connect เพื่อรองรับ multipart form data

// สร้างโฟลเดอร์ `public/uploads` หากยังไม่มี
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// กำหนดค่าการเก็บไฟล์ (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const apiRoute = nc({
  onError(error, req, res) {
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Method Not Allowed" });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`; // เส้นทางของรูปภาพที่อัปโหลด
  res.status(200).json({ url: imageUrl });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // ปิดค่าเริ่มต้นของ bodyParser เพื่อรองรับ multipart form data
  },
};
