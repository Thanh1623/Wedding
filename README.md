# Solenne — thiệp cưới cinematic

Thiệp cưới online tĩnh. Khách mở phong bì, xem thước phim ngắn của cặp đôi và gửi RSVP. Câu trả lời lưu trên Supabase — không cần tự viết backend.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) hoặc gửi thiệp cá nhân:

`http://localhost:3000/?to=Anh%20Minh`

## Tuỳ chỉnh cho đám cưới thật

Sửa một file: [`src/data/wedding.ts`](src/data/wedding.ts)

- Tên, bố mẹ, ngày, địa điểm, copy tiếng Việt / Anh
- Ảnh: thả vào [`public/anh/`](public/anh/) — đọc `HUONG-DAN.txt`, giữ nguyên tên file

## RSVP (Supabase)

1. Tạo project tại [supabase.com](https://supabase.com).
2. SQL Editor → dán [`supabase/rsvp.sql`](supabase/rsvp.sql) → Run.
3. Project Settings → API: copy **Project URL** và **service_role** (secret).
4. Copy [`env.example`](env.example) thành `.env.local` và điền 3 biến. Đặt mật khẩu riêng cho `RSVP_ADMIN_PASSWORD`.
5. Restart `npm run dev`.

Khách gửi form là hàng xuất hiện trong Table Editor (`rsvps`). Hai bạn xem nhanh tại `/ket-qua` (không gắn link trên thiệp). Trên Vercel, thêm cùng 3 biến ở Project Settings → Environment Variables.

## Deploy

Đẩy lên [Vercel](https://vercel.com) (Import Git hoặc `npx vercel`).

```bash
npm run build
```

## Ghi chú

- Sổ lưu bút đã bỏ vì cần chỗ lưu chung. RSVP dùng Supabase; máy khách chỉ nhớ đã gửi để không hiện form lần nữa.
- Nhạc nền là music box soạn riêng trong `src/lib/music-box.ts` — không dùng nhạc bản quyền.
- `prefers-reduced-motion` tắt cánh hoa, film grain và ken burns.
