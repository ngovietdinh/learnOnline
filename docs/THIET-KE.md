# Học Bản Chất — Tài liệu thiết kế

> Nền tảng học trực tuyến, **tập trung toàn bộ vào mầm non và tiểu học (1–11 tuổi)**: học mà chơi, giọng cô giáo đọc mọi lời, nhạc nền, hiệu ứng rực rỡ; kiến thức bám chuẩn; đủ cấp độ từ thấp đến cao; mỗi bài được thiết kế để **hiểu bản chất ngay trong lần học chính thức**. (Khung THCS – THPT vẫn giữ trong mã nhưng không hiện trên giao diện.)

## 0. Trọng tâm mầm non – tiểu học

| | Nội dung |
|---|---|
| Nội dung | 125 bài: mầm non 37 (Mầm 1–3 tuổi và Chồi 3–6 tuổi), lớp 1: 16, lớp 2: 15, lớp 3: 19, lớp 4: 20, lớp 5: 18 — Toán, Tiếng Việt, Khoa học / TN-XH, Tiếng Anh. Mỗi bài đủ các bước, mô phỏng tự tay thao tác, kho 12 câu hỏi cố định cho mỗi mức độ. |
| Học xen chơi | Bước 🎮 *Trò chơi* nằm giữa Luyện tập và Giảng lại: Bóng bay, Câu cá, Đập chuột chũi, Lật thẻ (cặp thẻ do từng bài khai báo). Trang chính có Góc trò chơi chọn chủ đề tự do. |
| Giọng cô giáo | Mọi lời cô nói được ghép từ các đoạn cố định (`src/core/script.ts`), nên liệt kê được hết (`scripts/thu-giong.ts`, ~10 nghìn câu) và thu sẵn bằng giọng thần kinh `vi-VN-HoaiMyNeural` (`scripts/tao-giong.py`): giọng *cô mầm non* chậm hơn 12%, cao và ấm hơn; giọng *cô tiểu học* tự nhiên. Ứng dụng tra tệp theo khoá `voiceKey(văn bản đọc, kiểu giọng, ngôn ngữ)`; thiếu tệp thì đọc bằng giọng của máy. |
| Nhạc nền | 3 bản tự sáng tác bằng WebAudio (trang chính / giờ học / giờ chơi), tự hạ âm lượng khi cô nói; phụ huynh tắt được. |
| Giao diện | Cô giáo hoạt hình (mấp máy môi theo giọng, biểu cảm vui / suy nghĩ / khen), bóng bay vẽ bằng CSS nhiều màu tươi, pháo hoa, mưa pháo giấy; bố cục câu hỏi – sân chơi song song trên màn hình rộng. |

---

## 1. Mục tiêu và nguyên tắc

| Yêu cầu | Cách hệ thống đáp ứng |
|---|---|
| UI/UX sống động | 5 bộ giao diện theo lứa tuổi; mỗi bài có mô phỏng tương tác thật (kéo, chạm, quay, ném, xếp hình); hiệu ứng, âm thanh, linh vật, giọng đọc. |
| Kiến thức theo chuẩn | Mỗi kỹ năng gắn mã chuẩn: Chương trình GDPT 2018, Chương trình GD mầm non; đối chiếu quốc tế CCSS (Toán), NGSS (Khoa học), CEFR (Tiếng Anh). |
| Đủ cấp độ thấp → cao | **Chiều dọc**: 5 giai đoạn (nhà trẻ → lớp 12) nối thành một đồ thị tri thức. **Chiều ngang**: mỗi kỹ năng có 4 mức Nhận biết → Thông hiểu → Vận dụng → Vận dụng cao. |
| Học một lần là hiểu bản chất | Vòng 6 bước "Hiểu bản chất" + khoá tiền đề + luyện đến khi vững + ngộ nhận được chỉ đích danh + tự giảng lại + ôn giãn cách. |

**Nói rõ về "học một lần là hiểu":** không phương pháp nào bảo đảm 100% cho mọi trẻ. Hệ thống làm điều có cơ sở khoa học: (1) không cho học bài mới khi nền chưa vững — nguyên nhân số một của "học mãi không hiểu"; (2) dạy cái gốc và lý do thay vì công thức; (3) chỉ kết thúc luyện tập khi người học đúng liên tiếp ở mức cao nhất; (4) sau đó chỉ cần vài phút ôn đúng lúc để giữ — không phải học lại.

---

## 2. Năm giai đoạn — giao diện lớn lên cùng người học

| | 🐣 Mầm | 🐥 Chồi | 🦊 Tiểu học | 🦉 THCS | 🚀 THPT |
|---|---|---|---|---|---|
| Tuổi | 1–3 | 3–6 | 6–11 (lớp 1–5) | 11–15 (lớp 6–9) | 15–18 (lớp 10–12) |
| Phong cách | Pastel, siêu tròn | Kẹo ngọt, rực rỡ | Phiêu lưu, nắng ấm | Hiện đại, tươi | Tối, tập trung, neon |
| Cỡ chữ gốc | 22px | 20px | 18px | 16px | 16px |
| Vùng chạm tối thiểu | 120px | 88px | 56px | 44px | 44px |
| Đọc to lời dẫn | Luôn | Luôn | Mặc định bật | Tuỳ chọn | Tuỳ chọn |
| Mức luyện tập tối đa | 1 | 2 | 3 | 4 | 4 |
| Chọn sai | Chỉ "thử lại", không bị trừ | Chỉ "thử lại" | Có phản hồi ngộ nhận | Có phản hồi ngộ nhận | Có phản hồi ngộ nhận |
| Giảng lại (Feynman) | — | — | Có | Có | Có |
| Phiên học khuyến nghị | ≤ 5 phút, có người lớn | ≤ 10 phút | ≤ 20 phút | 30 phút | 40 phút |
| Trang chính | Ô hình to, chạm là chơi | Ô hình to | Đường phiêu lưu | Lưới kỹ năng | Lưới kỹ năng |

**Nghe – nhìn:**
- *Lời đọc tiếng Việt* bật cho mọi lứa tuổi (phụ huynh tắt được). Hệ thống tự chọn giọng Việt tốt nhất trên máy, đọc chậm và cao giọng hơn cho bé nhỏ, đọc đúng ký hiệu toán – lý (`src/core/speech.ts`, có kiểm thử). Máy chưa có giọng Việt sẽ được hướng dẫn cài.
- *Âm thanh* tổng hợp bằng WebAudio: nhiều kiểu chuông "đúng rồi", tiếng sai hoạt hình nhẹ nhàng, "boing", "vút", lấp lánh, kèn chiến thắng, pháo hoa; nhạc nền hộp nhạc ngũ cung tự sinh, tự hạ nhỏ khi đang đọc lời (`src/core/sound.ts`).
- *Hiệu ứng động*: lớp hạt trên canvas (tia sao, tim, pháo giấy, pháo hoa, chữ "+10 ⭐" bay lên — `src/core/fx.ts`), băng rôn lên mức, cúp vàng, linh vật nhảy khi đúng/lắc đầu khi sai, nền chuyển động theo tuổi (`src/components/Effects.tsx`).

Cài đặt ở `src/core/stages.ts`; chủ đề màu ở `src/styles/app.css` (token đổi theo `data-stage` trên `<html>`). Tôn trọng `prefers-reduced-motion`.

---

## 3. Mô hình sư phạm "Hiểu bản chất" — 6 bước mỗi bài

| Bước | Làm gì | Cơ sở |
|---|---|---|
| ❓ **Tò mò** | Một câu hỏi/nghịch lý khiến người học *muốn* biết (VD: "1/8 lớn hơn 1/3 vì 8 > 3?"). | Kích hoạt kiến thức cũ, tạo "khoảng trống tò mò". |
| 🔍 **Khám phá** | Tự tay thao tác mô hình và *tự phát hiện* quy luật. Chỉ qua bước khi đã thao tác đủ. | Học qua khám phá có hướng dẫn; tiến trình Cụ thể → Hình ảnh → Trừu tượng (Bruner, CPA). |
| 💎 **Bản chất** | Một câu "cái gốc" + các ý VÌ SAO + một hình dung đời thường. | Hiểu khái niệm trước quy trình. |
| 🎯 **Luyện tập** | Leo 4 mức độ; mỗi đáp án sai gắn một **ngộ nhận cụ thể** và lời giải thích riêng. | Mastery learning (Bloom); phản hồi tức thì; thay đổi khái niệm. |
| 🗣️ **Giảng lại** | Chọn lời giải thích đúng trong lời của các "bạn" (có lời sai *nghe rất xuôi*), rồi tự viết lại bằng lời mình. | Tự giải thích (Chi), hiệu ứng Feynman / dạy lại. |
| 🧠 **Ghi nhớ** | Thẻ tóm tắt; hẹn ôn 1 → 3 → 7 → 16 → 35 → 90 ngày, câu hỏi xen kẽ nhiều bài. | Truy xuất (retrieval practice), lặp lại giãn cách, học xen kẽ. |

### Ví dụ bản chất của 10 bài hiện có

| Bài | Cấp | Mô phỏng | Bản chất |
|---|---|---|---|
| Màu sắc quanh em | 1–3 tuổi | Chạm quả cầu màu, nghe tên | Mỗi vật có một màu; cùng màu thì giống nhau. |
| Con vật và tiếng kêu | 1–3 tuổi | Chạm con vật, nghe tiếng kêu | Mỗi con vật có hình dáng và tiếng kêu riêng. |
| Đếm đến 10 | 3–6 tuổi | Chạm đếm, xáo trộn vị trí | Số cuối cùng = số lượng; xếp lại không đổi. |
| Cộng qua 10 | Lớp 2 | Khung 10 ô, chuyển chấm | Lấp đầy 10 trước, rồi cộng phần còn lại. |
| Phân số | Lớp 3–4 | Thanh chia phần, bức tường phân số | Các phần phải bằng nhau; mẫu lớn → phần nhỏ. |
| Ngày và đêm | Lớp 3 | Quay Trái Đất, "nếu ngừng quay?" | Trái Đất tự quay; nửa hướng Mặt Trời là ngày. |
| Phương trình bậc nhất | Lớp 8 | Cân thăng bằng; bớt một bên → cân lệch | "Chuyển vế đổi dấu" = bớt cùng lượng ở hai vế. |
| Định lí Pythagore | Lớp 8 | Hình vuông trên 3 cạnh, đổi góc; xếp lại 4 tam giác | Định lí về diện tích; chỉ đúng với góc vuông. |
| Hàm số bậc hai | Lớp 10 | Kéo a, b, c; bóng mờ y = ax² và mũi tên dời | Mọi parabol là y = ax² dời đỉnh. |
| Chuyển động ném | Lớp 10 | Ném xiên có bóng chiếu 2 trục; ném ngang vs rơi tự do | Hai chuyển động độc lập chung một đồng hồ. |

---

## 4. Chuẩn kiến thức và cấp độ

- **GDMN** — Chương trình Giáo dục mầm non (Bộ GD&ĐT).
- **GDPT2018** — Chương trình GDPT 2018 (Thông tư 32/2018/TT-BGDĐT): ghi theo *môn · lớp · mạch nội dung*.
- **CCSS** — Common Core (Toán, Đọc hiểu), ví dụ `1.OA.C.6`, `8.G.B.6`, `HSF-IF.C.7a`.
- **NGSS** — Khoa học, ví dụ `5-ESS1-2`, `HS-PS2-1`.
- **CEFR** — Tiếng Anh, Pre-A1 → B1.

**4 mức độ** khớp ma trận đề kiểm tra của Bộ (tiểu học 3 mức theo TT 27/2020; THCS–THPT 4 mức): Nhận biết · Thông hiểu · Vận dụng · Vận dụng cao. Mỗi bài có bộ sinh câu hỏi theo từng mức, tạo đề mới mỗi lần (không học vẹt đáp án).

---

## 5. Đồ thị tri thức

`src/core/curriculum.ts` định nghĩa 49 kỹ năng thuộc 5 môn, trải 5 giai đoạn, mỗi kỹ năng có: môn, giai đoạn, lớp, **câu bản chất**, mã chuẩn, **danh sách kỹ năng nền**. Ví dụ một nhánh:

```
Một và nhiều → Đếm đến 10 → Tách–gộp ─┐
                          Hàng chục ──┴→ Cộng qua 10 → Phép nhân → Phép chia → Phân số → Tỉ lệ → Hàm bậc nhất → y = ax² → Hàm bậc hai → Chuyển động ném
                                                         Diện tích → Pythagore → Vectơ ───────────────────────────────────────────┘
```

- Kỹ năng **bị khoá** khi kỹ năng nền (có bài trong hệ thống) chưa vững; màn hình kỹ năng chỉ đích danh cần học gì trước.
- Học sinh lớn vẫn có thể "Vẫn học bài này"; hoặc **"Em đã biết — kiểm tra nhanh"**: 3 câu đúng liên tiếp ở mức cao nhất thì được công nhận vững, không phải học lại điều đã biết.
- Kiểm thử tự động bảo đảm: không có vòng lặp, kỹ năng nền không nằm ở cấp cao hơn, mọi bài trỏ đúng kỹ năng.

---

## 6. Đánh giá và cá nhân hoá

- **Luyện tập leo thang** (`src/core/mastery.ts`): đúng liên tiếp 2 câu → lên mức; sai 2 câu liên tiếp → lùi một mức củng cố; "vững" khi đúng liên tiếp ở mức cao nhất của lứa tuổi; giới hạn số câu để tránh mệt (chưa vững thì hẹn ôn sớm).
- **Mức hiểu ước tính**: Bayesian Knowledge Tracing rút gọn (P(biết) cập nhật sau mỗi câu).
- **Ôn tập giãn cách**: hộp Leitner, khoảng 1–3–7–16–35–90 ngày; quên thì về hộp 1.
- **Ngộ nhận**: 66 mã ngộ nhận (VD "nghĩ mẫu số lớn thì phân số lớn", "nghĩ vận tốc ở đỉnh quỹ đạo bằng 0"). Báo cáo phụ huynh hiển thị *con hay nhầm ở đâu*, không chỉ "sai mấy câu".
- **Lời tự giải thích** của học sinh được lưu và hiển thị cho phụ huynh/giáo viên.

---

## 7. An toàn trẻ em và quyền riêng tư

- Không quảng cáo, không chat, không liên kết ra ngoài trong khu vực học.
- **Cổng phụ huynh** (một phép nhân) chặn trẻ nhỏ vào cài đặt/báo cáo.
- Bản hiện tại lưu dữ liệu **chỉ trên thiết bị** (localStorage), không gửi đi đâu. Khi có máy chủ: tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (dữ liệu trẻ em cần đồng ý của cha mẹ), tham chiếu COPPA/GDPR-K nếu ra quốc tế; tối thiểu hoá dữ liệu thu thập.
- Thời lượng khuyến nghị theo tuổi hiển thị cho phụ huynh; trẻ dưới 3 tuổi luôn cần người lớn ngồi cùng.

---

## 8. Kiến trúc kỹ thuật

- **Giao diện**: React 18 + TypeScript + Vite; trạng thái bằng Zustand (lưu localStorage). Không cần máy chủ — triển khai lên bất kỳ hosting tĩnh nào.
- **Đồ hoạ**: SVG + CSS animation (nhẹ, sắc nét mọi màn hình, chạy được trên máy yếu).
- **Âm thanh**: WebAudio tổng hợp (không cần tệp). **Giọng đọc**: tệp thu sẵn `voice/<khoá>.mp3` + `voice/manifest.json` (tạo trong GitHub Actions), dự phòng Web Speech API tiếng Việt.
- **Định tuyến**: hash (`#/hoc/phan-so`, `#/ky-nang/...`, `#/on-tap`, `#/chuong-trinh`, `#/phu-huynh`).

```
src/
  core/        stages · curriculum · mastery · progress · store · misconceptions · router · sound · speech · rng
  lessons/     types (khuôn bài 6 bước) · registry · 1 tệp mỗi bài (mô phỏng + bộ sinh câu hỏi)
  components/  QuestionView · ui (linh vật, vòng tiến độ, pháo giấy…)
  screens/     Profiles · Home · LessonPlayer · Review · CurriculumMap · SkillDetail · Parent
docs/          THIET-KE.md (tài liệu này)
```

### Thêm một bài mới

1. Tạo `src/lessons/<ten-bai>.tsx` xuất một `Lesson` (xem `src/lessons/types.ts`): `hook`, `explore.Component` (mô phỏng, gọi `onDiscover()` khi người học đã tự thấy quy luật), `essence`, `practice(level, rng)` sinh câu hỏi theo 4 mức với đáp án sai gắn `misconception` + `why`, `teachBack`, `remember`.
2. Thêm vào `src/lessons/registry.ts`, đặt `lessonId` cho kỹ năng trong `curriculum.ts`.
3. Thêm mã ngộ nhận mới vào `src/core/misconceptions.ts`.
4. `npm test` sẽ tự kiểm tra: mỗi câu sinh ra có đúng một đáp án, lựa chọn không trùng, ngộ nhận hợp lệ, liên kết kỹ năng đúng.

---

## 9. Lộ trình phát triển

| Giai đoạn | Nội dung |
|---|---|
| v0.1 | Khung đầy đủ: 5 giao diện tuổi, đồ thị 49 kỹ năng bám chuẩn, 10 bài tương tác đủ 6 bước trải đều 1–18 tuổi, luyện tập leo thang, ôn giãn cách, báo cáo phụ huynh. |
| **v0.2 (hiện tại)** | Tập trung mầm non – tiểu học: 125 bài Toán, Tiếng Việt, Khoa học, Tiếng Anh; trò chơi xen bài học; giọng cô giáo thu sẵn; nhạc nền. |
| v0.25 | Thu giọng người thật (cô giáo mầm non) cho các câu hay dùng nhất; thêm bài Lịch sử – Địa lí lớp 4–5, Đạo đức; tập viết chữ trên màn hình cảm ứng. |
| v0.3 | Ứng dụng cài được, chạy ngoại tuyến (PWA); tài khoản và đồng bộ nhiều thiết bị; lớp học cho giáo viên (giao bài, xem ngộ nhận cả lớp). |
| v0.4 | Trợ giảng AI chấm lời tự giải thích, hỏi "vì sao" theo kiểu Socrates; chẩn đoán đầu vào toàn đồ thị để xếp lộ trình cá nhân. |
| v1.0 | Phủ đủ chương trình GDPT 2018 lớp 1–12 các môn cốt lõi; công cụ soạn bài cho giáo viên theo khuôn 6 bước; kiểm định hiệu quả học tập (A/B, đo khả năng giữ kiến thức sau 30 ngày). |
