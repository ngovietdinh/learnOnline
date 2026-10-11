# 🌱 Học Bản Chất

Nền tảng **học mà chơi** cho bé **mầm non và tiểu học (1–11 tuổi)** — học một lần, hiểu tận gốc. 100% tiếng Việt, có giọng cô giáo đọc mọi lời dẫn.

- **125 bài soạn đầy đủ**, bám Chương trình GD mầm non và Chương trình GDPT 2018:
  - **Mầm non (37 bài)**: Toán làm quen (đếm, so sánh, tách – gộp, hình, vị trí, quy luật), làm quen chữ cái, khám phá (màu sắc, con vật, rau quả, xe cộ, cơ thể, gia đình, cảm xúc, thời tiết, an toàn…), tiếng Anh làm quen.
  - **Lớp 1–5 (88 bài)**: Toán (số, bốn phép tính, phân số, số thập phân, hình học, đo lường, tiền, thời gian, thống kê, tỉ số phần trăm, vận tốc), Tiếng Việt (thanh điệu, ghép vần, chính tả, từ loại, câu, dấu câu, so sánh, nhân hoá, trạng ngữ, đại từ, kết từ, từ nhiều nghĩa, đồng nghĩa – trái nghĩa, đọc hiểu), Khoa học / Tự nhiên và Xã hội, Tiếng Anh lớp 3–5.
- **Trò chơi xen giữa bài học**: mỗi bài có bước 🎮 Trò chơi ngay sau Luyện tập — Bóng bay, Câu cá, Đập chuột chũi, Lật thẻ — dùng đúng kiến thức vừa học; có Góc trò chơi riêng ở trang chính.
- **Giọng cô giáo thật**: mọi câu cô nói đều được liệt kê sẵn và thu bằng giọng thần kinh tiếng Việt (giọng nữ miền Bắc), có hai chất giọng — *cô mầm non* (chậm, ấm, ngọt) và *cô tiểu học* (rõ ràng, tự nhiên); từ tiếng Anh do giọng bản ngữ đọc. Câu nào chưa có tệp thu sẵn thì dùng giọng tiếng Việt của máy.
- **Nhạc nền** tự sáng tác (3 bản: trang chính, giờ học, giờ chơi), tự nhỏ lại khi cô đang nói; âm thanh vui nhộn cho mỗi lần chạm, đúng, sai, lên mức.
- **Bộ thú bông "lông ngắn – mặt kem"**: 30 con vật (mèo, chó, thỏ, gấu, gấu trúc, cáo, ếch, vịt, cánh cụt, voi, sư tử, hổ, khỉ, gấu túi, heo, bò, cừu, hamster, cú, gà con, bạch tuộc, cá voi, nai, gấu mèo, nhím, rùa, hải cẩu, dơi, sóc, hươu cao cổ) cùng một phong cách: thân tròn lông màu phấn, tấm mặt kem, mắt đen bóng, má hồng; thay mọi biểu tượng con vật trong bài học, trò chơi, ảnh đại diện; biết thở, chớp mắt, nhún khi chạm. Vài con chưa có trong bộ (chuột, ngựa, dê, cá, chim…) dùng bản 3D tự dựng ở `scripts/thu-bong`.
- **4 bạn đồng hành** Hồng, Bạc Hà, Mây, Kem (lông ngắn màu phấn, tấm mặt kem, mắt đen bóng, má hồng): cả nhóm chào ở trang mở đầu, bạn bé chọn vẫy tay ở trang chính, Hồng giơ tay mừng khi bé vững bài; tự chớp mắt. Ảnh xử lý bằng `scripts/ban-dong-hanh/xu-ly.py` (tách nền, tách ảnh nhóm, tạo khung mắt nhắm).
- **Hiệu ứng rực rỡ**: pháo hoa, mưa pháo giấy, tia sao, cô giáo hoạt hình biết mấp máy môi và biểu cảm, nền chuyển động theo lứa tuổi; tôn trọng chế độ "giảm chuyển động".
- **Vòng "Hiểu bản chất" 7 bước**: Tò mò → Khám phá (tự tay thao tác) → Bản chất → Luyện tập đến khi vững → Trò chơi → Giảng lại → Ghi nhớ + ôn giãn cách. Bé mầm non không bao giờ bị "sai", chỉ có "thử lại nhé".
- **Báo cáo phụ huynh/giáo viên**: mức hiểu từng bài, lịch ôn, *con hay nhầm ở đâu*.

**Dùng thử trên web:** https://ngovietdinh.github.io/learnOnline/ (tự cập nhật mỗi khi `main` thay đổi).

Tài liệu thiết kế chi tiết: [docs/THIET-KE.md](docs/THIET-KE.md).

## Chạy thử

```bash
npm install
npm run dev        # mở http://localhost:5173
npm test           # kiểm thử: đồ thị tri thức, mô hình thành thạo, mọi câu hỏi của mọi bài
npm run build      # xuất bản tĩnh vào dist/ (đưa lên hosting tĩnh bất kỳ)
```

### Tạo giọng cô giáo

```bash
npx vite-node scripts/thu-giong.ts       # liệt kê mọi câu cô nói → scripts/out/loi-co.json (~10 nghìn câu)
pip install edge-tts
python scripts/tao-giong.py scripts/out/loi-co.json .voice-cache dist/voice
```

Quy trình GitHub Actions (`.github/workflows/pages.yml`) làm việc này tự động mỗi lần đăng trang, chỉ tạo câu mới (phần đã có giữ trong cache). Giọng do dịch vụ đọc của Microsoft Edge cung cấp (không chính thức); muốn dùng dịch vụ có hợp đồng (Azure Speech, FPT.AI, Viettel AI…) chỉ cần thay hàm tạo giọng trong `scripts/tao-giong.py` — khoá tệp không đổi.

### Dựng lại thú bông 3D

```bash
npx vite scripts/thu-bong --port 5300   # xưởng: mở /?kind=gau&bg=%23fff để xem từng bạn
node scripts/thu-bong/chup.mjs all       # chụp tất cả → public/thu-bong/*.webp (cần playwright-core + Chromium)
```

Dữ liệu học tập lưu trên trình duyệt (localStorage), không gửi đi đâu.
