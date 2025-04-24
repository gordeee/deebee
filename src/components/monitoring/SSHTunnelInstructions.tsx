import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { Terminal, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

export const SSHTunnelInstructions: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-white">SSH Tunnel Setup Guide</h2>
      </div>

      <p className="text-sm text-gray-400 bg-gray-900/50 p-4 rounded-lg">
        This guide will help you set up a secure SSH tunnel between your network and DeeBee.
        The tunnel ensures your database is never directly exposed to the internet.
      </p>

      <div className="space-y-6">
        <section>
          <h3 className="text-md font-medium text-white mb-3">Prerequisites</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
            <li>A Linux bastion host with a public IP</li>
            <li>SSH access to the bastion host</li>
            <li>Network access from bastion to your database</li>
            <li>Read-only database user credentials</li>
          </ul>
        </section>

        <section>
          <h3 className="text-md font-medium text-white mb-3">1. Create DeeBee User</h3>
          <p className="text-sm text-gray-400 mb-2">
            On your bastion host, create a dedicated non-privileged user for DeeBee:
          </p>
          <div className="relative">
            <pre className="bg-gray-900 p-4 rounded-md text-xs text-gray-300 font-mono">
{`adduser deebee
mkdir /home/deebee/.ssh
chmod 700 /home/deebee/.ssh
touch /home/deebee/.ssh/authorized_keys
chmod 600 /home/deebee/.ssh/authorized_keys
chown -R deebee:deebee /home/deebee/.ssh`}
            </pre>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => copyToClipboard(`adduser deebee
mkdir /home/deebee/.ssh
chmod 700 /home/deebee/.ssh
touch /home/deebee/.ssh/authorized_keys
chmod 600 /home/deebee/.ssh/authorized_keys
chown -R deebee:deebee /home/deebee/.ssh`)}
            >
              <Terminal className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </section>

        <section>
          <h3 className="text-md font-medium text-white mb-3">2. Configure SSH Access</h3>
          <p className="text-sm text-gray-400 mb-2">
            Add these lines to <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">/etc/ssh/sshd_config</code>:
          </p>
          <div className="relative">
            <pre className="bg-gray-900 p-4 rounded-md text-xs text-gray-300 font-mono">
{`PermitRootLogin no
PasswordAuthentication no
AllowUsers deebee`}
            </pre>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => copyToClipboard(`PermitRootLogin no
PasswordAuthentication no
AllowUsers deebee`)}
            >
              <Terminal className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Then reload SSH: <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">sudo systemctl reload sshd</code>
          </p>
        </section>

        <section>
          <h3 className="text-md font-medium text-white mb-3">3. Configure Network Rules</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-gray-300 pb-2">Resource</th>
                  <th className="text-left font-medium text-gray-300 pb-2">Allow From</th>
                  <th className="text-left font-medium text-gray-300 pb-2">Port</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr>
                  <td className="py-1">Bastion</td>
                  <td>DeeBee IP(s)</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td className="py-1">Database</td>
                  <td>Bastion's private IP</td>
                  <td>5432</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="text-md font-medium text-white mb-3">4. Create Read-only Database User</h3>
          <div className="relative">
            <pre className="bg-gray-900 p-4 rounded-md text-xs text-gray-300 font-mono">
{`CREATE ROLE deebee_ro NOINHERIT LOGIN PASSWORD 'your_password';
GRANT CONNECT ON DATABASE your_db TO deebee_ro;
GRANT USAGE ON SCHEMA public TO deebee_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO deebee_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO deebee_ro;`}
            </pre>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={() => copyToClipboard(`CREATE ROLE deebee_ro NOINHERIT LOGIN PASSWORD 'your_password';
GRANT CONNECT ON DATABASE your_db TO deebee_ro;
GRANT USAGE ON SCHEMA public TO deebee_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO deebee_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO deebee_ro;`)}
            >
              <Terminal className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </section>

        <section>
          <h3 className="text-md font-medium text-white mb-3">5. Complete Setup</h3>
          <p className="text-sm text-gray-400 mb-2">
            Once you've completed these steps, return to the SSH tunnel setup form and provide:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400">
            <li>Your bastion host's public IP or hostname</li>
            <li>The SSH username (deebee)</li>
            <li>The private key for authentication</li>
            <li>The local port for forwarding (default: 15432)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}; 