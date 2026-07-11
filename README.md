# Tarteel — Quran Memorization & Recitation

A feature-rich, open-source Quran companion web app inspired by [Tarteel.io](https://tarteel.io). Built with vanilla HTML, CSS and JavaScript.

## 🌐 Live Demo
**[https://mfmqazi.github.io/quran-tarteel](https://mfmqazi.github.io/quran-tarteel)**

## ✨ Features

| Feature | Details |
|---|---|
| 📖 **All 114 Surahs** | Fetched live from alquran.cloud API |
| 🎙 **Voice Search** | "Shazam for Quran" — recite any verse to find it |
| 🧠 **Memorize Mode** | Blur text and reveal verse by verse |
| 🎧 **Listen Mode** | Auto-play through the Surah |
| 🔊 **6 Reciters** | Alafasy, Abdul Basit, Husary, Minshawy, Al-Tablaway, Maher Al-Muaiqly |
| 📚 **5 Translations** | Sahih Intl, M. Asad, Pickthall, Yusuf Ali, Urdu (Jalandhry) |
| 🌍 **Juz Navigation** | 30 coloured Juz cards for quick navigation |
| 📄 **Page Navigation** | Jump to any of the 604 Quran pages |
| 🔖 **Bookmarks** | Persistent via localStorage |
| 📝 **Notes** | Per-verse notes, persistent |
| 🔁 **Loop / Repeat** | Loop current verse 1–∞ times |
| ⚡ **Playback Speed** | 0.5× to 2× |
| 🔥 **Streak Tracking** | Daily streak & goal progress |
| 🔍 **Verse Search** | Arabic and English text search |
| 📤 **Share / Copy** | Copy any verse with translation |
| 🎨 **Tajweed Colors** | Color-coded tajweed rules |
| 🔤 **Amiri Font** | Beautiful Quranic Arabic calligraphy |

## 🛠 Tech Stack
- **HTML / CSS / JavaScript** — zero frameworks, zero build step
- **alquran.cloud API** — Quran text & translations
- **everyayah.com** — Audio recitations
- **Web Speech API** — Voice search (Chrome)
- **Google Fonts** — Inter + Amiri

## 📂 Source Repositories
This project draws inspiration and reference code from:
- [tarteel-frontend](https://github.com/Khalifa1997/tarteel-frontend)
- [open-tarteel](https://github.com/adelpro/open-tarteel)
- [quranic-universal-library](https://github.com/TarteelAI/quranic-universal-library)

## ⌨️ Keyboard Shortcuts
| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `→` | Next verse |
| `←` | Previous verse |
| `L` | Toggle loop |
| `M` | Memorize mode |

## 🚀 Run Locally
```bash
python -m http.server 8000
# Open http://localhost:8000
```

## 📄 License
MIT — Made with ❤️ for the Ummah
