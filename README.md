# 🌱 Học Bản Chất

Nền tảng học trực tuyến cho người học **từ 1 đến 18 tuổi** — học một lần, hiểu tận gốc.

- **Giao diện "lớn lên" cùng người học**: 5 giai đoạn (Mầm 1–3 · Chồi 3–6 · Tiểu học · THCS · THPT), mỗi giai đoạn có màu sắc, cỡ chữ, vùng chạm, giọng đọc và cách phản hồi riêng.
- **Bám chuẩn**: Chương trình GDPT 2018, Chương trình GD mầm non; đối chiếu CCSS, NGSS, CEFR.
- **Đủ cấp độ**: đồ thị 49 kỹ năng nối từ nhà trẻ đến lớp 12; mỗi kỹ năng 4 mức Nhận biết → Vận dụng cao.
- **Vòng "Hiểu bản chất" 6 bước**: Tò mò → Khám phá (mô phỏng tương tác) → Bản chất → Luyện tập đến khi vững → Giảng lại → Ghi nhớ + ôn giãn cách.
- **10 bài tương tác đầy đủ**: Màu sắc, Con vật (1–3 tuổi) · Đếm đến 10 (3–6) · Cộng qua 10, Phân số, Ngày và đêm (tiểu học) · Phương trình bậc nhất, Định lí Pythagore (THCS) · Hàm số bậc hai, Chuyển động ném (THPT).
- **Nghe – nhìn sống động, 100% tiếng Việt**: lời đọc tiếng Việt cho mọi lứa tuổi (đọc đúng ký hiệu toán: x² → "x bình phương", 3/8 → "3 phần 8"), lời khen ngẫu nhiên; âm thanh vui nhộn và nhạc nền hộp nhạc tự sáng tác (WebAudio, không cần tệp); pháo hoa, tia sao, băng rôn lên mức, cúp vàng, linh vật phản ứng, nền chuyển động riêng từng lứa tuổi (bong bóng, sao, mây, hình học, vũ trụ).
- **Báo cáo phụ huynh/giáo viên**: mức hiểu, lịch ôn, *con hay nhầm ở đâu*, lời tự giải thích của con.

**Dùng thử trên web:** https://ngovietdinh.github.io/learnOnline/ (tự cập nhật mỗi khi `main` thay đổi).

Tài liệu thiết kế chi tiết: [docs/THIET-KE.md](docs/THIET-KE.md).

## Chạy thử

```bash
npm install
npm run dev        # mở http://localhost:5173
npm test           # kiểm thử: đồ thị tri thức, mô hình thành thạo, mọi câu hỏi sinh ra
npm run build      # xuất bản tĩnh vào dist/ (đưa lên hosting tĩnh bất kỳ)
```

Dữ liệu học tập lưu trên trình duyệt (localStorage), không gửi đi đâu.
