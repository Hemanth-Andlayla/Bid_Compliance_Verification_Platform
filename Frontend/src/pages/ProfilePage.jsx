
import React from 'react';
import {
    User,
    Mail,
    Building2,
    Shield,
    CheckCircle2
} from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import Card, {
    CardHeader,
    CardContent
} from '../components/common/Card';
import Badge from '../components/common/Badge';
import { ROLE_LABELS } from '../utils/constants';

export function ProfilePage() {

    const {
        user,
        primaryRole,
        roles
    } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Account Profile
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                   Your profile and organization information
                </p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* User Card Summary */}
                <Card className="md:col-span-1">

                    <CardContent className="flex flex-col items-center text-center p-6 space-y-4">

                        <div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-2xl ring-4 ring-orange-50 dark:ring-orange-950/20 shadow-xs">
                            {user?.name
                                ? user.name.charAt(0).toUpperCase()
                                : 'U'}
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {user?.name || 'User'}
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user?.email || '—'}
                            </p>
                        </div>

                        <Badge variant="brand" size="md">
                            {ROLE_LABELS[primaryRole] || primaryRole}
                        </Badge>

                        {user?.organization && (
                            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">

                                <span className="block text-2xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                                    Organization
                                </span>

                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {user.organization}
                                </span>

                            </div>
                        )}

                    </CardContent>

                </Card>


                {/* Detailed Info Card */}
                <Card className="md:col-span-2">

                    <CardHeader
                        title="Account Details"
                        subtitle="Your profile and organization information"
                    />

                    <CardContent className="space-y-5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">

                                    <User className="w-3.5 h-3.5 text-orange-600" />

                                    <span>
                                        Full Name
                                    </span>

                                </div>

                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {user?.name || '—'}
                                </p>

                            </div>


                            {/* Email */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">

                                    <Mail className="w-3.5 h-3.5 text-orange-600" />

                                    <span>
                                        Email Address
                                    </span>

                                </div>

                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {user?.email || '—'}
                                </p>

                            </div>


                            {/* Organization */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">

                                    <Building2 className="w-3.5 h-3.5 text-orange-600" />

                                    <span>
                                        Organization
                                    </span>

                                </div>

                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {user?.organization || '—'}
                                </p>

                            </div>


                            {/* Authorized Role */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">

                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">

                                    <Shield className="w-3.5 h-3.5 text-orange-600" />

                                    <span>
                                        Authorized Role
                                    </span>

                                </div>

                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {ROLE_LABELS[primaryRole] || primaryRole}
                                </p>

                            </div>

                        </div>


                        {/* Granted Authorities */}
                        <div>

                            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Granted Authorities
                            </h4>

                            <div className="flex flex-wrap gap-2">

                                {roles && roles.length > 0 ? (

                                    roles.map((role) => (

                                        <span
                                            key={role}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-2xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                        >

                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />

                                            {role}

                                        </span>

                                    ))

                                ) : (

                                    <span className="text-xs text-slate-400">
                                        No explicit roles detected.
                                    </span>

                                )}

                            </div>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    );
}

export default ProfilePage;
