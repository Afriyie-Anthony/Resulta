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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FiUserCheck className={`w-6 h-6 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              System Administrators & Staff Users
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
            Manage operational access rights, two-factor authentication (MFA), and role assignments for the Control Center
          </p>
        </div>
        <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiUserPlus />} className="font-black text-xs">
          Provision New User
        </Button>
      </div>

      <div className={`rounded-3xl border overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-300 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">User & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Security MFA</th>
                <th className="py-3.5 px-4">Last Access</th>
                <th className="py-3.5 px-4 text-right">Permissions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {paginatedUsers.map((u, idx) => (
                <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                  <td className="py-4 px-4">
                    <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      <FiShield className="text-emerald-500 shrink-0" /> {u.name}
                    </div>
                    <span className={`text-xs flex items-center gap-1 mt-0.5 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      <FiMail className="w-3 h-3 text-[#0F8B8D] dark:text-teal-400" /> {u.email}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={u.role === 'SUPER_ADMIN' ? 'error' : 'primary'} className="font-bold text-[10px] !px-2.5">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                      ● {u.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 font-bold ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}>
                    🔒 {u.mfa}
                  </td>
                  <td className={`py-4 px-4 font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{u.lastLogin}</td>
                  <td className="py-4 px-4 text-right">
                    <Button variant={isLight ? 'outline' : 'ghost'} size="sm" onClick={() => alert(`Editing security privileges for ${u.name}`)} className="font-extrabold text-xs">
                      Configure Rights
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className={`px-6 py-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
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
