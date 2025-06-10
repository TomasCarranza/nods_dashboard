// src/components/LineChart.tsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { supabase } from '../lib/supabaseClient';
import BigNumber from 'bignumber.js';
import { useClient } from '../context/ClientContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricData {
  timestamp: string;
  sent: number;
  opened: number;
  clicked: number;
}

interface CampaignData {
  'fecha_envio': string;
  'emails_enviados': number;
  'aperturas_unicas': number;
  'clicks_unicos': number;
}

const LineChart: React.FC = () => {
  const { client, selectedRemitente } = useClient();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedMetrics, setSelectedMetrics] = useState<{
    sent: boolean;
    opened: boolean;
    clicked: boolean;
  }>({
    sent: true,
    opened: true,
    clicked: true,
  });
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!client) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const now = new Date();
        const startDate = new Date();
        
        // Calcular la fecha de inicio según el rango seleccionado
        switch (timeRange) {
          case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
        }

        let query = supabase
          .from('all_campaigns')
          .select('fecha_envio, emails_enviados, aperturas_unicas, clicks_unicos')
          .eq('cliente_id', client)
          .gte('fecha_envio', startDate.toISOString())
          .lte('fecha_envio', now.toISOString())
          .order('fecha_envio', { ascending: true });

        if (selectedRemitente) {
          query = query.eq('remitente', selectedRemitente);
        }

        const { data: clientData, error: supabaseError } = await query;

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!clientData || clientData.length === 0) {
          setData([]);
          return;
        }

        // Agrupar datos por fecha
        const groupedData = (clientData as CampaignData[]).reduce((acc: { [key: string]: { timestamp: string; sent: BigNumber; opened: BigNumber; clicked: BigNumber } }, curr) => {
          const date = new Date(curr['fecha_envio']).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              timestamp: date,
              sent: new BigNumber(0),
              opened: new BigNumber(0),
              clicked: new BigNumber(0)
            };
          }
          acc[date].sent = acc[date].sent.plus(curr['emails_enviados'] || 0);
          acc[date].opened = acc[date].opened.plus(curr['aperturas_unicas'] || 0);
          acc[date].clicked = acc[date].clicked.plus(curr['clicks_unicos'] || 0);
          return acc;
        }, {});

        // Convertir el objeto agrupado a array
        const formattedData = Object.values(groupedData).map(item => ({
          timestamp: item.timestamp,
          sent: item.sent.toNumber(),
          opened: item.opened.toNumber(),
          clicked: item.clicked.toNumber(),
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, client, selectedRemitente]);

  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit'})),
    datasets: [
      {
        label: 'Enviados',
        data: data.map(item => item.sent),
        borderColor: 'rgb(13, 110, 253)',
        backgroundColor: 'rgba(13, 110, 253, 0.5)',
        hidden: !selectedMetrics.sent,
      },
      {
        label: 'Aperturas',
        data: data.map(item => item.opened),
        borderColor: 'rgb(25, 135, 84)',
        backgroundColor: 'rgba(25, 135, 84, 0.5)',
        hidden: !selectedMetrics.opened,
      },
      {
        label: 'Clics',
        data: data.map(item => item.clicked),
        borderColor: 'rgb(13, 202, 240)',
        backgroundColor: 'rgba(13, 202, 240, 0.5)',
        hidden: !selectedMetrics.clicked,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric],
    }));
  };

  return (
    <div className="h-100">
      {!client ? (
        <div className="text-white text-center">
          <p>Seleccioná un cliente para ver sus estadísticas.</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3">
              <button 
                className={`btn btn-outline-light btn-sm ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 días
              </button>
              <button 
                className={`btn btn-outline-light btn-sm ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 días
              </button>
              <button 
                className={`btn btn-outline-light btn-sm ${timeRange === '90d' ? 'active' : ''}`}
                onClick={() => setTimeRange('90d')}
              >
                90 días
              </button>
            </div>
            <div className="d-flex gap-2">
              <span 
                className={`badge ${selectedMetrics.sent ? 'bg-primary' : 'bg-secondary'} cursor-pointer`}
                onClick={() => toggleMetric('sent')}
                style={{ cursor: 'pointer' }}
              >
                Enviados
              </span>
              <span 
                className={`badge ${selectedMetrics.opened ? 'bg-success' : 'bg-secondary'} cursor-pointer`}
                onClick={() => toggleMetric('opened')}
                style={{ cursor: 'pointer' }}
              >
                Aperturas
              </span>
              <span 
                className={`badge ${selectedMetrics.clicked ? 'bg-info' : 'bg-secondary'} cursor-pointer`}
                onClick={() => toggleMetric('clicked')}
                style={{ cursor: 'pointer' }}
              >
                Clics
              </span>
            </div>
          </div>
          <div 
            style={{ 
              height: '300px', 
              background: 'linear-gradient(180deg, rgba(25, 70, 227, 0.1) 0%, rgba(25, 70, 227, 0) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(25, 70, 227, 0.2)',
              padding: '20px'
            }}
          >
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : error ? (
              <div className="d-flex justify-content-center align-items-center h-100 text-danger">
                {error}
              </div>
            ) : data.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                No hay datos disponibles para el período seleccionado
              </div>
            ) : (
              <Line data={chartData} options={options} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LineChart;