// Mock disease detection service
// In a real application, this would connect to a machine learning model API

const mockDiseases = [
  {
    disease: 'Healthy',
    confidence: 95,
    treatments: [],
    additionalInfo: {
      plantType: 'General',
      commonName: 'Healthy Plant',
      severity: 'None',
      prevention: 'Continue regular care routine'
    }
  },
  {
    disease: 'Leaf Spot',
    confidence: 87,
    treatments: [
      {
        type: 'Fungicide',
        description: 'Apply copper-based fungicide spray every 7-10 days',
        urgency: 'Medium'
      },
      {
        type: 'Cultural',
        description: 'Improve air circulation and avoid watering leaves directly',
        urgency: 'High'
      }
    ],
    additionalInfo: {
      plantType: 'Broadleaf',
      commonName: 'Fungal Leaf Spot',
      severity: 'Moderate',
      prevention: 'Avoid overhead watering and ensure good drainage'
    }
  },
  {
    disease: 'Powdery Mildew',
    confidence: 92,
    treatments: [
      {
        type: 'Organic Treatment',
        description: 'Mix 1 tsp baking soda with 1 quart water and spray affected areas',
        urgency: 'High'
      },
      {
        type: 'Commercial Fungicide',
        description: 'Apply sulfur-based or neem oil fungicide',
        urgency: 'Medium'
      }
    ],
    additionalInfo: {
      plantType: 'Various',
      commonName: 'Powdery Mildew Disease',
      severity: 'High',
      prevention: 'Ensure good air circulation and avoid overcrowding plants'
    }
  },
  {
    disease: 'Bacterial Blight',
    confidence: 79,
    treatments: [
      {
        type: 'Removal',
        description: 'Remove and destroy infected plant parts immediately',
        urgency: 'High'
      },
      {
        type: 'Copper Treatment',
        description: 'Apply copper-based bactericide as directed',
        urgency: 'High'
      }
    ],
    additionalInfo: {
      plantType: 'Vegetable crops',
      commonName: 'Bacterial Leaf Blight',
      severity: 'High',
      prevention: 'Avoid working with wet plants and ensure clean tools'
    }
  },
  {
    disease: 'Aphid Damage',
    confidence: 85,
    treatments: [
      {
        type: 'Natural Predators',
        description: 'Introduce ladybugs or lacewings to control aphid population',
        urgency: 'Low'
      },
      {
        type: 'Soap Spray',
        description: 'Apply insecticidal soap spray to affected areas',
        urgency: 'Medium'
      }
    ],
    additionalInfo: {
      plantType: 'Various',
      commonName: 'Aphid Infestation',
      severity: 'Low to Medium',
      prevention: 'Monitor plants regularly and encourage beneficial insects'
    }
  },
  {
    disease: 'Nutrient Deficiency',
    confidence: 73,
    treatments: [
      {
        type: 'Fertilization',
        description: 'Apply balanced fertilizer according to soil test results',
        urgency: 'Medium'
      },
      {
        type: 'Soil Amendment',
        description: 'Add compost or organic matter to improve soil structure',
        urgency: 'Low'
      }
    ],
    additionalInfo: {
      plantType: 'General',
      commonName: 'Nutrient Deficiency',
      severity: 'Medium',
      prevention: 'Regular soil testing and appropriate fertilization schedule'
    }
  }
  ,
  {
    disease: 'Downy Mildew',
    confidence: 88,
    treatments: [
      { type: 'Fungicide', description: 'Use phosphonate or copper fungicides weekly', urgency: 'High' },
      { type: 'Cultural', description: 'Improve airflow and avoid evening overhead watering', urgency: 'Medium' }
    ],
    additionalInfo: {
      plantType: 'Leafy greens & vines',
      commonName: 'Downy Mildew',
      severity: 'High',
      prevention: 'Plant resistant varieties and reduce leaf wetness duration'
    }
  },
  {
    disease: 'Rust',
    confidence: 82,
    treatments: [
      { type: 'Fungicide', description: 'Apply chlorothalonil or myclobutanil per label', urgency: 'Medium' },
      { type: 'Sanitation', description: 'Remove infected leaves; disinfect tools', urgency: 'High' }
    ],
    additionalInfo: {
      plantType: 'Ornamentals & cereals',
      commonName: 'Rust Fungal Disease',
      severity: 'Moderate',
      prevention: 'Avoid overcrowding and keep foliage dry'
    }
  },
  {
    disease: 'Late Blight',
    confidence: 90,
    treatments: [
      { type: 'Immediate Removal', description: 'Remove and bag infected plants; do not compost', urgency: 'High' },
      { type: 'Fungicide', description: 'Use protective fungicides (chlorothalonil, copper) before outbreaks', urgency: 'High' }
    ],
    additionalInfo: {
      plantType: 'Tomato & potato',
      commonName: 'Late Blight (Phytophthora infestans)',
      severity: 'High',
      prevention: 'Use certified seed; avoid wet foliage; rotate crops'
    }
  },
  {
    disease: 'Mosaic Virus',
    confidence: 76,
    treatments: [
      { type: 'Removal', description: 'Remove infected plants; control aphids to limit spread', urgency: 'High' },
      { type: 'Resistant Varieties', description: 'Plant virus-resistant cultivars', urgency: 'Medium' }
    ],
    additionalInfo: {
      plantType: 'Cucurbits, solanaceae',
      commonName: 'Mosaic Virus',
      severity: 'Moderate',
      prevention: 'Manage vectors; sanitize hands and tools; avoid tobacco handling'
    }
  },
  {
    disease: 'Root Rot',
    confidence: 84,
    treatments: [
      { type: 'Cultural', description: 'Improve drainage; reduce watering; repot with sterile mix', urgency: 'High' },
      { type: 'Fungicide', description: 'Apply systemic fungicide if appropriate', urgency: 'Medium' }
    ],
    additionalInfo: {
      plantType: 'Houseplants & seedlings',
      commonName: 'Root Rot (Pythium/Phytophthora)',
      severity: 'High',
      prevention: 'Avoid waterlogged soil; sterilize containers and media'
    }
  },
  {
    disease: 'Anthracnose',
    confidence: 78,
    treatments: [
      { type: 'Sanitation', description: 'Prune infected tissue; dispose properly', urgency: 'Medium' },
      { type: 'Fungicide', description: 'Apply broad-spectrum fungicides during wet periods', urgency: 'Medium' }
    ],
    additionalInfo: {
      plantType: 'Shade trees & fruits',
      commonName: 'Anthracnose',
      severity: 'Moderate',
      prevention: 'Promote airflow; avoid overhead watering; clean debris'
    }
  }
];

export const detectPlantDisease = async (imageFile) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  // Randomly select a disease for demonstration
  const randomIndex = Math.floor(Math.random() * mockDiseases.length);
  const selectedDisease = mockDiseases[randomIndex];
  
  // Add some randomness to confidence
  const confidenceVariation = Math.random() * 20 - 10; // ±10%
  const adjustedConfidence = Math.max(30, Math.min(99, 
    selectedDisease.confidence + confidenceVariation
  ));
  
  return {
    ...selectedDisease,
    confidence: Math.round(adjustedConfidence),
    analysisId: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
};

// Helper function to get disease information by name
export const getDiseaseInfo = (diseaseName) => {
  return mockDiseases.find(disease => disease.disease === diseaseName);
};

// Get all supported diseases for informational purposes
export const getSupportedDiseases = () => {
  return mockDiseases.map(disease => ({
    name: disease.disease,
    description: disease.additionalInfo.commonName
  }));
};
