import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import ResultsDisplay from './ResultsDisplay';
import { detectPlantDisease } from '../services/diseaseDetection';
import { useAuth } from '../contexts/AuthContext';

const DetectionPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const { addAnalysisToHistory, isAuthenticated } = useAuth();

  const handleImageUpload = async (file, imageDataUrl, shouldAnalyze = false) => {
    setUploadedImage(imageDataUrl);
    if (file && file.name) {
      setUploadedFileName(file.name);
    }
    
    if (shouldAnalyze || file) {
      setIsAnalyzing(true);
      setResults(null);
      
      try {
        const detectionResults = await detectPlantDisease(file);
        setResults(detectionResults);
        
        // Save to history if user is logged in
        if (isAuthenticated && detectionResults) {
          addAnalysisToHistory(detectionResults, imageDataUrl);
        }
      } catch (error) {
        console.error('Error detecting plant disease:', error);
        // Handle error appropriately in a real app
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setUploadedImage(null);
    setUploadedFileName(null);
    setIsAnalyzing(false);
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-content">
          <h2>Detect Plant Diseases Instantly</h2>
          <p>Upload a photo of your plant's leaf and get instant AI-powered disease detection with treatment recommendations.</p>
        </div>
      </div>

      <div className="detection-section">
        {!results ? (
          <ImageUpload 
            onImageUpload={handleImageUpload} 
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div>
            <ResultsDisplay 
              results={results} 
              uploadedImage={uploadedImage}
              uploadedFileName={uploadedFileName}
            />
            <div className="reset-section">
              <button 
                className="btn-primary reset-btn" 
                onClick={resetAnalysis}
              >
                Analyze New Image
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🔬</div>
            <h3>AI-Powered Detection</h3>
            <p>Advanced machine learning algorithms trained on thousands of plant disease images</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Instant Results</h3>
            <p>Get disease detection results in seconds with confidence scores</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💊</div>
            <h3>Treatment Recommendations</h3>
            <p>Receive personalized treatment and prevention recommendations</p>
    
          </div>
        </div>
      </div>
    </>
  );
};

export default DetectionPage;
