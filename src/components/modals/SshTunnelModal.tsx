import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Shield } from 'lucide-react';

interface SshTunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: (config: SshTunnelConfig) => void;
}

interface SshTunnelConfig {
  host: string;
  username: string;
  privateKeyPath: string;
  localPort: string;
}

export const SshTunnelModal: React.FC<SshTunnelModalProps> = ({
  isOpen,
  onClose,
  onSetup,
}) => {
  const [config, setConfig] = useState<SshTunnelConfig>({
    host: '',
    username: 'deebee',
    privateKeyPath: '~/.ssh/id_rsa',
    localPort: '15432',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetup(config);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold">SSH Tunnel Setup</DialogTitle>
          </div>
          <p className="text-sm text-gray-400">
            Configure a secure SSH tunnel to connect to your database without exposing it to the internet.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="host">Bastion Host</Label>
            <Input
              id="host"
              name="host"
              value={config.host}
              onChange={handleInputChange}
              placeholder="example.com or 203.0.113.1"
              required
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">SSH Username</Label>
            <Input
              id="username"
              name="username"
              value={config.username}
              onChange={handleInputChange}
              placeholder="deebee"
              required
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKeyPath">Private Key Path</Label>
            <Input
              id="privateKeyPath"
              name="privateKeyPath"
              value={config.privateKeyPath}
              onChange={handleInputChange}
              placeholder="~/.ssh/id_rsa"
              required
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localPort">Local Port</Label>
            <Input
              id="localPort"
              name="localPort"
              value={config.localPort}
              onChange={handleInputChange}
              placeholder="15432"
              type="number"
              min="1024"
              max="65535"
              required
              className="focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-gray-500">Port to forward the database connection to (1024-65535)</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Setup Tunnel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SshTunnelModal; 