import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Checkbox } from '../ui/Checkbox';
import { SSHTunnelInstructions } from './SSHTunnelInstructions';

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
  sshKeyPath?: string;
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
    sshUsername: '',
    sshKeyPath: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(connectionDetails);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to Database</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              name="host"
              value={connectionDetails.host}
              onChange={handleInputChange}
              placeholder="localhost"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              name="port"
              value={connectionDetails.port}
              onChange={handleInputChange}
              placeholder="5432"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="database">Database</Label>
            <Input
              id="database"
              name="database"
              value={connectionDetails.database}
              onChange={handleInputChange}
              placeholder="my_database"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={connectionDetails.username}
              onChange={handleInputChange}
              placeholder="postgres"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={connectionDetails.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="useSSH"
              checked={connectionDetails.useSSH}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="useSSH">Use SSH Tunnel</Label>
          </div>

          {connectionDetails.useSSH && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sshHost">SSH Host</Label>
                <Input
                  id="sshHost"
                  name="sshHost"
                  value={connectionDetails.sshHost}
                  onChange={handleInputChange}
                  placeholder="example.com"
                  required={connectionDetails.useSSH}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sshUsername">SSH Username</Label>
                <Input
                  id="sshUsername"
                  name="sshUsername"
                  value={connectionDetails.sshUsername}
                  onChange={handleInputChange}
                  placeholder="ubuntu"
                  required={connectionDetails.useSSH}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sshKeyPath">SSH Key Path</Label>
                <Input
                  id="sshKeyPath"
                  name="sshKeyPath"
                  value={connectionDetails.sshKeyPath}
                  onChange={handleInputChange}
                  placeholder="~/.ssh/id_rsa"
                  required={connectionDetails.useSSH}
                />
              </div>
              <SSHTunnelInstructions />
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Connect</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 