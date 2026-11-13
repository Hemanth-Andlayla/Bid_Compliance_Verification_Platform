import React, { useState } from 'react';
import { History, Search, FileText, Send, User, ChevronRight, Code } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../utils/formatters';

export function AdminAuditLogsPage() {
  const [entityType, setEntityType] = useState('BID');
  const [entityId, setEntityId] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  // Selected Log Details Modal
  const [activeLog, setActiveLog] = useState(null);

  const handleQuery = async (e) => {
    if (e) e.preventDefault();
    if (!entityId.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await adminApi.getAuditLogs(entityType, Number(entityId.trim()));
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setError(err.message || 'Unable to retrieve audit records for this entity.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Institutional Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Query immutable event traces recorded during the compliance verification and decision pipeline
        </p>
      </div>

      {/* Query Form Card */}
      <Card>
        <CardHeader title="Audit Query Filter" subtitle="Query specific entities by type and numerical identifier" />
        <CardContent>
          <form onSubmit={handleQuery} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4">
              <Select
                label="Entity Scope"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                placeholder=""
                options={[
                  { value: 'BID', label: 'Bid Submission (BID)' },
                  { value: 'TENDER', label: 'Procurement Notice (TENDER)' },
                  { value: 'USER', label: 'User Account (USER)' },
                ]}
              />
            </div>

            <div className="sm:col-span-6">
              <Input
                label="Entity Numerical ID"
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={loading}
                icon={Search}
              >
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={4} cols={5} />
          </CardContent>
        </Card>
      ) : error ? (
        <ErrorState message={error} onRetry={handleQuery} />
      ) : searched && logs.length === 0 ? (
        <EmptyState
          icon={History}
          title={`No Audit Logs for ${entityType} #${entityId}`}
          description="There are currently no recorded events or actions logged for this specific identifier."
        />
      ) : logs.length > 0 ? (
        <Card>
          <CardHeader
            title={`Audit Trail for ${entityType} #${entityId}`}
            subtitle={`${logs.length} events logged in chronological order`}
          />
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-3 px-5">Log ID</th>
                    <th className="py-3 px-5">Action Recorded</th>
                    <th className="py-3 px-5">Actor</th>
                    <th className="py-3 px-5">Timestamp</th>
                    <th className="py-3 px-5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        #{log.id}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-semibold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">
                        {log.userId ? `User #${log.userId}` : 'Automated System'}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 font-mono">
                        {formatDate(log.createdAt, { includeTime: true })}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Code}
                          onClick={() => setActiveLog(log)}
                        >
                          Payload
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Payload Modal */}
      <Modal
        isOpen={Boolean(activeLog)}
        onClose={() => setActiveLog(null)}
        title={`Audit Payload Details #${activeLog?.id}`}
        subtitle={`Action: ${activeLog?.action} on ${activeLog?.entityType} #${activeLog?.entityId}`}
        footer={
          <Button variant="primary" size="sm" onClick={() => setActiveLog(null)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-2xs overflow-x-auto max-h-96">
            <pre>{JSON.stringify(activeLog?.details || {}, null, 2)}</pre>
          </div>
          <div className="text-2xs text-slate-400 space-y-1">
            <p>
              <strong>Recorded Timestamp:</strong> {formatDate(activeLog?.createdAt, { includeTime: true })}
            </p>
            <p>
              <strong>Triggered By:</strong> {activeLog?.userId ? `User ID ${activeLog.userId}` : 'Backend Pipeline'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminAuditLogsPage;
