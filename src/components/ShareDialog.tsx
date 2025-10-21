import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Copy, Check, QrCode, RotateCcw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [expiration, setExpiration] = useState('30');

  const shareUrl = 'https://dashboard.example.com/share/abc123def456';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Enlace copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    toast.success('El enlace compartido ha sido reiniciado');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Dashboard</DialogTitle>
          <DialogDescription>
            Crea un enlace público de solo lectura para compartir este dashboard con tu cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Share URL */}
          <div className="space-y-2">
            <Label>Enlace para compartir</Label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Password Protection */}
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label>Protección con contraseña</Label>
              <p className="text-gray-600 dark:text-gray-400">Requiere contraseña para acceder</p>
            </div>
            <Switch checked={passwordEnabled} onCheckedChange={setPasswordEnabled} />
          </div>

          {passwordEnabled && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa una contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {/* Expiration */}
          <div className="space-y-2">
            <Label>Expiración del enlace</Label>
            <Select value={expiration} onValueChange={setExpiration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 días</SelectItem>
                <SelectItem value="30">30 días</SelectItem>
                <SelectItem value="90">90 días</SelectItem>
                <SelectItem value="never">Nunca</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reiniciar Enlace
            </Button>
            <Button variant="outline" className="gap-2">
              <QrCode className="h-4 w-4" />
              Código QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
