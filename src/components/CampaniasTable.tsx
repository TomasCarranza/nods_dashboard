import { useState, useEffect } from 'react';
import { useClient } from '../context/ClientContext';
import { supabase } from '../lib/supabase';

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

interface CampaniasTableProps {
  searchTerm: string;
  selectedColumns: string[];
  filterCriteria: { [key: string]: string };
  isGrupoFilterActive: boolean;
}

export default function CampaniasTable({ searchTerm, selectedColumns, filterCriteria, isGrupoFilterActive }: CampaniasTableProps) {
  const { client, selectedRemitente } = useClient();
  const [campaigns, setCampaigns] = useState<Campania[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [sortColumn, setSortColumn] = useState<keyof Campania | null>('fecha_envio');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('desc');

  const CAMPAIGNS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchCampaigns() {
      if (!client) {
        setCampaigns([]);
        setLoading(false);
        return;
      }

      try {
        if (!supabase) {
          throw new Error('Supabase no está configurado');
        }

        const from = (currentPage - 1) * CAMPAIGNS_PER_PAGE;
        const to = from + CAMPAIGNS_PER_PAGE - 1;

        let query = supabase.from('all_campaigns').select(
          'fecha_envio,campaign_name,remitente,asunto,emails_entregados,aperturas_unicas,clicks_unicos,rebotes_total,rebotes_duros,rebotes_suaves,open_rate,ctr,ctor',
          { count: 'exact' }
        ).eq('cliente_id', client);

        if (client === 'cesa' && selectedRemitente === 'cesa_servicios') {
          query = query.in('remitente', ['experiencia.luna@cesa.edu.co', 'experiencia.cesa@cesa.edu.co']);
        } else if (selectedRemitente) {
          query = query.eq('remitente', selectedRemitente);
        }

        if (searchTerm) {
          query = query.ilike('campaign_name', `%${searchTerm}%`);
        }

        if (isGrupoFilterActive) {
          query = query.ilike('campaign_name', `%Grupo%`);
        }

        if (filterCriteria.startDate) {
          query = query.gte('fecha_envio', filterCriteria.startDate);
        }
        if (filterCriteria.endDate) {
          query = query.lte('fecha_envio', filterCriteria.endDate + 'T23:59:59.999Z');
        }

        if (sortColumn && sortDirection) {
          query = query.order(sortColumn as string, { ascending: sortDirection === 'asc' });
        }

        const { data, error, count } = await query.range(from, to);

        if (error) {
          throw error;
        }
        setCampaigns(data || []);
        setTotalCampaigns(count || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, [client, currentPage, sortColumn, sortDirection, searchTerm, filterCriteria.startDate, filterCriteria.endDate, selectedRemitente, isGrupoFilterActive]);

  const handleSort = (column: keyof Campania) => {
    if (column === 'open_rate' || column === 'ctr' || column === 'ctor') {
      return;
    }

    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIndicator = (column: keyof Campania) => {
    if (column === 'open_rate' || column === 'ctr' || column === 'ctor') {
      return '';
    }

    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  const totalPages = Math.ceil(totalCampaigns / CAMPAIGNS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const pageWindowSize = 5; // Cantidad de botones de paginación a mostrar
  const startPage = Math.max(1, currentPage - Math.floor(pageWindowSize / 2));
  const endPage = Math.min(totalPages, startPage + pageWindowSize - 1);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const allColumnsDefinition = [
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

  const getColumnName = (key: string) => {
    const column = allColumnsDefinition.find(col => col.key === key);
    return column ? column.name : key;
  };

  if (!client) {
    return (
      <div className="text-white text-center mt-4">
        <p>Seleccioná un cliente para ver sus campañas.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center mt-4">
        <p>Error al cargar las campañas: {error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {campaigns.length === 0 && !loading && !error ? (
        <div className="text-white text-center">
          <p>No hay campañas disponibles para este cliente.</p>
        </div>
      ) : (
        <div className="rounded-lg" style={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}}>
          <table className="table table-dark custom-table-rounded" style={{ backgroundColor: 'transparent', width: '100%' }}>
            <thead>
              <tr>
                {selectedColumns.map(columnKey => (
                  <th
                    key={columnKey}
                    onClick={() => handleSort(columnKey as keyof Campania)}
                    style={{ 
                      cursor: columnKey === 'open_rate' || columnKey === 'ctr' || columnKey === 'ctor' ? 'default' : 'pointer'
                    }}
                  >
                    {getColumnName(columnKey)}{getSortIndicator(columnKey as keyof Campania)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            {campaigns.map((campania, index) => (
              <tr key={index}>
                {selectedColumns.map(columnKey => {
                  let displayValue = campania[columnKey as keyof Campania];
                  if (columnKey === 'open_rate' || columnKey === 'ctr' || columnKey === 'ctor') {
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
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Anterior
                </button>
              </li>
              {startPage > 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              {pageNumbers.map((pageNumber) => (
                <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                  </button>
                </li>
              ))}
              {endPage < totalPages && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
} 