import React from 'react';
import { Settings, Shield, Server, KeyRound, Globe, Database, CheckCircle2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export function AdminSettingsPage() {
  const envConfig = {
    apiBase: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'bid-compliance',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bid-compliance-frontend',
  };

  const services = [
    {
      name: 'Spring Boot Backend',
      port: '8080',
      description: 'Core REST APIs, JPA persistence, Spring Security & OAuth2 resource server',
      endpoint: '/api',
      status: 'Active',
    },
    {
      name: 'Keycloak OIDC Server',
      port: '8081',
      description: 'Central Identity Provider, PKCE authorization code grant, realm roles',
      endpoint: '/realms/bid-compliance',
      status: 'Active',
    },
    {
      name: 'Document Extraction Service',
      port: '8001',
      description: 'FastAPI microservice for OCR extraction and text parsing',
      endpoint: 'http://127.0.0.1:8001',
      status: 'Integrated',
    },
    {
      name: 'Verification Service',
      port: '9001',
      description: 'Statutory verification microservice for PAN, GSTIN, and Udyam MSME queries',
      endpoint: 'http://localhost:9001/api/verify',
      status: 'Integrated',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Configuration & Environment
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Enterprise endpoints, identity provider realm settings, and microservice topology
        </p>
      </div>

      {/* Identity & Access Configuration */}
      <Card>
        <CardHeader
          title="OIDC / Keycloak Identity Provider Settings"
          subtitle="Configured via environment variables for single sign-on"
          action={<Badge variant="brand" size="sm">Active Identity Realm</Badge>}
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-600" /> Keycloak Server URL
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 select-all">{envConfig.keycloakUrl}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-600" /> Realm Name
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 select-all">{envConfig.realm}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-600" /> Client ID
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 select-all">{envConfig.clientId}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-orange-600" /> API Base URL
              </span>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 select-all">{envConfig.apiBase}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Topology */}
      <Card>
        <CardHeader
          title="Procurement Architecture Topology"
          subtitle="Platform microservices powering ingestion, compliance checking, and AI synthesis"
        />
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {services.map((svc) => (
              <div key={svc.name} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{svc.name}</span>
                    <span className="text-2xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Port {svc.port}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{svc.description}</p>
                  <p className="text-2xs font-mono text-slate-400 dark:text-slate-500">{svc.endpoint}</p>
                </div>

                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {svc.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminSettingsPage;
