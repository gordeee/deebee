import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Checkbox } from '../ui/Checkbox';
import { SSHTunnelInstructions } from './SSHTunnelInstructions';
import { Database, Shield, X } from 'lucide-react';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connectionDetails: DatabaseConnectionDetails) => void;
}

export interface DatabaseConnectionDetails {
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  useSSH: boolean;
  sshHost?: string;
  sshUsername?: string;
  privateKey?: string;
  localPort?: string;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [connectionDetails, setConnectionDetails] = useState<DatabaseConnectionDetails>({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    useSSH: false,
    sshHost: '',
    sshUsername: 'deebeee',
    privateKey: '',
    localPort: '15432',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(connectionDetails);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConnectionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setConnectionDetails((prev) => ({
      ...prev,
      useSSH: checked,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-[#0D1117] border-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl font-semibold">SSH tunnel configuration</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="sshHost" className="text-base font-normal">Bastion host public IP or hostname</Label>
            <Input
              id="sshHost"
              name="sshHost"
              value={connectionDetails.sshHost}
              onChange={handleInputChange}
              placeholder="bastion.example.com"
              required={connectionDetails.useSSH}
              className="bg-[#1C2128] border-gray-800 focus:border-primary focus:ring-0 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sshUsername" className="text-base font-normal">SSH username (deebeee)</Label>
            <Input
              id="sshUsername"
              name="sshUsername"
              value={connectionDetails.sshUsername}
              onChange={handleInputChange}
              placeholder="deebeee"
              required={connectionDetails.useSSH}
              className="bg-[#1C2128] border-gray-800 focus:border-primary focus:ring-0 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey" className="text-base font-normal">Private key</Label>
            <textarea
              id="privateKey"
              name="privateKey"
              value={connectionDetails.privateKey}
              onChange={handleInputChange}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
              required={connectionDetails.useSSH}
              rows={6}
              className="w-full rounded-md bg-[#1C2128] border border-gray-800 focus:border-primary focus:ring-0 text-base p-3 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localPort" className="text-base font-normal">Local port (15432)</Label>
            <Input
              id="localPort"
              name="localPort"
              value={connectionDetails.localPort}
              onChange={handleInputChange}
              type="number"
              min="1024"
              max="65535"
              required={connectionDetails.useSSH}
              className="bg-[#1C2128] border-gray-800 focus:border-primary focus:ring-0 text-base"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              className="text-base border-gray-800 hover:bg-[#1C2128] hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="text-base bg-[#8957E5] hover:bg-[#8957E5]/90 text-white"
            >
              Setup Tunnel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 