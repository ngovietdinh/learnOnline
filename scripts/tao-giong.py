"""Tạo giọng cô giáo thật cho mọi câu trong scripts/out/loi-co.json (do thu-giong.ts liệt kê).

Dùng giọng thần kinh tiếng Việt vi-VN-HoaiMyNeural qua thư viện edge-tts (dịch vụ đọc của Microsoft Edge).
- Giọng "be" (mầm non): chậm hơn, cao và ấm hơn — như cô giáo mầm non.
- Giọng "hs" (tiểu học): tự nhiên, rõ ràng.
- Câu tiếng Anh: giọng bản ngữ, đọc chậm.

Chạy: python scripts/tao-giong.py scripts/out/loi-co.json .voice-cache dist/voice [--phut 40]
Tệp đã tạo được giữ trong thư mục cache → lần sau chỉ tạo câu mới. Hết giờ thì dừng, phần còn lại
dùng giọng của máy và sẽ được tạo ở lần build sau.
"""

import argparse
import asyncio
import json
import os
import shutil
import sys
import time

VOICES = {
    ("vi", "be"): dict(voice="vi-VN-HoaiMyNeural", rate="-12%", pitch="+12Hz"),
    ("vi", "hs"): dict(voice="vi-VN-HoaiMyNeural", rate="-4%", pitch="+4Hz"),
    ("en", "be"): dict(voice="en-US-AnaNeural", rate="-15%", pitch="+0Hz"),
    ("en", "hs"): dict(voice="en-US-JennyNeural", rate="-12%", pitch="+0Hz"),
}


async def make(line, path, sem, stats, deadline):
    import edge_tts

    async with sem:
        if time.monotonic() > deadline:
            stats["skip"] += 1
            return
        v = VOICES[(line["lang"], line["style"])]
        tmp = path + ".part"
        for attempt in range(4):
            try:
                await edge_tts.Communicate(line["text"], v["voice"], rate=v["rate"], pitch=v["pitch"]).save(tmp)
                if os.path.getsize(tmp) > 200:
                    os.replace(tmp, path)
                    stats["ok"] += 1
                    return
            except Exception as e:  # mạng chập chờn / bị giới hạn → chờ rồi thử lại
                stats["last_error"] = repr(e)
            await asyncio.sleep(2 * (attempt + 1))
        stats["fail"] += 1
        if os.path.exists(tmp):
            os.remove(tmp)


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lines")
    ap.add_argument("cache")
    ap.add_argument("out")
    ap.add_argument("--phut", type=float, default=40, help="thời gian tối đa (phút)")
    ap.add_argument("--song-song", type=int, default=8)
    ap.add_argument("--khong-tao", action="store_true", help="chỉ dùng tệp có sẵn trong cache")
    a = ap.parse_args()

    with open(a.lines, encoding="utf-8") as f:
        lines = json.load(f)
    os.makedirs(a.cache, exist_ok=True)
    todo = [l for l in lines if not os.path.exists(os.path.join(a.cache, l["key"] + ".mp3"))]
    print(f"{len(lines)} câu, đã có {len(lines) - len(todo)}, cần tạo {len(todo)}")

    stats = {"ok": 0, "fail": 0, "skip": 0, "last_error": ""}
    if todo and not a.khong_tao:
        deadline = time.monotonic() + a.phut * 60
        sem = asyncio.Semaphore(a.song_song)
        await asyncio.gather(*(make(l, os.path.join(a.cache, l["key"] + ".mp3"), sem, stats, deadline) for l in todo))
        print(f"tạo mới {stats['ok']}, lỗi {stats['fail']}, để lần sau {stats['skip']}")
        if stats["last_error"]:
            print("lỗi gần nhất:", stats["last_error"])

    os.makedirs(a.out, exist_ok=True)
    keys = []
    for l in lines:
        src = os.path.join(a.cache, l["key"] + ".mp3")
        if os.path.exists(src):
            shutil.copyfile(src, os.path.join(a.out, l["key"] + ".mp3"))
            keys.append(l["key"])
    with open(os.path.join(a.out, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(keys, f)
    print(f"đã đưa {len(keys)}/{len(lines)} câu có giọng thật vào {a.out}")
    # Thất bại toàn bộ (VD: mạng bị chặn) không làm hỏng việc đăng trang — ứng dụng tự dùng giọng của máy.
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
