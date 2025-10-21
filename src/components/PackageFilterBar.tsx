import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Share2, Package } from 'lucide-react';
import { mockPackageData } from '../lib/packageMockData';

interface PackageFilterBarProps {
  selectedPackageId?: string;
  onPackageChange: (packageId: string) => void;
  onExport?: () => void;
  onShare?: () => void;
}

export function PackageFilterBar({
  selectedPackageId,
  onPackageChange,
  onExport,
  onShare,
}: PackageFilterBarProps) {
  const { packages } = mockPackageData;
  const activePackage = packages.find(p => p.status === 'active');
  const currentPackage = selectedPackageId
    ? packages.find(p => p.id === selectedPackageId)
    : activePackage;

  return (
    <div className="bg-white dark:bg-[#111111] border-b sticky top-[73px] z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="text-gray-900 dark:text-gray-50">Paquete:</span>
            </div>
            
            <Select
              value={currentPackage?.id}
              onValueChange={onPackageChange}
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Seleccionar paquete" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    <div className="flex items-center gap-2">
                      <span>{pkg.id}</span>
                      {pkg.status === 'active' && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Activo</Badge>
                      )}
                      {pkg.status === 'completed' && (
                        <Badge variant="secondary" className="text-xs">Completado</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {currentPackage && (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total: </span>
                  <span className="text-gray-900 dark:text-gray-50">
                    {currentPackage.totalHours.toFixed(0)}h
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Consumido: </span>
                  <span className="text-primary">
                    {currentPackage.consumedHours.toFixed(1)}h
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Disponible: </span>
                  <span className="text-green-600 dark:text-green-500">
                    {(currentPackage.totalHours - currentPackage.consumedHours).toFixed(1)}h
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            )}
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
