// src/components/OCR/OCRUpload.jsx
import React, { useState } from 'react';
import './OCRUpload.css';

const OCRUpload = ({ onDataExtracted, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    setIsProcessing(true);

    // Demo mode - simulate OCR processing
    setTimeout(() => {
      // Convert image to base64 for storage
      const reader2 = new FileReader();
      reader2.onload = () => {
        const mockData = {
          amount: '50000', // Will be formatted as 50.000
          category: 'Food & Dining',
          date: new Date(),
          notes: 'Demo receipt scan',
          currency: 'IDR',
          type: 'expense',
          receiptImage: reader2.result
        };
        
        onDataExtracted(Promise.resolve(mockData));
        setIsProcessing(false);
      };
      reader2.readAsDataURL(file);
    }, 2000);
  };

  return (
    <div className="ocr-upload">
      <div className="demo-warning">
        <p>⚠️ <strong>Demo Mode:</strong> This feature will return sample data. Real OCR implementation requires Tesseract.js integration.</p>
      </div>
      
      <div className="upload-section">
        <h3>Scan Receipt</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isProcessing}
          className="file-input"
        />
        
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="Receipt preview" />
          </div>
        )}
        
        {isProcessing && (
          <div className="processing-status">
            <div className="spinner"></div>
            <p>Processing receipt... (Demo Mode)</p>
          </div>
        )}
      </div>
      
      <div className="upload-actions">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OCRUpload;