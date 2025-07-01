# 🧠 SkinVisionAI
### Smart Skin Disease Classification & Skincare Recommendation System

Dataset 📁
Skincare
"https://www.kaggle.com/datasets/najwaalsaadi/skin-care" 

Skin Disease
"https://www.kaggle.com/datasets/pacificrm/skind"

DEMO 📷
"https://www.youtube.com/watch?v=32inSjRqEjw"

---

## 📌 Deskripsi Singkat

*SkinVisionAI* adalah sistem cerdas berbasis deep learning dan big data yang dirancang untuk:
- Mengidentifikasi penyakit kulit dari gambar (foto wajah/kulit).
- Memberikan rekomendasi produk skincare berdasarkan jenis penyakit dan kandungan bahan aktif produk.

Sistem ini menggabungkan data terstruktur (CSV) dan tidak terstruktur (gambar JPEG/PNG), serta memanfaatkan teknologi pemrosesan gambar, machine learning, dan analisis ingredients untuk hasil yang personal dan tepat guna.

---

## ✨ Fitur Utama

- 🔍 Klasifikasi penyakit kulit secara otomatis dari gambar.
- 🧴 Rekomendasi skincare berdasarkan diagnosis dan kandungan produk.
- 📂 Mendukung input gambar dari pengguna (tidak terbatas pada dataset).
- 🧠 Menggunakan CNN (TensorFlow/Keras) untuk prediksi berbasis citra.
- 📊 Memetakan jenis penyakit ke skincare yang sesuai.

---

## 🧠 Analisis 5V Big Data

| Aspek      | Penjelasan                                                                 |
|------------|-----------------------------------------------------------------------------|
| *Volume* | Data sebesar 1.5 GB (gambar penyakit kulit 1.4 GB, data skincare 213 KB).  |
| *Velocity* | Pemrosesan batch menggunakan python dan lenet model deep learning.            |
| *Variety* | Data terstruktur (CSV) dan tidak terstruktur (JPEG, PNG).                 |
| *Veracity* | Keakuratan klasifikasi penting untuk validitas rekomendasi skincare.     |
| *Value*   | Memberikan nilai nyata berupa saran skincare berbasis kondisi kulit.      |

---
## ⚙ Teknologi yang Digunakan

| Kategori            | Teknologi                  |
|---------------------|----------------------------|
| Bahasa Pemrograman  | Python                     |
| Big Data Processing | Machine Learning (Lenet model)     |
| Image Processing    | PIL, NumPy                 |
| Machine Learning    | TensorFlow, Keras          |
| Data Analysis       | Pandas                     |
| Visualisasi Opsional| Matplotlib, Seaborn        |

---
## 🏗 Arsitektur Proyek
```plaintext
FP-BIGDATA-TEKDOK/
├── skin-disease-api/
│   ├── DATASET_SKIN/                         # Dataset gambar penyakit kulit (JPEG/PNG)
│   ├── app/                                  # Komponen inti aplikasi Flask
│   │   ├── _pycache_/                        # Cache Python otomatis
│   │   ├── static/                           # Aset statis untuk frontend
│   │   │   ├── css/
│   │   │   │   └── style.css                 # Styling halaman HTML
│   │   │   └── js/
│   │   │       └── script.js                 # Interaktivitas frontend
│   │   ├── templates/                        # Template HTML
│   │   │   ├── index.html                    # Halaman utama (upload gambar)
│   │   │   ├── result.html                   # Hasil prediksi & rekomendasi
│   │   │   └── error.html                    # Halaman error
│   │   ├── uploads/                          # Gambar yang diunggah user
│   │   ├── main.py                           # Routing & logika utama Flask
│   │   └── skincare_multilabel.csv           # Dataset structured untuk rekomendasi skincare
│   ├── requirements.txt                      # Dependencies Python
│   └── README.nd                             # Dokumentasi internal proyek
├── uploads/                                  # Folder upload global (opsional)
└── README.md                                 # Dokumentasi utama proyek



