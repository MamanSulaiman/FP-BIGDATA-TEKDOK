document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const fileNameSpan = document.getElementById('fileName');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const uploadPredictBtn = document.getElementById('uploadPredictBtn');
    const predictionResult = document.getElementById('predictionResult');
    const getSkincareRecommendationBtn = document.getElementById('getSkincareRecommendationBtn');
    const skincareRecommendationDiv = document.getElementById('skincareRecommendation');
    const productRecommendationDiv = document.getElementById('productRecommendation');

    let currentPrediction = '';

    // Handler saat memilih gambar
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            fileNameSpan.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (previewImage) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                }
                if (previewPlaceholder) {
                    previewPlaceholder.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);

            predictionResult.textContent = 'Belum ada prediksi.';
            skincareRecommendationDiv.innerHTML = '';
            if (productRecommendationDiv) productRecommendationDiv.innerHTML = '';
            currentPrediction = '';
            getSkincareRecommendationBtn.disabled = true;
        } else {
            fileNameSpan.textContent = 'Tidak ada file terpilih';
            if (previewImage) {
                previewImage.src = '#';
                previewImage.style.display = 'none';
            }
            if (previewPlaceholder) {
                previewPlaceholder.style.display = 'block';
            }
            predictionResult.textContent = 'Belum ada prediksi.';
            skincareRecommendationDiv.innerHTML = '';
            if (productRecommendationDiv) productRecommendationDiv.innerHTML = '';
            currentPrediction = '';
            getSkincareRecommendationBtn.disabled = true;
        }
    });

    // Handler saat klik "Upload & Predict"
    uploadPredictBtn.addEventListener('click', async () => {
        const file = imageUpload.files[0];
        if (!file) {
            alert('Mohon pilih gambar untuk diunggah.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            predictionResult.textContent = 'Mengunggah dan memprediksi...';
            uploadPredictBtn.disabled = true;
            getSkincareRecommendationBtn.disabled = true;
            if (productRecommendationDiv) productRecommendationDiv.innerHTML = '';

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Gagal mendapatkan prediksi dari server.');
            }

            const data = await response.json();
            currentPrediction = data.disease;
            predictionResult.textContent = `Prediksi: ${currentPrediction} (Akurasi: ${data.confidence}%)`;
            getSkincareRecommendationBtn.disabled = false;

            // Tampilkan produk skincare yang direkomendasikan
            if (productRecommendationDiv) {
                console.log("Produk dari server:", data.products);
                if (data.products && data.products.length > 0) {
                    let html = '<b>Rekomendasi Produk Skincare:</b><ul>';
                    data.products.forEach(prod => {
                        html += `
                            <li>
                                <strong>${prod.title}</strong><br>
                                Harga: ${prod.price}<br>
                                Rating: ${prod.stars} ⭐ (${prod.vote} ulasan)
                            </li>`;
                    });
                    html += '</ul>';
                    productRecommendationDiv.innerHTML = html;
                } else {
                    productRecommendationDiv.innerHTML = '<i>Tidak ada produk rekomendasi untuk kategori ini.</i>';
                }
            }
        } catch (error) {
            console.error('Error during upload and prediction:', error);
            predictionResult.textContent = 'Terjadi kesalahan saat memprediksi. Silakan coba lagi.';
            currentPrediction = '';
            if (productRecommendationDiv) productRecommendationDiv.innerHTML = '';
        } finally {
            uploadPredictBtn.disabled = false;
        }
    });
    getSkincareRecommendationBtn.addEventListener('click', () => {
        skincareRecommendationDiv.innerHTML = '';

        if (!currentPrediction) {
            skincareRecommendationDiv.innerHTML = '<p>Silakan lakukan prediksi terlebih dahulu.</p>';
            return;
        }

        let recommendations = '';
        switch (currentPrediction.toLowerCase()) {
            case 'acne':
                recommendations = `
                    <p>Untuk <strong>Acne (Jerawat)</strong>:</p>
                    <ul>
                        <li>Gunakan skincare dengan <strong>Salicylic Acid</strong> atau <strong>Benzoyl Peroxide</strong>.</li>
                        <li><strong>Niacinamide</strong> untuk mengurangi peradangan.</li>
                        <li>Pilih produk <strong>non-comedogenic</strong>.</li>
                        <li>Pelembab ringan, pembersih wajah lembut.</li>
                    </ul>
                `;
                break;
            case 'actinic_keratosis':
                recommendations = `
                    <p>Untuk <strong>Actinic Keratosis</strong>:</p>
                    <ul>
                        <li>Konsultasikan ke dokter kulit untuk penanganan lebih lanjut.</li>
                        <li>Gunakan <strong>tabir surya SPF 30+</strong> setiap hari.</li>
                        <li>Hindari paparan sinar matahari langsung.</li>
                    </ul>
                `;
                break;
            case 'benign_tumors':
                recommendations = `
                    <p>Untuk <strong>Benign Tumors (Tumor Jinak)</strong>:</p>
                    <ul>
                        <li>Konsultasikan ke dokter kulit untuk diagnosis dan tindakan medis jika perlu.</li>
                        <li>Jaga kebersihan area kulit.</li>
                    </ul>
                `;
                break;
            case 'bullous':
                recommendations = `
                    <p>Untuk <strong>Bullous Disease</strong>:</p>
                    <ul>
                        <li>Segera konsultasi ke dokter kulit.</li>
                        <li>Jaga kebersihan kulit dan hindari gesekan pada area lepuh.</li>
                    </ul>
                `;
                break;
            case 'candidiasis':
                recommendations = `
                    <p>Untuk <strong>Candidiasis (Infeksi Jamur)</strong>:</p>
                    <ul>
                        <li>Gunakan obat antijamur sesuai anjuran dokter.</li>
                        <li>Jaga area tetap kering dan bersih.</li>
                    </ul>
                `;
                break;
            case 'drugeruption':
                recommendations = `
                    <p>Untuk <strong>Drug Eruption</strong>:</p>
                    <ul>
                        <li>Segera konsultasi ke dokter untuk menghentikan obat penyebab.</li>
                        <li>Gunakan pelembab yang menenangkan.</li>
                    </ul>
                `;
                break;
            case 'eczema':
                recommendations = `
                    <p>Untuk <strong>Eczema (Eksim)</strong>:</p>
                    <ul>
                        <li>Gunakan pelembab dengan <strong>ceramides</strong>, <strong>hyaluronic acid</strong>, atau <strong>glycerin</strong>.</li>
                        <li>Pilih produk bebas pewangi dan pewarna.</li>
                        <li>Gunakan krim/ointment setelah mandi.</li>
                    </ul>
                `;
                break;
            case 'infestations_bites':
                recommendations = `
                    <p>Untuk <strong>Infestations & Bites</strong>:</p>
                    <ul>
                        <li>Identifikasi penyebab dan konsultasi ke dokter.</li>
                        <li>Gunakan krim anti-gatal dan jaga kebersihan area.</li>
                    </ul>
                `;
                break;
            case 'lichen':
                recommendations = `
                    <p>Untuk <strong>Lichen</strong>:</p>
                    <ul>
                        <li>Konsultasikan ke dokter kulit untuk resep kortikosteroid topikal.</li>
                        <li>Gunakan pelembab yang menenangkan.</li>
                    </ul>
                `;
                break;
            case 'lupus':
                recommendations = `
                    <p>Untuk <strong>Lupus</strong>:</p>
                    <ul>
                        <li>Gunakan <strong>tabir surya SPF 50+</strong> setiap hari.</li>
                        <li>Hindari paparan sinar matahari langsung.</li>
                        <li>Konsultasi ke dokter spesialis.</li>
                    </ul>
                `;
                break;
            case 'moles':
                recommendations = `
                    <p>Untuk <strong>Moles (Tahi Lalat)</strong>:</p>
                    <ul>
                        <li>Perhatikan perubahan bentuk/warna/ukuran.</li>
                        <li>Konsultasi ke dokter kulit jika ada perubahan mencurigakan.</li>
                        <li>Gunakan tabir surya.</li>
                    </ul>
                `;
                break;
            case 'psoriasis':
                recommendations = `
                    <p>Untuk <strong>Psoriasis</strong>:</p>
                    <ul>
                        <li>Gunakan <strong>Coal Tar</strong> atau <strong>Salicylic Acid</strong>.</li>
                        <li>Pelembab kaya emolien.</li>
                        <li>Hindari pemicu seperti stres dan iritasi kulit.</li>
                    </ul>
                `;
                break;
            case 'rosacea':
                recommendations = `
                    <p>Untuk <strong>Rosacea</strong>:</p>
                    <ul>
                        <li>Gunakan <strong>Azelaic Acid</strong> dan <strong>Niacinamide</strong>.</li>
                        <li>Tabir surya mineral SPF tinggi.</li>
                        <li>Hindari pemicu seperti makanan pedas dan alkohol.</li>
                    </ul>
                `;
                break;
            case 'seborrh_keratoses':
                recommendations = `
                    <p>Untuk <strong>Seborrheic Keratoses</strong>:</p>
                    <ul>
                        <li>Biasanya tidak berbahaya, konsultasi ke dokter untuk konfirmasi.</li>
                        <li>Tidak ada skincare khusus, tindakan medis jika mengganggu.</li>
                    </ul>
                `;
                break;
            case 'skincancer':
                recommendations = `
                    <p>Untuk <strong>Skin Cancer (Kanker Kulit)</strong>:</p>
                    <ul>
                        <li>Segera konsultasi ke dokter kulit/onkologis.</li>
                        <li>Gunakan tabir surya SPF 30+ untuk pencegahan.</li>
                    </ul>
                `;
                break;
            case 'sun_sunlight_damage':
                recommendations = `
                    <p>Untuk <strong>Sun/Sunlight Damage</strong>:</p>
                    <ul>
                        <li>Gunakan tabir surya SPF 30+ setiap hari.</li>
                        <li>Gunakan antioksidan (Vitamin C, E).</li>
                        <li>Gunakan pakaian pelindung dan hindari paparan langsung.</li>
                    </ul>
                `;
                break;
            case 'tinea':
                recommendations = `
                    <p>Untuk <strong>Tinea (Kurap)</strong>:</p>
                    <ul>
                        <li>Gunakan obat antijamur topikal/oral sesuai anjuran dokter.</li>
                        <li>Jaga area tetap bersih dan kering.</li>
                    </ul>
                `;
                break;
            case 'unknown_normal':
            case 'healthy skin':
                recommendations = `
                    <p>Kulit Anda <strong>Normal/Tidak terdeteksi penyakit</strong>:</p>
                    <ul>
                        <li>Pertahankan rutinitas skincare dasar: pembersih, pelembab, tabir surya.</li>
                        <li>Gunakan produk sesuai tipe kulit.</li>
                    </ul>
                `;
                break;
            case 'vascular_tumors':
                recommendations = `
                    <p>Untuk <strong>Vascular Tumors</strong>:</p>
                    <ul>
                        <li>Konsultasi ke dokter kulit/spesialis vaskular.</li>
                        <li>Skincare tidak dapat mengobati tumor vaskular.</li>
                    </ul>
                `;
                break;
            case 'vasculitis':
                recommendations = `
                    <p>Untuk <strong>Vasculitis</strong>:</p>
                    <ul>
                        <li>Konsultasi ke dokter spesialis.</li>
                        <li>Gunakan skincare yang lembut dan non-iritasi.</li>
                    </ul>
                `;
                break;
            case 'vitiligo':
                recommendations = `
                    <p>Untuk <strong>Vitiligo</strong>:</p>
                    <ul>
                        <li>Konsultasi ke dokter kulit untuk pengobatan.</li>
                        <li>Gunakan tabir surya SPF 30+ pada area depigmentasi.</li>
                    </ul>
                `;
                break;
            case 'warts':
                recommendations = `
                    <p>Untuk <strong>Warts (Kutil)</strong>:</p>
                    <ul>
                        <li>Gunakan produk bebas (salicylic acid) atau konsultasi ke dokter kulit.</li>
                        <li>Hindari menyentuh kutil untuk mencegah penyebaran.</li>
                    </ul>
                `;
                break;
            default:
                recommendations = '<p>Maaf, belum ada rekomendasi skincare untuk kondisi kulit ini. Mohon konsultasikan dengan ahli dermatologi.</p>';
                break;
        }

        skincareRecommendationDiv.innerHTML = recommendations;
    });
});