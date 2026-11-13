import React, { useEffect, useState } from 'react';
import { Search, Users, Building2, Mail, KeyRound, Calendar, ShieldCheck, User } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import Card, { CardHeader, CardContent } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { formatDate } from '../../utils/formatters';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Unable to retrieve user registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.organization || '').toLowerCase().includes(term) ||
      String(u.id).includes(term) ||
      (u.keycloakUserId || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registered suppliers, evaluation officers, and platform accounts in the system
          </p>
        </div>
      </div>

      {/* Search Input */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search by name, email, organization, or Keycloak ID..."
            prefixIcon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Users Table */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <TableSkeleton rows={5} cols={5} />
          </CardContent>
        </Card>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchTerm ? 'No Matching Users Found' : 'No Registered Users'}
          description={
            searchTerm
              ? 'Try modifying your search query.'
              : 'User accounts will appear here once registered through the public portal.'
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-5">User Profile</th>
                  <th className="py-3 px-5">Affiliation</th>
                  <th className="py-3 px-5">Keycloak Identifier</th>
                  <th className="py-3 px-5">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100 font-mono">
                      #{u.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                          <p className="text-2xs text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {u.organization || '—'}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono text-2xs text-slate-500 dark:text-slate-400 max-w-xs truncate select-all">
                      {u.keycloakUserId || '—'}
                    </td>
                    <td className="py-4 px-5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(u.createdAt, { includeTime: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AdminUsersPage;
