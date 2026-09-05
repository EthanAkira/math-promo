'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useLanguage } from '../language';
import { tr } from '../i18n';

function formatLabel(value) {
  return String(value || '')
    .replace(/[-_:]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DashboardClient() {
  const { language } = useLanguage();
  const { user, status } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch('/api/dashboard/stats')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setStats(data.stats || []);
      })
      .catch(() => {
        if (!cancelled) setStats([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (status === 'loading') {
    return <p className="dashboard-status">{tr(language, 'dashboardLoading')}</p>;
  }

  if (!user) {
    return (
      <div className="academic-section-card dashboard-card">
        <h2 className="section-main-title">{tr(language, 'dashboardNeedLoginTitle')}</h2>
        <p>{tr(language, 'dashboardNeedLoginDesc')}</p>
      </div>
    );
  }

  return (
    <div className="academic-section-card dashboard-card">
      <div className="section-title-wrap">
        <span className="section-kicker">MY DASHBOARD</span>
        <h1 className="section-main-title">{tr(language, 'dashboardTitle')}</h1>
        <p>{tr(language, 'dashboardDesc')}</p>
        <p style={{ fontSize: 13, color: 'var(--red-pen)', margin: '4px 0 0' }}>{tr(language, 'dashboardPrivacyNotice')}</p>
      </div>

      {loading ? (
        <p className="dashboard-status">{tr(language, 'dashboardLoading')}</p>
      ) : stats && stats.length > 0 ? (
        <div className="dashboard-stats-list">
          {stats.map((row) => (
            <div className="dashboard-stat-row" key={`${row.grade}:${row.unit}`}>
              <div className="dashboard-stat-info">
                <strong>{formatLabel(row.unit)}</strong>
                <span>{formatLabel(row.grade)} · {tr(language, 'dashboardTotal')} {row.total}</span>
              </div>
              <div className="dashboard-stat-bar">
                <div className="dashboard-stat-bar-fill" style={{ width: `${row.accuracy}%` }} />
              </div>
              <div className="dashboard-stat-accuracy">{row.accuracy}%</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard-status">{tr(language, 'dashboardEmpty')}</p>
      )}
    </div>
  );
}
