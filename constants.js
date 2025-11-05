/**
 * CONSTANTES DU JARDIN PARTAGÉ
 *
 * Ce fichier contient toutes les valeurs constantes de l'application
 * pour faciliter la maintenance et éviter les valeurs hardcodées
 */

// Types de plantes disponibles
const PLANT_TYPES = [
  { value: '🍅', label: '🍅 Tomate' },
  { value: '🥕', label: '🥕 Carotte' },
  { value: '🥬', label: '🥬 Salade' },
  { value: '🌶️', label: '🌶️ Piment' },
  { value: '🎃', label: '🎃 Citrouille' }
];

// États possibles pour les plantations
const PLANT_STATES = [
  { value: 'Semé', label: 'Semé' },
  { value: 'En croissance', label: 'En croissance' },
  { value: 'À récolter', label: 'À récolter' }
];

// États possibles pour les outils
const TOOL_STATES = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Emprunté', label: 'Emprunté' },
  { value: 'À réparer', label: 'À réparer' }
];

// Configuration des bacs
const BACS = [
  { id: 1, name: 'Bac 1' },
  { id: 2, name: 'Bac 2' },
  { id: 3, name: 'Bac 3' }
];

// Clés de stockage localStorage
const STORAGE_KEYS = {
  PLANTATIONS: 'plantations',
  STOCKS: 'stocks',
  PRELEVES: 'preleves',
  OUTILS: 'outils',
  SELECTED_PLANT: 'selectedPlant',
  CURRENT_USER: 'currentUser'
};

// Limites de quantité
const LIMITS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 50
};

// Nom du jardin
const GARDEN_NAME = '🌿 Jardin Communautaire de la Bergerie';

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLANT_TYPES,
    PLANT_STATES,
    TOOL_STATES,
    BACS,
    STORAGE_KEYS,
    LIMITS,
    GARDEN_NAME
  };
}
