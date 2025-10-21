import React, { useState } from 'react';
import { ThemeProvider } from './lib/theme';
import { Header } from './components/Header';
import { PackageFilterBar } from './components/PackageFilterBar';
import { ShareDialog } from './components/ShareDialog';
import { PackageOverview } from './pages/PackageOverview';
import { PackageTasksList } from './pages/PackageTasksList';
import { SettingsPage } from './pages/SettingsPage';
import { Toaster } from './components/ui/sonner';
import { mockPackageData } from './lib/packageMockData';
import { toast } from 'sonner@2.0.3';

type Page = 'overview' | 'tasks' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { packages } = mockPackageData;
  const activePackage = packages.find(p => p.status === 'active');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handlePackageChange = (packageId: string) => {
    setSelectedPackageId(packageId);
  };

  const handleExport = () => {
    const pkg = selectedPackageId
      ? packages.find(p => p.id === selectedPackageId)
      : activePackage;
    
    toast.success('Exportando datos...', {
      description: `Generando reporte del paquete ${pkg?.id}`,
    });
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  // Reset to active package when going to overview
  const handleNavigateToOverview = () => {
    setCurrentPage('overview');
    setSelectedPackageId(undefined);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#111111]">
        <Header 
          currentPage={currentPage} 
          onNavigate={(page) => {
            if (page === 'overview') {
              handleNavigateToOverview();
            } else {
              handleNavigate(page);
            }
          }} 
        />
        
        <main className="pb-8">
          {currentPage === 'tasks' && (
            <PackageFilterBar
              selectedPackageId={selectedPackageId}
              onPackageChange={handlePackageChange}
              onExport={handleExport}
              onShare={handleShare}
            />
          )}

          <div className="container mx-auto px-4 py-8">
            {currentPage === 'overview' && (
              <PackageOverview />
            )}

            {currentPage === 'tasks' && (
              <PackageTasksList selectedPackageId={selectedPackageId} />
            )}

            {currentPage === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </main>

        <footer className="border-t mt-12 py-6 bg-white dark:bg-[#111111]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 dark:text-gray-400">
                <p>
                  Última actualización: {new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                  })}
                </p>
                <p className="mt-1">
                  Paquete activo: <span className="text-primary">{activePackage?.id}</span>
                </p>
              </div>
              <div className="text-gray-400 text-center md:text-right">
                <p className="text-primary">Tres Puntos Comunicación</p>
                <p className="mt-1">Dashboard de Horas v2.0</p>
              </div>
            </div>
          </div>
        </footer>

        <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
