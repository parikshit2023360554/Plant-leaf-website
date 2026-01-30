import React from 'react';

const ResultsDisplay = ({ results, uploadedImage, uploadedFileName }) => {
  if (!results) return null;

  const getHealthStatusColor = (confidence) => {
    if (confidence > 90) return '#dc3545'; // Red for high disease confidence
    if (confidence > 70) return '#ffc107'; // Yellow for medium confidence
    return '#28a745'; // Green for low confidence (healthy)
  };

  const getHealthStatus = (disease, confidence) => {
    if (disease === 'Healthy' || confidence < 30) {
      return { status: 'Healthy', icon: '✅', message: 'Your plant appears to be healthy!' };
    } else if (confidence > 70) {
      return { status: 'Disease Detected', icon: '⚠️', message: 'Disease detected with high confidence' };
    } else {
      return { status: 'Possible Issue', icon: '⚡', message: 'Possible disease detected - monitor closely' };
    }
  };

  const healthInfo = getHealthStatus(results.disease, results.confidence);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>🔬 Analysis Results</h2>
      </div>

      <div className="results-content">
        <div className="image-result-pair">
          <div className="analyzed-image">
            <h3>Analyzed Image</h3>
            <img src={uploadedImage} alt="Analyzed plant leaf" />
          </div>

          <div className="detection-results">
            <div className="health-status" style={{ borderColor: getHealthStatusColor(results.confidence) }}>
              <div className="status-header">
                <span className="status-icon">{healthInfo.icon}</span>
                <h3>{healthInfo.status}</h3>
              </div>
              <p>{healthInfo.message}</p>
              {healthInfo.status === 'Healthy' && uploadedFileName && (
                <p className="filename-note">Healthy image name: {uploadedFileName}</p>
              )}
            </div>

            <div className="disease-info">
              <h4>Detection Details</h4>
              <div className="disease-item">
                <span className="disease-name">{results.disease}</span>
                <div className="confidence-bar">
                  <div 
                    className="confidence-fill" 
                    style={{ 
                      width: `${results.confidence}%`,
                      backgroundColor: getHealthStatusColor(results.confidence)
                    }}
                  ></div>
                </div>
                <span className="confidence-text">{results.confidence}% confidence</span>
              </div>
            </div>

            {results.disease !== 'Healthy' && results.confidence > 50 && (
              <div className="treatment-recommendations">
                <h4>💊 Treatment Recommendations</h4>
                <div className="recommendations-list">
                  {results.treatments.map((treatment, index) => (
                    <div key={index} className="treatment-item">
                      <span className="treatment-type">{treatment.type}:</span>
                      <p>{treatment.description}</p>
                      {treatment.urgency && (
                        <span className={`urgency-badge ${treatment.urgency.toLowerCase()}`}>
                          {treatment.urgency} Priority
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {results.additionalInfo && (
          <div className="additional-info">
            <h4>📋 Additional Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <strong>Plant Type:</strong> {results.additionalInfo.plantType || 'Unknown'}
              </div>
              <div className="info-item">
                <strong>Common Name:</strong> {results.additionalInfo.commonName || 'Not specified'}
              </div>
              <div className="info-item">
                <strong>Severity:</strong> {results.additionalInfo.severity || 'Not assessed'}
              </div>
              <div className="info-item">
                <strong>Prevention:</strong> {results.additionalInfo.prevention || 'General plant care'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="results-actions">
        <button className="btn-secondary">Save Results</button>
        <button className="btn-secondary">Share</button>
        <button className="btn-primary">Analyze Another Image</button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
