# 🌱 Học Bản Chất

Nền tảng **học mà chơi** cho bé **mầm non và tiểu học (1–11 tuổi)** — học một lần, hiểu tận gốc. 100% tiếng Việt, có giọng cô giáo đọc mọi lời dẫn.

- **125 bài soạn đầy đủ**, bám Chương trình GD mầm non và Chương trình GDPT 2018:
  - **Mầm non (37 bài)**: Toán làm quen (đếm, so sánh, tách – gộp, hình, vị trí, quy luật), làm quen chữ cái, khám phá (màu sắc, con vật, rau quả, xe cộ, cơ thể, gia đình, cảm xúc, thời tiết, an toàn…), tiếng Anh làm quen.
  - **Lớp 1–5 (88 bài)**: Toán (số, bốn phép tính, phân số, số thập phân, hình học, đo lường, tiền, thời gian, thống kê, tỉ số phần trăm, vận tốc), Tiếng Việt (thanh điệu, ghép vần, chính tả, từ loại, câu, dấu câu, so sánh, nhân hoá, trạng ngữ, đại từ, kết từ, từ nhiều nghĩa, đồng nghĩa – trái nghĩa, đọc hiểu), Khoa học / Tự nhiên và Xã hội, Tiếng Anh lớp 3–5.
- **Trò chơi xen giữa bài học**: mỗi bài có bước 🎮 Trò chơi ngay sau Luyện tập — Bóng bay, Câu cá, Đập chuột chũi, Lật thẻ — dùng đúng kiến thức vừa học; có Góc trò chơi riêng ở trang chính.
- **Giọng cô giáo thật**: mọi câu cô nói đều được liệt kê sẵn và thu bằng giọng thần kinh tiếng Việt (giọng nữ miền Bắc), có hai chất giọng — *cô mầm non* (chậm, ấm, ngọt) và *cô tiểu học* (rõ ràng, tự nhiên); từ tiếng Anh do giọng bản ngữ đọc. Câu nào chưa có tệp thu sẵn thì dùng giọng tiếng Việt của máy.
- **Nhạc nền** tự sáng tác (3 bản: trang chính, giờ học, giờ chơi), tự nhỏ lại khi cô đang nói; âm thanh vui nhộn cho mỗi lần chạm, đúng, sai, lên mức.
- **31 bạn thú bông tự vẽ** (mèo, chó, thỏ, gấu, gấu trúc, hổ, sư tử, cáo, heo, bò, dê, cừu, ngựa, kỳ lân, voi, khỉ, chuột, gà, vịt, chim, vẹt, cú, cánh cụt, ếch, cá, cá voi, cá heo, bạch tuộc…): lông mịn, mắt to long lanh, má hồng, đường may; biết thở, chớp mắt, vẫy tai, nhún khi chạm — thay biểu tượng con vật ở khắp ứng dụng (`src/components/Critter.tsx`).
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

Dữ liệu học tập lưu trên trình duyệt (localStorage), không gửi đi đâu.
