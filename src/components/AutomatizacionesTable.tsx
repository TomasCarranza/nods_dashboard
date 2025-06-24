import { useState, useEffect } from 'react';
import { useClient } from '../context/ClientContext';
import { supabase } from '../lib/supabase';

interface Automatizacion {
  automation_name: string;
  open_rate: number;
  aperturas_unicas: number;
  clicks_unicos: number;
  emails_entregados: number;
  ctr: number;
  ctor: number;
  bounce_rate: number;
  [key: string]: string | number;
}

interface AutomatizacionesTableProps {
  searchTerm: string;
  selectedColumns: string[];
  filterCriteria: { [key: string]: string };
}

export default function AutomatizacionesTable({ searchTerm, selectedColumns, filterCriteria }: AutomatizacionesTableProps) {
  const { client } = useClient();
  const [automatizaciones, setAutomatizaciones] = useState<Automatizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAutomatizaciones, setTotalAutomatizaciones] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const AUTOMATIZACIONES_PER_PAGE = 10;

  useEffect(() => {
    async function fetchAutomatizaciones() {
      if (!client) {
        setAutomatizaciones([]);
        setLoading(false);
        return;
      }
      try {
        if (!supabase) {
          throw new Error('Supabase no está configurado');
        }
        const from = (currentPage - 1) * AUTOMATIZACIONES_PER_PAGE;
        const to = from + AUTOMATIZACIONES_PER_PAGE - 1;
        let query = supabase.from('all_automations').select(
          'automation_name,open_rate,aperturas_unicas,clicks_unicos,emails_entregados,ctr,ctor,bounce_rate',
          { count: 'exact' }
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
        if (sortColumn && ['aperturas_unicas', 'clicks_unicos', 'emails_entregados'].includes(sortColumn)) {
          query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
        }
        const { data, error, count } = await query.range(from, to);
        if (error) {
          throw error;
        }
        setAutomatizaciones(data || []);
        setTotalAutomatizaciones(count || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAutomatizaciones();
  }, [client, currentPage, searchTerm, filterCriteria.startDate, filterCriteria.endDate, sortColumn, sortDirection]);

  const totalPages = Math.ceil(totalAutomatizaciones / AUTOMATIZACIONES_PER_PAGE);
  const handlePageChange = (page: number) => setCurrentPage(page);
  const pageWindowSize = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pageWindowSize / 2));
  const endPage = Math.min(totalPages, startPage + pageWindowSize - 1);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const allColumnsDefinition = [
    { key: 'automation_name', name: 'Automatización' },
    { key: 'open_rate', name: 'Open Rate' },
    { key: 'aperturas_unicas', name: 'Aperturas únicas' },
    { key: 'clicks_unicos', name: 'Clicks únicos' },
    { key: 'emails_entregados', name: 'Entregados' },
    { key: 'ctr', name: 'CTR' },
    { key: 'ctor', name: 'CTOR' },
    { key: 'bounce_rate', name: 'Tasa de Rebote' },
  ];
  const getColumnName = (key: string) => {
    const column = allColumnsDefinition.find(col => col.key === key);
    return column ? column.name : key;
  };

  const handleSort = (column: string) => {
    if (!['aperturas_unicas', 'clicks_unicos', 'emails_entregados'].includes(column)) return;
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (column: string) => {
    if (!['aperturas_unicas', 'clicks_unicos', 'emails_entregados'].includes(column)) return '';
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  if (!client) {
    return <div className="text-white text-center mt-4"><p>Seleccioná un cliente para ver sus automatizaciones.</p></div>;
  }
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
  }
  if (error) {
    return <div className="text-danger text-center mt-4"><p>Error al cargar las automatizaciones: {error}</p></div>;
  }
  return (
    <div className="mt-4">
      {automatizaciones.length === 0 && !loading && !error ? (
        <div className="text-white text-center"><p>No hay automatizaciones disponibles para este cliente.</p></div>
      ) : (
        <div className="rounded-lg" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}}>
          <table className="table table-dark custom-table-rounded" style={{ backgroundColor: 'transparent', width: '100%' }}>
            <thead>
              <tr>
                {selectedColumns.map(columnKey => (
                  <th
                    key={columnKey}
                    onClick={() => handleSort(columnKey)}
                    style={{ cursor: ['aperturas_unicas', 'clicks_unicos', 'emails_entregados'].includes(columnKey) ? 'pointer' : 'default' }}
                  >
                    {getColumnName(columnKey)}{getSortIndicator(columnKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {automatizaciones.map((auto, index) => (
              <tr key={index}>
                {selectedColumns.map(columnKey => {
                  let displayValue = auto[columnKey as keyof Automatizacion];
                  if (['open_rate','ctr','ctor','bounce_rate'].includes(columnKey)) {
                    displayValue = `${(displayValue as number ?? 0).toFixed(2)}%`;
                  }
                  return <td key={columnKey}>{displayValue}</td>;
                })}
              </tr>
            ))}
            </tbody>
          </table>
          <nav>
            <ul className="pagination justify-content-center custom-pagination mt-3">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
              </li>
              {startPage > 1 && (<li className="page-item disabled"><span className="page-link">...</span></li>)}
              {pageNumbers.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageNumber)}>{pageNumber}</button>
                </li>
              ))}
              {endPage < totalPages && (<li className="page-item disabled"><span className="page-link">...</span></li>)}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente</button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
} 