import React, { useState } from 'react';
import AutomatizacionesTable from '../components/AutomatizacionesTable';
import { useClient } from '../context/ClientContext';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { BsSearch, BsFilter } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const Automatizaciones: React.FC = () => {
  const { client } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'automation_name', 'open_rate', 'emails_entregados', 'aperturas_unicas', 'clicks_unicos', 'bounce_rate', 'ctr', 'ctor'
  ]);
  const [filterCriteria, setFilterCriteria] = useState<{ [key: string]: string }>({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const allColumns = [
    { key: 'automation_name', name: 'Automatización' },
    { key: 'open_rate', name: 'Open Rate' },
    { key: 'emails_entregados', name: 'Entregados' },
    { key: 'aperturas_unicas', name: 'Aperturas únicas' },
    { key: 'clicks_unicos', name: 'Clicks únicos' },
    { key: 'bounce_rate', name: 'Tasa de Rebote' },
    { key: 'ctr', name: 'CTR' },
    { key: 'ctor', name: 'CTOR' },
  ];

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCriteria({
      ...filterCriteria,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async (format: 'xlsx' | 'csv') => {
    if (!client) {
      alert('Seleccioná un cliente para descargar las automatizaciones.');
      return;
    }
    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado');
      }
      let query = supabase.from('all_automations').select(
        'automation_name,open_rate,aperturas_unicas,clicks_unicos,emails_entregados,ctr,ctor,bounce_rate',
      ).eq('cliente_id', client);
      if (searchTerm) {
        query = query.ilike('automation_name', `%${searchTerm}%`);
      }
      if (filterCriteria.startDate) {
        query = query.gte('created_at', filterCriteria.startDate);
      }
      if (filterCriteria.endDate) {
        query = query.lte('created_at', filterCriteria.endDate + 'T23:59:59.999Z');
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      const automatizacionesToExport = data || [];
      const dataToExport = automatizacionesToExport.map(auto => {
        const row: { [key: string]: any } = {};
        selectedColumns.forEach(col => {
          const autoTyped = auto as Record<string, any>;
          if ([ 'open_rate', 'ctr', 'ctor', 'bounce_rate' ].includes(col)) {
            const value = autoTyped[col];
            row[col] = `${(value ?? 0).toFixed(2)}%`;
          } else {
            row[col] = autoTyped[col];
          }
        });
        return row;
      });
      if (format === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Automatizaciones');
        XLSX.writeFile(wb, 'automatizaciones.xlsx');
      } else if (format === 'csv') {
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', 'automatizaciones.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err: any) {
      alert(`Error al descargar automatizaciones: ${err.message}`);
    }
  };

  return (
    <div className="py-5 px-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
      <h2 className="text-white mb-4">Automatizaciones</h2>
      <div className="d-flex align-items-center mb-4">
        <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de automatización..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              borderRadius: '12px',
              border: '1px solid #353535',
              backgroundColor: '#232323',
              color: '#E6E6E6',
              fontSize: '1rem',
              width: '100%',
              transition: 'all 0.2s ease-in-out'
            }}
          />
          <span
            className="position-absolute"
            style={{
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#A0A0A0'
            }}
          >
            <BsSearch size={18} />
          </span>
        </div>
        <button
          className="btn btn-secondary ms-3"
          onClick={() => setShowFilterOptions(!showFilterOptions)}
          style={{
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            backgroundColor: '#353535',
            border: '1px solid #4A4A4A',
            color: '#E6E6E6',
            fontSize: '1rem',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <BsFilter size={18} />
        </button>
      </div>
      <AnimatePresence>
        {showFilterOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 p-4 animate-in"
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: '16px',
              border: '1px solid #353535',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <h5 className="text-white mb-3">Opciones de Descarga y Filtros</h5>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="column-select" className="form-label text-white">Seleccionar Columnas:</label>
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="column-select" data-bs-toggle="dropdown" aria-expanded="false">
                    Columnas
                  </button>
                  <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="column-select" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {allColumns.map(column => (
                      <li key={column.key}>
                        <div className="form-check dropdown-item">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`column-${column.key}`}
                            checked={selectedColumns.includes(column.key)}
                            onChange={() => handleColumnToggle(column.key)}
                          />
                          <label className="form-check-label" htmlFor={`column-${column.key}`}>
                            {column.name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="filter-start-date" className="form-label text-white">Fecha de Inicio:</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  name="startDate"
                  value={filterCriteria.startDate || ''}
                  onChange={handleFilterChange}
                  style={{ backgroundColor: '#232323', color: '#E6E6E6', border: '1px solid #353535' }}
                />
                <label htmlFor="filter-end-date" className="form-label text-white">Fecha Fin:</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={filterCriteria.endDate || ''}
                  onChange={handleFilterChange}
                  style={{ backgroundColor: '#232323', color: '#E6E6E6', border: '1px solid #353535' }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-primary me-2"
                onClick={() => handleDownload('xlsx')}
                style={{ backgroundColor: '#1A53F3', border: 'none', borderRadius: '8px' }}
              >
                Descargar XLSX
              </button>
              <button
                className="btn btn-info"
                onClick={() => handleDownload('csv')}
                style={{ backgroundColor: '#28A745', border: 'none', borderRadius: '8px' }}
              >
                Descargar CSV
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AutomatizacionesTable
          searchTerm={searchTerm}
          selectedColumns={selectedColumns}
          filterCriteria={filterCriteria}
        />
      </motion.div>
    </div>
  );
};

export default Automatizaciones; 