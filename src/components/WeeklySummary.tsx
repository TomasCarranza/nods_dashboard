// src/components/WeeklySummary.tsx
import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import { useClient } from '../context/ClientContext';
import { supabase } from '../lib/supabase';

interface WeeklyStats {
  emails_enviados: number;
  tasa_rebote: number;
  tasa_clics: number;
  tasa_apertura: number;
}

const WeeklySummary: React.FC = () => {
  const { client, selectedRemitente } = useClient();
  const [stats, setStats] = useState<WeeklyStats>({
    emails_enviados: 0,
    tasa_rebote: 0,
    tasa_clics: 0,
    tasa_apertura: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    async function fetchWeeklyStats() {
      if (!client) {
        setLoading(false);
        setHasData(false);
        setStats({
          emails_enviados: 0,
          tasa_rebote: 0,
          tasa_clics: 0,
          tasa_apertura: 0
        });
        return;
      }

      try {
        if (!supabase) {
          throw new Error('Supabase no está configurado');
        }
        // Calcular fecha de hace 7 días
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString();

        let query = supabase
          .from('all_campaigns')
          .select('emails_entregados, aperturas_unicas, clicks_unicos, rebotes_total')
          .eq('cliente_id', client)
          .gte('fecha_envio', sevenDaysAgoStr);

        if (selectedRemitente) {
          query = query.eq('remitente', selectedRemitente);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          const totalEmails = data.reduce((sum, row) => sum + (row.emails_entregados || 0), 0);
          const totalRebotes = data.reduce((sum, row) => sum + (row.rebotes_total || 0), 0);
          const totalClicks = data.reduce((sum, row) => sum + (row.clicks_unicos || 0), 0);
          const totalAperturas = data.reduce((sum, row) => sum + (row.aperturas_unicas || 0), 0);

          setStats({
            emails_enviados: totalEmails,
            tasa_rebote: totalEmails > 0 ? (totalRebotes / totalEmails) * 100 : 0,
            tasa_clics: totalEmails > 0 ? (totalClicks / totalEmails) * 100 : 0,
            tasa_apertura: totalEmails > 0 ? (totalAperturas / totalEmails) * 100 : 0
          });
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching weekly stats:', error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyStats();
  }, [client, selectedRemitente]);

  if (loading) {
    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="text-white text-center">Cargando estadísticas...</div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="row g-4">
        <div className="col-12">
          <div className="text-white text-center">
            <p>No hay campañas disponibles para este cliente en el resumen semanal.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-md-6">
        <SummaryCard 
          title="Emails enviados" 
          value={stats.emails_enviados.toLocaleString()} 
        />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard 
          title="Tasa de apertura (O.R)" 
          value={`${stats.tasa_apertura.toFixed(2)} %`} 
        />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard 
          title="Tasa de clics (CTR)" 
          value={`${stats.tasa_clics.toFixed(2)} %`} 
        />
      </div>
      <div className="col-12 col-md-6">
        <SummaryCard 
          title="Tasa de rebote (B.R)" 
          value={`${stats.tasa_rebote.toFixed(2)} %`} 
        />
      </div>
    </div>
  );
};

export default WeeklySummary;