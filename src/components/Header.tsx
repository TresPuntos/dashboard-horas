import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { cn } from '../lib/utils';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'overview', label: 'Resumen' },
    { id: 'tasks', label: 'Tareas' },
    { id: 'settings', label: 'Configuración' },
  ];

  return (
    <header className="border-b bg-white dark:bg-[#111111] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-gray-900 dark:text-gray-50">ACME Corp.</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Dashboard de Horas • 
                <span className="text-primary ml-1">Tres Puntos Comunicación</span>
              </p>
            </div>
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
