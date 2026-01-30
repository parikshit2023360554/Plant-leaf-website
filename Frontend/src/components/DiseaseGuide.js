import React, { useState } from 'react';
import { getSupportedDiseases, getDiseaseInfo } from '../services/diseaseDetection';

const DiseaseGuide = () => {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const diseases = getSupportedDiseases();

  // Extended disease information with symptoms and detailed descriptions
  const extendedDiseaseInfo = {
    'Healthy': {
      symptoms: ['Vibrant green coloration', 'Firm, well-formed leaves', 'Active growth', 'No spots or discoloration'],
      description: 'A healthy plant shows vigorous growth with bright green foliage, firm stems, and no signs of disease or pest damage.',
      riskFactors: ['None - maintain current care routine'],
      commonPlants: ['All plant types']
    },
    'Leaf Spot': {
      symptoms: ['Circular or angular spots on leaves', 'Brown or black lesions', 'Yellow halos around spots', 'Premature leaf drop'],
      description: 'Leaf spot diseases are caused by various fungi and bacteria, creating characteristic spots that can merge and cause significant leaf damage.',
      riskFactors: ['High humidity', 'Poor air circulation', 'Overhead watering', 'Crowded plantings'],
      commonPlants: ['Roses', 'Tomatoes', 'Peppers', 'Ornamental plants']
    },
    'Powdery Mildew': {
      symptoms: ['White powdery coating on leaves', 'Distorted leaf growth', 'Yellow or brown leaf patches', 'Reduced plant vigor'],
      description: 'A fungal disease that creates a distinctive white, powdery coating on plant surfaces, thriving in warm, dry conditions with high humidity.',
      riskFactors: ['Poor air circulation', 'High humidity with dry conditions', 'Overcrowded plants', 'Stress conditions'],
      commonPlants: ['Squash', 'Cucumbers', 'Roses', 'Grapes', 'Lilacs']
    },
    'Bacterial Blight': {
      symptoms: ['Water-soaked spots on leaves', 'Brown or black lesions', 'Wilting of affected areas', 'Stem cankers'],
      description: 'A serious bacterial infection that can rapidly spread through plants, causing significant damage and requiring immediate intervention.',
      riskFactors: ['Wet conditions', 'Wounds from pruning or insects', 'High temperatures', 'Poor sanitation'],
      commonPlants: ['Beans', 'Peas', 'Tomatoes', 'Peppers', 'Stone fruits']
    },
    'Aphid Damage': {
      symptoms: ['Curled or distorted leaves', 'Sticky honeydew on surfaces', 'Yellowing foliage', 'Stunted growth', 'Visible insects'],
      description: 'Damage caused by small, soft-bodied insects that feed on plant sap, weakening plants and potentially transmitting viruses.',
      riskFactors: ['New growth periods', 'Nitrogen-rich fertilization', 'Ant presence', 'Lack of natural predators'],
      commonPlants: ['Roses', 'Vegetables', 'Fruit trees', 'Ornamental plants']
    },
    'Nutrient Deficiency': {
      symptoms: ['Yellowing leaves (chlorosis)', 'Stunted growth', 'Purple or red leaf tinting', 'Poor fruit/flower development'],
      description: 'Plants lacking essential nutrients show various symptoms depending on which nutrients are deficient, affecting overall health and productivity.',
      riskFactors: ['Poor soil quality', 'Incorrect pH', 'Over or under-watering', 'Root damage'],
      commonPlants: ['All plant types', 'Especially vegetables and fruiting plants']
    }
    ,
    'Downy Mildew': {
      symptoms: ['Yellow patches on upper leaf surface', 'Gray/purple downy growth underside', 'Leaf curling and drop', 'Stunted growth'],
      description: 'A fungal-like disease that thrives in cool, moist conditions, causing yellow lesions and characteristic downy growth on the leaf underside.',
      riskFactors: ['Prolonged leaf wetness', 'Dense canopy', 'Cool and humid weather', 'Overhead irrigation'],
      commonPlants: ['Cucumbers', 'Lettuce', 'Grapes', 'Basil']
    },
    'Rust': {
      symptoms: ['Orange/brown pustules on leaves', 'Leaf yellowing', 'Premature defoliation', 'Tiny powdery spores'],
      description: 'A group of fungal diseases producing rust-colored pustules, reducing plant vigor and potentially defoliating susceptible hosts.',
      riskFactors: ['High humidity', 'Overcrowded plants', 'Wet foliage', 'Poor air circulation'],
      commonPlants: ['Roses', 'Snapdragons', 'Cereals', 'Beans']
    },
    'Late Blight': {
      symptoms: ['Water-soaked lesions', 'White mold on leaf underside', 'Rapid leaf collapse', 'Fruit rot'],
      description: 'A devastating oomycete disease of tomato and potato, spreading quickly under cool, wet conditions and requiring immediate action.',
      riskFactors: ['Rainy periods', 'Cool temperatures', 'Infected seed stock', 'Dense plantings'],
      commonPlants: ['Tomatoes', 'Potatoes']
    },
    'Mosaic Virus': {
      symptoms: ['Mottled light/dark green patterns', 'Leaf distortion', 'Stunted growth', 'Reduced yields'],
      description: 'Viral diseases causing mosaic-like leaf patterns; spread by handling and insect vectors like aphids or whiteflies.',
      riskFactors: ['Aphid/whitefly presence', 'Contaminated tools', 'Non-resistant varieties', 'Handling tobacco products'],
      commonPlants: ['Cucumbers', 'Peppers', 'Tomatoes', 'Squash']
    },
    'Root Rot': {
      symptoms: ['Wilting despite moist soil', 'Brown/black mushy roots', 'Slow growth', 'Leaf yellowing'],
      description: 'A soil-borne issue often caused by overwatering and poor drainage; roots become soft and unable to support the plant.',
      riskFactors: ['Waterlogged soil', 'Poor drainage', 'Contaminated media', 'Overwatering'],
      commonPlants: ['Houseplants', 'Seedlings', 'Woody ornamentals']
    },
    'Anthracnose': {
      symptoms: ['Sunken dark lesions on leaves/fruit', 'Leaf spotting and blight', 'Twig dieback', 'Defoliation'],
      description: 'A fungal disease producing sunken lesions, particularly active in warm, wet conditions; affects leaves, stems, and fruit.',
      riskFactors: ['Warm, wet weather', 'Overhead irrigation', 'Plant debris left on soil', 'Infected seeds'],
      commonPlants: ['Maple', 'Sycamore', 'Citrus', 'Strawberries']
    }
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDiseaseSelect = (diseaseName) => {
    const basicInfo = getDiseaseInfo(diseaseName);
    const extendedInfo = extendedDiseaseInfo[diseaseName];
    setSelectedDisease({ ...basicInfo, ...extendedInfo });
  };

  const getSeverityColor = (severity) => {
    if (!severity) return '#6b7280';
    const lowerSeverity = severity.toLowerCase();
    if (lowerSeverity.includes('high')) return '#ef4444';
    if (lowerSeverity.includes('medium') || lowerSeverity.includes('moderate')) return '#f59e0b';
    if (lowerSeverity.includes('low')) return '#10b981';
    return '#6b7280';
  };

  const getUrgencyColor = (urgency) => {
    if (!urgency) return '#6b7280';
    const lowerUrgency = urgency.toLowerCase();
    if (lowerUrgency === 'high') return '#ef4444';
    if (lowerUrgency === 'medium') return '#f59e0b';
    if (lowerUrgency === 'low') return '#10b981';
    return '#6b7280';
  };

  return (
    <div className="disease-guide">
      <div className="guide-header">
        <h1>🔬 Plant Disease Guide</h1>
        <p>Comprehensive information about common plant diseases, their symptoms, and treatments</p>
      </div>

      <div className="guide-content">
        <div className="guide-sidebar">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search diseases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="disease-list">
            
            {filteredDiseases.map((disease) => (
              <div
                key={disease.name}
                className={`disease-item ${selectedDisease?.disease === disease.name ? 'active' : ''}`}
                onClick={() => handleDiseaseSelect(disease.name)}
              >
                <h4>{disease.name}</h4>
                <p>{disease.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="guide-main">
          {selectedDisease ? (
            <div className="disease-details">
              <div className="disease-header">
                <h2>{selectedDisease.disease}</h2>
                <div className="disease-meta">
                  <span 
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(selectedDisease.additionalInfo?.severity) }}
                  >
                    Severity: {selectedDisease.additionalInfo?.severity || 'Unknown'}
                  </span>
                  <span className="plant-type-badge">
                    {selectedDisease.additionalInfo?.plantType || 'General'}
                  </span>
                </div>
              </div>

              <div className="disease-sections">
                <section className="description-section">
                  <h3>📋 Description</h3>
                  <p>{selectedDisease.description}</p>
                </section>

                <section className="symptoms-section">
                  <h3>🔍 Common Symptoms</h3>
                  <ul className="symptoms-list">
                    {selectedDisease.symptoms?.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </section>

                <section className="risk-factors-section">
                  <h3>⚠️ Risk Factors</h3>
                  <ul className="risk-factors-list">
                    {selectedDisease.riskFactors?.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </section>

                <section className="common-plants-section">
                  <h3>🌱 Commonly Affected Plants</h3>
                  <div className="plant-tags">
                    {selectedDisease.commonPlants?.map((plant, index) => (
                      <span key={index} className="plant-tag">{plant}</span>
                    ))}
                  </div>
                </section>

                {selectedDisease.treatments && selectedDisease.treatments.length > 0 && (
                  <section className="treatments-section">
                    <h3>💊 Treatment Options</h3>
                    <div className="treatments-grid">
                      {selectedDisease.treatments.map((treatment, index) => (
                        <div key={index} className="treatment-card">
                          <div className="treatment-header">
                            <h4>{treatment.type}</h4>
                            <span 
                              className="urgency-badge"
                              style={{ backgroundColor: getUrgencyColor(treatment.urgency) }}
                            >
                              {treatment.urgency} Priority
                            </span>
                          </div>
                          <p>{treatment.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="prevention-section">
                  <h3>🛡️ Prevention</h3>
                  <p>{selectedDisease.additionalInfo?.prevention}</p>
                </section>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <h3>Select a Disease</h3>
                <p>Choose a disease from the sidebar to view detailed information about symptoms, treatments, and prevention methods.</p>
                <div className="guide-stats">
                  <div className="stat">
                    <span className="stat-number">{diseases.length}</span>
                    <span className="stat-label">Diseases Covered</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">AI-Powered</span>
                    <span className="stat-label">Detection System</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">Expert</span>
                    <span className="stat-label">Treatment Advice</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="guide-footer">
        <div className="disclaimer">
          <h4>⚠️ Important Disclaimer</h4>
          <p>This guide provides general information about plant diseases. For severe infections or valuable plants, consult with a local agricultural extension office or plant pathologist for professional diagnosis and treatment recommendations.</p>
        </div>
      </div>
    </div>
  );
};

export default DiseaseGuide;
