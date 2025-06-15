import React, { useState } from 'react';
import Papa from 'papaparse';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/format';
import './ImportExportPage.css';

const ImportExportPage = () => {
  const { expenses, goals, addExpense, addGoal } = useApp();
  const [importStatus, setImportStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const exportToJSON = () => {
    const data = {
      expenses,
      goals,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvData = expenses.map(expense => ({
      Date: formatDate(expense.date),
      Amount: expense.amount,
      Currency: expense.currency,
      Category: expense.category,
      Type: expense.type,
      Notes: expense.notes || '',
      Recurring: expense.recurring ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(csvData);
    const csvBlob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const data = JSON.parse(e.target.result);
          importJSONData(data);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          Papa.parse(e.target.result, {
            header: true,
            complete: (results) => importCSVData(results.data),
            error: (error) => {
              setImportStatus(`Error parsing CSV: ${error.message}`);
              setIsImporting(false);
            }
          });
        }
      } catch (error) {
        setImportStatus(`Error importing file: ${error.message}`);
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  const importJSONData = (data) => {
    try {
      let importedCount = 0;

      if (data.expenses && Array.isArray(data.expenses)) {
        data.expenses.forEach(expense => {
          if (expense.amount && expense.category && expense.date) {
            addExpense(expense);
            importedCount++;
          }
        });
      }

      if (data.goals && Array.isArray(data.goals)) {
        data.goals.forEach(goal => {
          if (goal.name && goal.targetAmount) {
            addGoal(goal);
          }
        });
      }

      setImportStatus(`Successfully imported ${importedCount} expenses and ${data.goals?.length || 0} goals`);
    } catch (error) {
      setImportStatus(`Error importing JSON data: ${error.message}`);
    }
    setIsImporting(false);
  };

  const importCSVData = (data) => {
    try {
      let importedCount = 0;

      data.forEach(row => {
        if (row.Amount && row.Category && row.Date) {
          const expense = {
            amount: parseFloat(row.Amount),
            category: row.Category,
            date: new Date(row.Date).toISOString(),
            currency: row.Currency || 'EUR',
            type: row.Type || 'expense',
            notes: row.Notes || '',
            recurring: row.Recurring === 'Yes'
          };

          if (!isNaN(expense.amount)) {
            addExpense(expense);
            importedCount++;
          }
        }
      });

      setImportStatus(`Successfully imported ${importedCount} expenses from CSV`);
    } catch (error) {
      setImportStatus(`Error importing CSV data: ${error.message}`);
    }
    setIsImporting(false);
  };

  return (
    <div className="import-export-page">
      <div className="page-header">
        <h1>Import & Export Data</h1>
        <p>Backup your data or import from another device</p>
      </div>

      <div className="import-export-sections">
        <div className="export-section">
          <h2>Export Data</h2>
          <p>Download your expense data for backup or to transfer to another device.</p>
          
          <div className="export-options">
            <button className="btn-primary" onClick={exportToJSON}>
              Export as JSON
            </button>
            <button className="btn-secondary" onClick={exportToCSV}>
              Export as CSV
            </button>
          </div>
          
          <div className="data-summary">
            <p>{expenses.length} expenses • {goals.length} goals</p>
          </div>
        </div>

        <div className="import-section">
          <h2>Import Data</h2>
          <p>Upload a previously exported file to restore your data.</p>
          
          <div className="import-controls">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileImport}
              disabled={isImporting}
              className="file-input"
            />
            
            {isImporting && <div className="loading">Importing...</div>}
            {importStatus && (
              <div className={`import-status ${importStatus.includes('Error') ? 'error' : 'success'}`}>
                {importStatus}
              </div>
            )}
          </div>

          <div className="import-info">
            <h3>Supported Formats:</h3>
            <ul>
              <li><strong>JSON:</strong> Complete backup including expenses and goals</li>
              <li><strong>CSV:</strong> Expenses only (compatible with Excel)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportPage;