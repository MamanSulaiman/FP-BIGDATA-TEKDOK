import tensorflow as tf
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, render_template
import os
from werkzeug.utils import secure_filename
import csv

app = Flask(__name__, template_folder='templates', static_folder='static')

# Load model
MODEL_PATH = r'C:\Users\maman\Downloads\skin-disease-api 4\skin-disease-api\app\model_lenet.h5'
model = tf.keras.models.load_model(MODEL_PATH)

# Kelas target
class_names = [
    'Acne', 'Actinic_Keratosis', 'Benign_tumors', 'Bullous', 'Candidiasis',
    'DrugEruption', 'Eczema', 'Infestations_Bites', 'Lichen', 'Lupus',
    'Moles', 'Psoriasis', 'Rosacea', 'Seborrh_Keratoses', 'SkinCancer',
    'Sun_Sunlight_Damage', 'Tinea', 'Unknown_Normal', 'Vascular_Tumors',
    'Vasculitis', 'Vitiligo', 'Warts'
]

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_skin_care_recommendations(disease):
    return f"Rekomendasi skincare untuk {disease}."

def get_products_for_disease(disease):
    products = []
    try:
        # Gunakan path absolut ke file CSV
        csv_path = os.path.join(os.path.dirname(__file__), 'skincare_multilabel.csv')
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                kategori_str = row.get('kategori_penyakit', '')
                kategori_list = [k.strip().lower().replace(' ', '_') for k in kategori_str.split(';')]
                if disease.lower() in kategori_list:
                    products.append({
                        "title": row.get('title', 'Produk'),
                        "price": row.get('price', 'Rp -'),
                        "stars": row.get('stars', '0'),
                        "vote": row.get('vote', '0')
                    })
    except Exception as e:
        print(f"[ERROR] Gagal membaca file skincare_multilabel.csv di path: {csv_path}")
        print("[ERROR DETAIL]", e)

    return products

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        img = Image.open(filepath).convert('RGB')
        img = img.resize((256, 256))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)

        preds = model.predict(img_array)
        pred_idx = np.argmax(preds[0])
        disease = class_names[pred_idx]
        confidence = float(np.max(preds[0]) * 100)

        print("Prediksi Probabilitas:", preds[0])
        print("Prediksi Index:", pred_idx)
        print("Prediksi Label:", disease)

        products = get_products_for_disease(disease)

        result = {
            "image_url": filepath,
            "disease": disease,
            "confidence": round(confidence, 2),
            "recommendations": get_skin_care_recommendations(disease),
            "products": products
        }

        return jsonify(result)

    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(debug=True)
