// src/components/Settings/SettingsModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useApp } from '../../context/AppContext';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="settings-modal"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <div className="modal-header">
        <h2>Settings</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label>Default Currency:</label>
          <select
            value={localSettings.defaultCurrency}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              defaultCurrency: e.target.value
            })}
          >
            <option value="IDR">IDR (Rp)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        <div className="setting-group">
          <label>EUR/IDR Exchange Rate:</label>
          <input
            type="number"
            value={localSettings.exchangeRate}
            onChange={(e) => setLocalSettings({
              ...localSettings,
              exchangeRate: parseFloat(e.target.value) || 16500
            })}
            placeholder="16500"
          />
          <small>Enter IDR amount per 1 EUR</small>
        </div>

        <div className="setting-group">
          <label>
            <input
              type="checkbox"
              checked={localSettings.showEurEquivalent}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                showEurEquivalent: e.target.checked
              })}
            />
            Show EUR equivalent for amounts
          </label>
        </div>

        <div className="setting-group">
          <label>
            <input
              type="checkbox"
              checked={localSettings.autoAddRecurring}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                autoAddRecurring: e.target.checked
              })}
            />
            Auto-add recurring expenses
          </label>
        </div>
      </div>

      <div className="modal-actions">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button onClick={handleSave} className="btn-primary">Save</button>
      </div>
    </Modal>
  );
};

export default SettingsModal;