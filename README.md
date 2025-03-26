# Con Học Giỏi – Backend API

Đây là mã nguồn backend của ứng dụng **"Con Học Giỏi"** – nền tảng học tập vui nhộn dành cho trẻ từ 3–6 tuổi.  
Hệ thống sử dụng **Node.js + Express** và được deploy trên [Render.com](https://render.com).

---

## 🚀 Tính năng chính

- Quản lý tài khoản phụ huynh qua số điện thoại
- Lưu danh sách bé, giới hạn tối đa 2 bé
- Cập nhật tiến độ học từng phần: toán, chữ cái, ghép vần, luyện tập
- Hệ thống thưởng: sticker, sao, skin avatar cho bé
- Giao tiếp đơn giản qua REST API, hỗ trợ app React Native

---

## 📦 Cài đặt local (dành cho dev)

```bash
git clone https://github.com/zzblastburnzz/conhocgioi-backend.git
cd conhocgioi-backend
npm install
npm run dev
```

> Server sẽ chạy tại `http://localhost:3000`

---

## 🌐 Danh sách API

### 1. Đăng nhập hoặc tạo phụ huynh
`POST /login-or-create-parent`

```json
{ "phone": "+84901234567" }
```

### 2. Thêm bé
`POST /add-child`

```json
{
  "phone": "+84901234567",
  "child": { "name": "Bé Na", "age": 5 }
}
```

### 3. Cập nhật tiến độ học
`PATCH /update-progress`

```json
{
  "phone": "+84901234567",
  "childIndex": 0,
  "subject": "math", // "alphabet" | "syllable" | "quiz"
  "amount": 10
}
```

### 4. Tặng thưởng
`PATCH /unlock-reward`

```json
{
  "phone": "+84901234567",
  "childIndex": 0,
  "rewardType": "stickers", // "stars" | "stickers" | "unlockedSkins"
  "reward": "star"
}
```

### 5. Lấy thông tin phụ huynh
`GET /get-parent-info?phone=+84901234567`

---

## ⚙️ Triển khai trên Render.com

- Cấu hình:
  - Build command: `npm install && npm run build`
  - Start command: `node dist/index.js`
  - Node version: 18

> Sau khi deploy xong, API sẽ hoạt động tại `https://conhocgioi-api.onrender.com`

---

## 👩‍💻 Tác giả
- Ant Team -
- Phụ trách kỹ thuật: **Minh Anh – Dev AI & React Native**
- Quản lý dự án: *Phạm Công Thành**

---

> App đang trong giai đoạn hoàn thiện và chuẩn bị phát hành lên CH Play & App Store.