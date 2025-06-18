import React, { useState } from 'react';
import CampaniasTable from '../components/CampaniasTable';
import { useClient } from '../context/ClientContext';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { BsSearch, BsFilter } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface Campania {
  fecha_envio: string;
  campaign_name: string;
  remitente: string;
  asunto: string;
  emails_entregados: number;
  aperturas_unicas: number;
  clicks_unicos: number;
  rebotes_total: number;
  rebotes_duros: number;
  rebotes_suaves: number;
  open_rate: number;
  ctr: number;
  ctor: number;
}

const CampanasEnviadas: React.FC = () => {
  const { client, selectedRemitente } = useClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGrupoFilterActive, setIsGrupoFilterActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'fecha_envio', 'campaign_name', 'remitente', 'asunto', 'emails_entregados',
    'aperturas_unicas', 'clicks_unicos', 'rebotes_total', 'rebotes_duros',
    'rebotes_suaves', 'open_rate', 'ctr', 'ctor'
  ]);
  const [filterCriteria, setFilterCriteria] = useState<{ [key: string]: string }>({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const allColumns = [
    { key: 'fecha_envio', name: 'Fecha de Envío' },
    { key: 'campaign_name', name: 'Nombre de Campaña' },
    { key: 'remitente', name: 'Remitente' },
    { key: 'asunto', name: 'Asunto' },
    { key: 'emails_entregados', name: 'Emails Entregados' },
    { key: 'aperturas_unicas', name: 'Aperturas Únicas' },
    { key: 'clicks_unicos', name: 'Clicks Únicos' },
    { key: 'rebotes_total', name: 'Rebotes Total' },
    { key: 'rebotes_duros', name: 'Rebotes Duros' },
    { key: 'rebotes_suaves', name: 'Rebotes Suaves' },
    { key: 'open_rate', name: 'Open Rate' },
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

  const handleGrupoFilterToggle = () => {
    setIsLoading(true);
    setIsGrupoFilterActive(prev => !prev);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleDownload = async (format: 'xlsx' | 'csv') => {
    if (!client) {
      alert('Seleccioná un cliente para descargar las campañas.');
      return;
    }

    try {
      if (!supabase) {
        throw new Error('Supabase no está configurado');
      }
      let query = supabase.from('all_campaigns').select(
        'fecha_envio,campaign_name,remitente,asunto,emails_entregados,aperturas_unicas,clicks_unicos,rebotes_total,rebotes_duros,rebotes_suaves,open_rate,ctr,ctor',
      ).eq('cliente_id', client);

      // Obtener el cliente seleccionado en el Header desde localStorage
      const selectedClientId = localStorage.getItem('selectedClientId');
      if (client === 'cesa' && selectedClientId === 'cesa_servicios') {
        query = query.in('remitente', ['experiencia.luna@cesa.edu.co', 'experiencia.cesa@cesa.edu.co']);
      } else if (selectedRemitente) {
        query = query.eq('remitente', selectedRemitente);
      }

      if (searchTerm) {
        query = query.ilike('campaign_name', `%${searchTerm}%`);
      }
      if (client === 'unab' && isGrupoFilterActive) {
        query = query.ilike('campaign_name', `%Grupo%`);
      }
      if (filterCriteria.startDate) {
        query = query.gte('fecha_envio', filterCriteria.startDate);
      }
      if (filterCriteria.endDate) {
        query = query.lte('fecha_envio', filterCriteria.endDate + 'T23:59:59.999Z');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const campaignsToExport: Campania[] = data || [];

      const dataToExport = campaignsToExport.map(campaign => {
        const row: { [key: string]: any } = {};
        selectedColumns.forEach(col => {
          if (col === 'open_rate' || col === 'ctr' || col === 'ctor') {
            const value = campaign[col as keyof Campania];
            row[col] = `${(value as number ?? 0).toFixed(2)}%`;
          } else {
            row[col] = campaign[col as keyof Campania];
          }
        });
        return row;
      });

      if (format === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Campañas");
        XLSX.writeFile(wb, "campanas.xlsx");
      } else if (format === 'csv') {
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', 'campanas.csv');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (err: any) {
      alert(`Error al descargar campañas: ${err.message}`);
    }
  };

  return (
    <div className="py-5 px-4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
      <h2 className="text-white mb-4">Campañas enviadas</h2>
      <div className="d-flex align-items-center mb-4">
        <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre de campaña..."
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
        {client === 'unab' && (
          <button
            className="ms-3"
            onClick={handleGrupoFilterToggle}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '24px',
              border: isGrupoFilterActive ? 'none' : '2px solid #1A53F3',
              backgroundColor: isGrupoFilterActive ? '#1A53F3' : 'black',
              color: '#E6E6E6',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, border-color 0.3s ease',
              outline: 'none',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Envío de tipificaciones {isGrupoFilterActive && <span className="ms-2"><AiOutlineCloseCircle size={18} /></span>}
          </button>
        )}
      </div>

      {showFilterOptions && (
        <div
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
        </div>
      )}

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '200px' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CampaniasTable 
              searchTerm={searchTerm} 
              selectedColumns={selectedColumns} 
              filterCriteria={filterCriteria} 
              isGrupoFilterActive={isGrupoFilterActive} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampanasEnviadas; 