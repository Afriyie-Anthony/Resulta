import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { FiUserCheck, FiUserPlus, FiShield, FiMail } from 'react-icons/fi';

export const UsersView: React.FC = () => {
  const { isLight } = useAdminTheme();

  const [users] = useState([
    { name: 'System Administrator (SA)', email: 'admin@resulta.com.gh', role: 'SUPER_ADMIN', status: 'ACTIVE', mfa: 'Enabled', lastLogin: '10 mins ago (Current Session)' },
    { name: 'Anthony Afriyie', email: 'anthony@resulta.com.gh', role: 'FINANCE_MANAGER', status: 'ACTIVE', mfa: 'Enabled', lastLogin: '2 hours ago' },
    { name: 'Kwabena Osei (Ops)', email: 'support@resulta.com.gh', role: 'INVENTORY_MANAGER', status: 'ACTIVE', mfa: 'Enabled', lastLogin: 'Yesterday' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <FiUserCheck className={`w-6 h-6 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              System Administrators & Staff Users
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
            Manage operational access rights, two-factor authentication (MFA), and role assignments for the Control Center
          </p>
        </div>
        <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiUserPlus />}>
          Provision New User
        </Button>
      </div>

      <div className={`rounded-3xl border overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200/90 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-extrabold ${
                isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">User & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Security MFA</th>
                <th className="py-3.5 px-4">Last Access</th>
                <th className="py-3.5 px-4 text-right">Permissions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
              {paginatedUsers.map((u, idx) => (
                <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/40'}`}>
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-sm text-primary dark:text-white flex items-center gap-2">
                      <FiShield className="text-emerald-500 shrink-0" /> {u.name}
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                      <FiMail className="w-3 h-3" /> {u.email}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={u.role === 'SUPER_ADMIN' ? 'error' : 'primary'} className="font-extrabold text-[10px] !px-2.5">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      ● {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-teal-700 dark:text-teal-400">
                    🔒 {u.mfa}
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-semibold">{u.lastLogin}</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => alert(`Editing security privileges for ${u.name}`)}>
                      Configure Rights
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={users.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};
