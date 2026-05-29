'use client';

export default function DashboardSkeleton() {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="skeleton" style={{ width: '200px', height: '2.5rem', marginBottom: '0.5rem' }}></div>
          <div className="skeleton" style={{ width: '300px', height: '1rem' }}></div>
        </div>
        <div className="skeleton" style={{ width: '120px', height: '2.5rem', borderRadius: '0.5rem' }}></div>
      </div>

      {/* Filters Skeleton */}
      <div className="glass-card" style={{ marginBottom: '2rem', height: '60px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: '100px', height: '1rem' }}></div>
        <div className="skeleton" style={{ width: '150px', height: '2rem' }}></div>
        <div className="skeleton" style={{ width: '150px', height: '2rem' }}></div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid-layout" style={{ marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card" style={{ height: '140px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: '1rem', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ width: '40%', height: '2rem', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ width: '50%', height: '0.75rem' }}></div>
              </div>
              <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '0.75rem' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ height: '400px' }}>
          <div className="skeleton" style={{ width: '150px', height: '1.25rem', marginBottom: '2rem' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
        </div>
        <div className="glass-card" style={{ height: '400px' }}>
          <div className="skeleton" style={{ width: '150px', height: '1.25rem', marginBottom: '2rem' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="glass-card" style={{ height: '300px' }}>
        <div className="skeleton" style={{ width: '200px', height: '1.25rem', marginBottom: '2rem' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', gap: '2rem' }}>
              <div className="skeleton" style={{ flex: 2, height: '1rem' }}></div>
              <div className="skeleton" style={{ flex: 1, height: '1rem' }}></div>
              <div className="skeleton" style={{ flex: 1, height: '1rem' }}></div>
              <div className="skeleton" style={{ flex: 1, height: '1rem' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
