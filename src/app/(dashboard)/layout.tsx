'use client';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AuthGuard from '@/components/auth/AuthGuard';
import ChatBot from '@/components/dashboard/ChatBot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="dashboard-container">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="main-content" style={{ 
          transition: 'all 0.3s ease',
          marginLeft: 0
        }}>
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <div className="content-area">
            {children}
          </div>
        </main>
        <ChatBot />
      </div>
    </AuthGuard>
  );
}

