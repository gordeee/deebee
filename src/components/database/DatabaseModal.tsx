import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { DatabaseIcon, KeyIcon, ServerIcon, UserIcon } from 'lucide-react'

interface DatabaseModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (details: DatabaseConnectionDetails) => void
}

interface DatabaseConnectionDetails {
  host: string
  port: string
  database: string
  username: string
  password: string
  useSSH: boolean
  sshHost?: string
  sshUsername?: string
  sshKeyPath?: string
}

export function DatabaseModal({ isOpen, onClose, onConnect }: DatabaseModalProps) {
  const [connectionDetails, setConnectionDetails] = useState<DatabaseConnectionDetails>({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    useSSH: false,
    sshHost: '',
    sshUsername: process.env.USER || '',
    sshKeyPath: '~/.ssh/id_rsa'
  })

  const handleInputChange = (field: keyof DatabaseConnectionDetails) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectionDetails((prev) => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConnect(connectionDetails)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            Connect to Database
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="localhost"
                value={connectionDetails.host}
                onChange={handleInputChange('host')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="5432"
                value={connectionDetails.port}
                onChange={handleInputChange('port')}
                required
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="database">Database Name</Label>
            <Input
              id="database"
              placeholder="my_database"
              value={connectionDetails.database}
              onChange={handleInputChange('database')}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="postgres"
                value={connectionDetails.username}
                onChange={handleInputChange('username')}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={connectionDetails.password}
                onChange={handleInputChange('password')}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useSSH"
                checked={connectionDetails.useSSH}
                onCheckedChange={(checked) =>
                  setConnectionDetails((prev) => ({ ...prev, useSSH: checked === true }))
                }
              />
              <Label htmlFor="useSSH">Use SSH Tunnel</Label>
            </div>

            {connectionDetails.useSSH && (
              <div className="space-y-4 rounded-md bg-secondary/20 p-4">
                <div className="space-y-2">
                  <Label htmlFor="sshHost">SSH Host</Label>
                  <Input
                    id="sshHost"
                    placeholder="bastion.example.com"
                    value={connectionDetails.sshHost}
                    onChange={handleInputChange('sshHost')}
                    required={connectionDetails.useSSH}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sshUsername">SSH Username</Label>
                    <Input
                      id="sshUsername"
                      placeholder={process.env.USER}
                      value={connectionDetails.sshUsername}
                      onChange={handleInputChange('sshUsername')}
                      required={connectionDetails.useSSH}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sshKeyPath">SSH Key Path</Label>
                    <Input
                      id="sshKeyPath"
                      placeholder="~/.ssh/id_rsa"
                      value={connectionDetails.sshKeyPath}
                      onChange={handleInputChange('sshKeyPath')}
                      required={connectionDetails.useSSH}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Connect</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 