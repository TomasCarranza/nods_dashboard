import React, { useState, useEffect } from 'react';
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
}

const CAMPAIGNS_PER_PAGE = 20;

export default function CampaniasTable({ searchTerm }: CampaniasTableProps) {
  const { client } = useClient();
  const [campaigns, setCampaigns] = useState<Campania[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCampaigns, setTotalCampaigns] = useState<number>(0);
  const [sortColumn, setSortColumn] = useState<keyof Campania | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      if (!client) {
        setCampaigns([]);
        setLoading(false);
        setError(null);
        setTotalCampaigns(0);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const from = (currentPage - 1) * CAMPAIGNS_PER_PAGE;
        const to = from + CAMPAIGNS_PER_PAGE - 1;

        let query = supabase.from('all_campaigns').select(
          'fecha_envio,campaign_name,remitente,asunto,emails_entregados,aperturas_unicas,clicks_unicos,rebotes_total,rebotes_duros,rebotes_suaves,open_rate,ctr,ctor',
          { count: 'exact' }
        ).eq('cliente_id', client);

        // Aplicar filtro de búsqueda si existe
        if (searchTerm) {
          query = query.ilike('campaign_name', `%${searchTerm}%`);
        }

        // Apply sorting
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
  }, [client, currentPage, sortColumn, sortDirection, searchTerm]);

  const handleSort = (column: keyof Campania) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const getSortIndicator = (column: keyof Campania) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  const totalPages = Math.ceil(totalCampaigns / CAMPAIGNS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <div className="text-white text-center mt-4">
        <p>Cargando campañas...</p>
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
                {/* Headers with sort */} 
                <th onClick={() => handleSort('fecha_envio')} style={{ cursor: 'pointer' }}>Fecha de Envío{getSortIndicator('fecha_envio')}</th>
                <th onClick={() => handleSort('campaign_name')} style={{ cursor: 'pointer' }}>Nombre de Campaña{getSortIndicator('campaign_name')}</th>
                <th onClick={() => handleSort('remitente')} style={{ cursor: 'pointer' }}>Remitente{getSortIndicator('remitente')}</th>
                <th onClick={() => handleSort('asunto')} style={{ cursor: 'pointer' }}>Asunto{getSortIndicator('asunto')}</th>
                <th onClick={() => handleSort('emails_entregados')} style={{ cursor: 'pointer' }}>Emails Entregados{getSortIndicator('emails_entregados')}</th>
                <th onClick={() => handleSort('aperturas_unicas')} style={{ cursor: 'pointer' }}>Aperturas Únicas{getSortIndicator('aperturas_unicas')}</th>
                <th onClick={() => handleSort('clicks_unicos')} style={{ cursor: 'pointer' }}>Clicks Únicos{getSortIndicator('clicks_unicos')}</th>
                <th onClick={() => handleSort('rebotes_total')} style={{ cursor: 'pointer' }}>Rebotes Total{getSortIndicator('rebotes_total')}</th>
                <th onClick={() => handleSort('rebotes_duros')} style={{ cursor: 'pointer' }}>Rebotes Duros{getSortIndicator('rebotes_duros')}</th>
                <th onClick={() => handleSort('rebotes_suaves')} style={{ cursor: 'pointer' }}>Rebotes Suaves{getSortIndicator('rebotes_suaves')}</th>
                <th>Open Rate</th>
                <th>CTR</th>
                <th>CTOR</th>
              </tr>
            </thead>
            <tbody>
            {campaigns.map((campania, index) => (
  <tr key={index}>
    <td>{campania.fecha_envio}</td>
    <td>{campania.campaign_name}</td>
    <td>{campania.remitente}</td>
    <td>{campania.asunto}</td>
    <td>{campania.emails_entregados}</td>
    <td>{campania.aperturas_unicas}</td>
    <td>{campania.clicks_unicos}</td>
    <td>{campania.rebotes_total}</td>
    <td>{campania.rebotes_duros}</td>
    <td>{campania.rebotes_suaves}</td>
    <td>{(campania.open_rate ?? 0).toFixed(2)}%</td> 
    <td>{(campania.ctr ?? 0).toFixed(2)}%</td>
    <td>{(campania.ctor ?? 0).toFixed(2)}%</td>
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
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
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