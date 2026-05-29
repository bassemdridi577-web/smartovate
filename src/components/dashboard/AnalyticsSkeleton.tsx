'use client';

export default function AnalyticsSkeleton() {
  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="skeleton" style={{ width: '250px', height: '2.5rem', marginBottom: '0.5rem' }}></div>
          <div className="skeleton" style={{ width: '350px', height: '1rem' }}></div>
        </div>
        <div className="skeleton" style={{ width: '120px', height: '2.5rem', borderRadius: '0.5rem' }}></div>
      </div>

      {/* Main Charts Grid Skeleton */}
      <div className="grid-layout" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ height: '450px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div className="skeleton" style={{ width: '180px', height: '1.5rem' }}></div>
            <div className="skeleton" style={{ width: '80px', height: '1.5rem', borderRadius: '1rem' }}></div>
          </div>
          <div className="skeleton" style={{ width: '100%', height: '350px' }}></div>
        </div>

        <div className="glass-card" style={{ height: '450px' }}>
          <div className="skeleton" style={{ width: '180px', height: '1.5rem', marginBottom: '2rem' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '350px' }}></div>
        </div>
      </div>

      {/* Large Heatmap Skeleton */}
      <div className="glass-card" style={{ height: '400px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: '220px', height: '1.5rem' }}></div>
          <div className="skeleton" style={{ width: '150px', height: '1rem' }}></div>
        </div>
        <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
      </div>
    </div>
  );
}
