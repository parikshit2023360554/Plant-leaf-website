import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImageUpload, isAnalyzing }) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setUploadedImage(imageDataUrl);
        onImageUpload(file, imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  });

  const handleAnalyze = () => {
    if (uploadedImage && !isAnalyzing) {
      onImageUpload(null, uploadedImage, true);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="image-upload-container">
      <div className="upload-section">
        {!uploadedImage ? (
          <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <h3>Upload Plant Leaf Image</h3>
              <p>
                {isDragActive
                  ? 'Drop the image here...'
                  : 'Drag & drop an image here, or click to select'}
              </p>
              <div className="file-types">
                <span>Supports: PNG, JPG, JPEG, GIF</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="image-preview">
            <img src={uploadedImage} alt="Uploaded plant leaf" />
            <div className="image-actions">
              <button 
                onClick={handleAnalyze} 
                className="analyze-btn"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze for Diseases'
                )}
              </button>
              <button onClick={clearImage} className="clear-btn">
                Upload New Image
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="upload-tips">
        <h4>📸 Tips for Better Results:</h4>
        <ul>
          <li>Use clear, well-lit images</li>
          <li>Focus on the affected leaf areas</li>
          <li>Avoid blurry or dark images</li>
          <li>Include the whole leaf when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
