import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AnalysisHistory = () => {
  const { analysisHistory, deleteAnalysisFromHistory, clearAnalysisHistory, user } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterDisease, setFilterDisease] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isExporting, setIsExporting] = useState(false);


  const uniqueDiseases = useMemo(() => {
    const diseases = [...new Set(analysisHistory.map(entry => entry.result.disease))];
    return diseases.sort();
  }, [analysisHistory]);


  const filteredAndSortedHistory = useMemo(() => {
    let filtered = analysisHistory;


    if (filterDisease !== 'all') {
      filtered = filtered.filter(entry => entry.result.disease === filterDisease);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.result.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }


    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      case 'disease':
        return filtered.sort((a, b) => a.result.disease.localeCompare(b.result.disease));
      case 'confidence':
        return filtered.sort((a, b) => b.result.confidence - a.result.confidence);
      default:
        return filtered;
    }
  }, [analysisHistory, filterDisease, sortBy, searchTerm]);

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      setIsDeleting(entryId);
      // Add a small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      deleteAnalysisFromHistory(entryId);
      if (selectedEntry && selectedEntry.id === entryId) {
        setSelectedEntry(null);
      }
      setIsDeleting(null);
    }
  };

  const handleClearHistory = () => {
    if (showClearConfirm) {
      clearAnalysisHistory();
      setSelectedEntry(null);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#6b7280';
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes('high')) return '#ef4444';
    if (lowerSeverity.includes('medium') || lowerSeverity.includes('moderate')) return '#f59e0b';
    if (lowerSeverity.includes('low') || lowerSeverity === 'none') return '#10b981';
    return '#6b7280';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#10b981';
    if (confidence >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const analysisTime = new Date(timestamp);
    const diffInHours = (now - analysisTime) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return analysisTime.toLocaleDateString();
  };

  const exportHistoryData = async () => {
    setIsExporting(true);
    // Add a small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const dataStr = JSON.stringify(analysisHistory, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plant-analysis-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  if (!user) {
    return (
      <div className="analysis-history">
        <div className="history-empty">
          <h2>Analysis History</h2>
          <p>Please log in to view your analysis history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-history">
      <div className="history-header">
        <div className="header-content">
          <h1>📊 Analysis History</h1>
          <p>View and manage your plant disease detection history</p>
        </div>
        
        <div className="history-stats">
          <div className="stat-card">
            <span className="stat-number">{analysisHistory.length}</span>
            <span className="stat-label">Total Analyses</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {analysisHistory.filter(entry => entry.result.disease === 'Healthy').length}
            </span>
            <span className="stat-label">Healthy Plants</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {analysisHistory.filter(entry => entry.result.disease !== 'Healthy').length}
            </span>
            <span className="stat-label">Issues Detected</span>
          </div>
        </div>
      </div>

      {analysisHistory.length === 0 ? (
        <div className="history-empty">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No Analysis History Yet</h3>
            <p>Start analyzing plant images to build your personalized history and track your plant health journey</p>
            <a href="/" className="btn-primary">
              🌱 Analyze Your First Plant
            </a>
          </div>
        </div>
      ) : (
        <div className="history-content">
          <div className="history-controls">
            <div className="controls-row">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search by disease name or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <select
                  value={filterDisease}
                  onChange={(e) => setFilterDisease(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">🏷️ All Diseases</option>
                  {uniqueDiseases.map(disease => (
                    <option key={disease} value={disease}>{disease}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">📅 Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                  <option value="disease">🔤 By Disease</option>
                  <option value="confidence">📊 By Confidence</option>
                </select>
              </div>

              <div className="action-controls">
                {analysisHistory.length > 0 && (
                  <button
                    className="btn-secondary"
                    onClick={exportHistoryData}
                    disabled={isExporting}
                    title="Export analysis history as JSON"
                  >
                    {isExporting ? (
                      <>
                        <span className="spinner"></span>
                        Exporting...
                      </>
                    ) : (
                      <>💾 Export Data</>
                    )}
                  </button>
                )}
                <button
                  className={`clear-btn ${showClearConfirm ? 'confirm' : ''}`}
                  onClick={handleClearHistory}
                  onBlur={() => setShowClearConfirm(false)}
                  title={showClearConfirm ? 'Click to confirm deletion' : 'Clear all analysis history'}
                >
                  {showClearConfirm ? '⚠️ Confirm Clear All' : '🗑️ Clear History'}
                </button>
              </div>
            </div>

            <div className="results-info">
              📊 Showing <strong>{filteredAndSortedHistory.length}</strong> of <strong>{analysisHistory.length}</strong> analyses
            </div>
          </div>

          <div className={`history-layout ${selectedEntry ? 'with-detail' : ''}`}>
            <div className="history-list">
              {filteredAndSortedHistory.map((entry) => (
                <div
                  key={entry.id}
                  className={`history-item ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="item-image">
                    <img src={entry.image} alt="Analyzed plant" loading="lazy" />
                    <div className="confidence-overlay">
                      <span
                        className="confidence-badge"
                        style={{ backgroundColor: getConfidenceColor(entry.result.confidence) }}
                      >
                        {entry.result.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="item-details">
                    <div className="item-header">
                      <h4 className="disease-name">{entry.result.disease}</h4>
                      <div className="item-meta">
                        <span className="analysis-time">
                          {formatRelativeTime(entry.timestamp)}
                        </span>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                          }}
                          disabled={isDeleting === entry.id}
                          title="Delete this analysis"
                          aria-label="Delete analysis"
                        >
                          {isDeleting === entry.id ? (
                            <span className="spinner" style={{fontSize: '0.8rem'}}></span>
                          ) : (
                            '🗑️'
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="item-info">
                      <div className="confidence-info">
                        <span>Confidence: {entry.result.confidence}%</span>
                      </div>
                      {entry.result.additionalInfo && (
                        <div className="severity-info">
                          <span
                            className="severity-indicator"
                            style={{ backgroundColor: getSeverityColor(entry.result.additionalInfo.severity) }}
                          ></span>
                          <span>Severity: {entry.result.additionalInfo.severity}</span>
                        </div>
                      )}
                    </div>

                    <div className="timestamp">
                      {entry.date} at {entry.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedEntry && (
              <div className="history-detail">
                <div className="detail-header">
                  <h3>📊 Analysis Report</h3>
                  <button
                    className="close-detail"
                    onClick={() => setSelectedEntry(null)}
                    title="Close detail view"
                    aria-label="Close analysis detail"
                  >
                    ✕
                  </button>
                </div>

                <div className="detail-content">
                  <div className="detail-image">
                    <img src={selectedEntry.image} alt="Analyzed plant" />
                  </div>

                  <div className="detail-info">
                    <div className="disease-header">
                      <h4>{selectedEntry.result.disease}</h4>
                      <div className="confidence-score">
                        <div
                          className="confidence-bar"
                          style={{
                            background: `linear-gradient(90deg, ${getConfidenceColor(selectedEntry.result.confidence)} ${selectedEntry.result.confidence}%, #e9ecef ${selectedEntry.result.confidence}%)`
                          }}
                        >
                          <span>{selectedEntry.result.confidence}% Confidence</span>
                        </div>
                      </div>
                    </div>

                    {selectedEntry.result.additionalInfo && (
                      <div className="additional-details">
                        <div className="detail-row">
                          <strong>Plant Type:</strong>
                          <span>{selectedEntry.result.additionalInfo.plantType}</span>
                        </div>
                        <div className="detail-row">
                          <strong>Severity:</strong>
                          <span style={{ color: getSeverityColor(selectedEntry.result.additionalInfo.severity) }}>
                            {selectedEntry.result.additionalInfo.severity}
                          </span>
                        </div>
                        <div className="detail-row">
                          <strong>Common Name:</strong>
                          <span>{selectedEntry.result.additionalInfo.commonName}</span>
                        </div>
                      </div>
                    )}

                    {selectedEntry.result.treatments && selectedEntry.result.treatments.length > 0 && (
                      <div className="treatment-section">
                        <h5>Recommended Treatments</h5>
                        <div className="treatments-list">
                          {selectedEntry.result.treatments.map((treatment, index) => (
                            <div key={index} className="treatment-item">
                              <div className="treatment-header">
                                <span className="treatment-type">{treatment.type}</span>
                                <span className={`urgency-badge ${treatment.urgency.toLowerCase()}`}>
                                  {treatment.urgency} Priority
                                </span>
                              </div>
                              <p className="treatment-description">{treatment.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEntry.result.additionalInfo?.prevention && (
                      <div className="prevention-section">
                        <h5>Prevention Tips</h5>
                        <p>{selectedEntry.result.additionalInfo.prevention}</p>
                      </div>
                    )}

                    <div className="analysis-metadata">
                      <div className="metadata-row">
                        <strong>Analysis ID:</strong>
                        <code>{selectedEntry.result.analysisId}</code>
                      </div>
                      <div className="metadata-row">
                        <strong>Analyzed On:</strong>
                        <span>{selectedEntry.date} at {selectedEntry.time}</span>
                      </div>
                      <div className="metadata-row">
                        <strong>Analysis Time:</strong>
                        <span>{formatRelativeTime(selectedEntry.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
