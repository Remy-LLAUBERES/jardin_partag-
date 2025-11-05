/**
 * APP.JS - FONCTIONS UTILITAIRES DU JARDIN PARTAGÉ
 *
 * Ce fichier contient les fonctions utilitaires communes
 * utilisées à travers l'application
 */

// ===== GESTION LOCALSTORAGE =====

/**
 * Lit des données depuis localStorage de manière sécurisée
 * @param {string} key - Clé de stockage
 * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas (défaut: [])
 * @returns {*} Les données parsées ou la valeur par défaut
 */
function getFromStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Sauvegarde des données dans localStorage de manière sécurisée
 * @param {string} key - Clé de stockage
 * @param {*} value - Valeur à sauvegarder
 * @returns {boolean} true si succès, false si erreur
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    alert('⚠️ Erreur lors de la sauvegarde des données. Espace de stockage insuffisant ?');
    return false;
  }
}

/**
 * Supprime une clé du localStorage
 * @param {string} key - Clé à supprimer
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erreur lors de la suppression de ${key}:`, error);
  }
}

// ===== GÉNÉRATION D'IDS UNIQUES =====

/**
 * Génère un ID unique basé sur timestamp et random
 * @returns {string} ID unique
 */
function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ===== GESTION DES DATES =====

/**
 * Retourne la date du jour au format YYYY-MM-DD
 * @returns {string} Date du jour
 */
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Formate une date pour l'affichage (DD/MM/YYYY)
 * @param {string} dateString - Date au format YYYY-MM-DD
 * @returns {string} Date formatée
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

// ===== GESTION DES ONGLETS =====

/**
 * Change l'onglet actif dans une interface avec onglets
 * @param {string} tabName - Nom de l'onglet à activer
 * @param {Object} config - Configuration des onglets
 */
function switchTab(tabName, config) {
  // Désactiver tous les onglets
  Object.keys(config.tabs).forEach(tab => {
    const btn = document.getElementById(config.tabs[tab].btnId);
    const content = document.getElementById(config.tabs[tab].contentId);

    if (btn) btn.classList.remove('active');
    if (content) content.classList.remove('visible');
  });

  // Activer l'onglet sélectionné
  const activeTab = config.tabs[tabName];
  if (activeTab) {
    const btn = document.getElementById(activeTab.btnId);
    const content = document.getElementById(activeTab.contentId);

    if (btn) btn.classList.add('active');
    if (content) content.classList.add('visible');
  }
}

// ===== VALIDATION =====

/**
 * Valide qu'une quantité est dans les limites acceptables
 * @param {number} quantity - Quantité à valider
 * @param {number} min - Minimum (défaut: 1)
 * @param {number} max - Maximum (défaut: 1000)
 * @returns {boolean} true si valide
 */
function validateQuantity(quantity, min = 1, max = 1000) {
  const num = parseInt(quantity, 10);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Valide qu'une chaîne n'est pas vide
 * @param {string} str - Chaîne à valider
 * @returns {boolean} true si non vide
 */
function validateNotEmpty(str) {
  return str && str.trim().length > 0;
}

// ===== MANIPULATION DOM =====

/**
 * Crée un élément option pour un select
 * @param {string} value - Valeur de l'option
 * @param {string} label - Texte affiché
 * @param {boolean} selected - Si l'option doit être sélectionnée
 * @returns {HTMLOptionElement} L'élément option
 */
function createOption(value, label, selected = false) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  if (selected) option.selected = true;
  return option;
}

/**
 * Remplit un select avec des options
 * @param {HTMLSelectElement} selectElement - L'élément select
 * @param {Array} options - Tableau d'objets {value, label}
 * @param {string} placeholder - Texte du placeholder optionnel
 */
function populateSelect(selectElement, options, placeholder = null) {
  selectElement.innerHTML = '';

  if (placeholder) {
    selectElement.appendChild(createOption('', placeholder));
  }

  options.forEach(opt => {
    selectElement.appendChild(createOption(opt.value, opt.label));
  });
}

// ===== EXPORT/IMPORT DONNÉES =====

/**
 * Exporte toutes les données de l'application en JSON
 * @returns {Object} Toutes les données
 */
function exportAllData() {
  return {
    plantations: getFromStorage(STORAGE_KEYS.PLANTATIONS, []),
    stocks: getFromStorage(STORAGE_KEYS.STOCKS, []),
    preleves: getFromStorage(STORAGE_KEYS.PRELEVES, []),
    outils: getFromStorage(STORAGE_KEYS.OUTILS, []),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Télécharge les données exportées en fichier JSON
 */
function downloadDataAsJSON() {
  const data = exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jardin-backup-${getTodayDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('✅ Données exportées avec succès !');
}

/**
 * Importe des données depuis un fichier JSON
 * @param {File} file - Fichier à importer
 */
function importDataFromJSON(file) {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      // Validation basique
      if (!data.plantations && !data.stocks && !data.outils) {
        throw new Error('Format de fichier invalide');
      }

      // Confirmation avant import
      if (!confirm('⚠️ Attention ! L\'import va remplacer toutes les données actuelles. Continuer ?')) {
        return;
      }

      // Import des données
      if (data.plantations) saveToStorage(STORAGE_KEYS.PLANTATIONS, data.plantations);
      if (data.stocks) saveToStorage(STORAGE_KEYS.STOCKS, data.stocks);
      if (data.preleves) saveToStorage(STORAGE_KEYS.PRELEVES, data.preleves);
      if (data.outils) saveToStorage(STORAGE_KEYS.OUTILS, data.outils);

      alert('✅ Données importées avec succès !');
      location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      alert('❌ Erreur lors de l\'import : fichier invalide');
    }
  };

  reader.readAsText(file);
}

// ===== AFFICHAGE DES MESSAGES =====

/**
 * Affiche un message d'état vide dans un conteneur
 * @param {HTMLElement} container - Conteneur où afficher le message
 * @param {string} message - Message à afficher
 */
function showEmptyState(container, message) {
  container.innerHTML = `<div class="empty-state">${message}</div>`;
}

/**
 * Affiche un message de succès temporaire
 * @param {string} message - Message à afficher
 * @param {number} duration - Durée en ms (défaut: 3000)
 */
function showSuccessMessage(message, duration = 3000) {
  const div = document.createElement('div');
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4CAF50;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => document.body.removeChild(div), 300);
  }, duration);
}

// ===== RECHERCHE ET FILTRAGE =====

/**
 * Filtre un tableau d'objets selon une recherche texte
 * @param {Array} items - Tableau à filtrer
 * @param {string} searchText - Texte de recherche
 * @param {Array} fields - Champs à rechercher
 * @returns {Array} Tableau filtré
 */
function filterItems(items, searchText, fields) {
  if (!searchText || searchText.trim() === '') return items;

  const search = searchText.toLowerCase();
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(search);
    });
  });
}

// ===== CONFIRMATION SÉCURISÉE =====

/**
 * Demande une confirmation pour une action destructive
 * @param {string} message - Message de confirmation
 * @returns {boolean} true si confirmé
 */
function confirmAction(message) {
  return confirm(message);
}
