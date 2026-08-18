import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import {
  FiUserCheck,
  FiUserPlus,
  FiShield,
  FiMail,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock
} from 'react-icons/fi';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN';
  status: 'ACTIVE';
  lastLogin: string;
}

export const UsersView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Initial staff user list — ALL accounts are SUPER_ADMIN
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 'USR-001', name: 'System Administrator (SA)', email: 'admin@resulta.com.gh', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '10 mins ago (Current Session)' },
    { id: 'USR-002', name: 'Anthony Afriyie', email: 'anthony@resulta.com.gh', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: '2 hours ago' },
    { id: 'USR-003', name: 'Kwabena Osei (Ops)', email: 'support@resulta.com.gh', role: 'SUPER_ADMIN', status: 'ACTIVE', lastLogin: 'Yesterday' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Modal State for Delete Confirmation
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      addToast({
        title: 'Form Validation Error',
        message: 'Please provide both full name and email address.',
        type: 'error',
        duration: 3000
      });
      return;
    }

    if (!editingUser && !formPassword.trim()) {
      addToast({
        title: 'Password Required',
        message: 'Please enter a password for the new Super Admin account.',
        type: 'error',
        duration: 3000
      });
      return;
    }

    if (editingUser) {
      // Edit User
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: formName.trim(), email: formEmail.trim() }
            : u
        )
      );
      addToast({
        title: 'User Updated',
        message: formPassword.trim()
          ? `Updated details and reset password for ${formName}.`
          : `Updated account details for ${formName}.`,
        type: 'success',
        duration: 3500
      });
    } else {
      // Add New User (Role fixed to SUPER_ADMIN)
      const newUser: AdminUser = {
        id: `USR-00${users.length + 1}`,
        name: formName.trim(),
        email: formEmail.trim(),
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        lastLogin: 'Just now (New Account)'
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast({
        title: 'Super Admin Provisioned',
        message: `Provisioned new Super Admin account for ${formName}.`,
        type: 'success',
        duration: 4000
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    addToast({
      title: 'User Account Removed',
      message: `Revoked Super Admin account for ${deletingUser.name}.`,
      type: 'info',
      duration: 3500
    });
    setDeletingUser(null);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className={`p-2.5 rounded-2xl ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
            }`}>
              <FiUserCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Super Administrators & Staff Users
              </h1>
              <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Manage Super Admin user accounts, provision credentials, and oversee control center access.
              </p>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <Button
            variant={isLight ? 'primary' : 'gradient'}
            size="md"
            onClick={handleOpenAddModal}
            leftIcon={<FiUserPlus />}
            className="font-black text-xs h-11 px-5 rounded-2xl shadow-md"
          >
            Provision Super Admin
          </Button>
        </div>
      </div>

      {/* Control Toolbar & Search */}
      <div className={`p-4 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-black uppercase px-3.5 py-1 rounded-full border ${
            isLight ? 'bg-rose-100 text-rose-950 border-rose-300' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
          }`}>
            <FiCheckCircle className="inline mr-1 text-rose-600 dark:text-rose-400" /> {users.length} Super Admin Accounts
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search staff name or email..."
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
            }`}
          />
        </div>
      </div>

      {/* Main Staff Users Table */}
      <div className={`rounded-3xl border overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-2.5 px-3.5 whitespace-nowrap">User & Email</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Assigned Role</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Account Status</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Last Access</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        <FiShield className="text-rose-500 shrink-0" /> {u.name}
                      </div>
                      <span className={`text-xs flex items-center gap-1 mt-0.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        <FiMail className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> {u.email}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className={`inline-block px-3 py-0.5 rounded-xl text-[10px] font-black tracking-wide uppercase ${
                        isLight ? 'bg-rose-100 text-rose-950 border border-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        SUPER ADMIN
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                        ● {u.status}
                      </span>
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                      {u.lastLogin}
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(u)}
                          title="Edit User Details"
                          className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
                            isLight
                              ? 'bg-slate-100 border-slate-300 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                              : 'bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeletingUser(u)}
                          title="Delete User Account"
                          className={`p-2.5 rounded-xl border transition-all shadow-2xs ${
                            isLight
                              ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400'
                              : 'bg-rose-950/40 border-rose-900/50 text-rose-400 hover:bg-rose-900/60'
                          }`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 font-semibold">
                    No staff members match the search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={`px-6 py-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => {
              setItemsPerPage(newSize);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Add / Edit Super Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Super Admin Details' : 'Provision New Super Admin'}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Ama Serwaa"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              Official Email Address
            </label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              placeholder="e.g. ama@resulta.com.gh"
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* Password Field with Eye Reveal */}
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              Account Password {editingUser && <span className="text-[10px] text-slate-500 font-normal lowercase">(leave blank to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!editingUser}
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder={editingUser ? '••••••••••••' : 'Enter strong password...'}
                className={`w-full rounded-2xl pl-10 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                }`}
              />
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D] dark:text-teal-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              System Role
            </label>
            <div className={`px-4 py-2.5 rounded-2xl border text-xs font-black uppercase flex items-center justify-between ${
              isLight ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-rose-950/40 border-rose-900/50 text-rose-300'
            }`}>
              <span>SUPER ADMIN</span>
              <span className="text-[10px] font-bold text-slate-500">Full System Control</span>
            </div>
          </div>

          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button variant={isLight ? 'primary' : 'gradient'} size="sm" type="submit" className="font-black text-xs px-5 rounded-xl">
              {editingUser ? 'Save Changes' : 'Provision Super Admin'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Revoke Super Admin Account"
      >
        <div className="space-y-4">
          <p className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Are you sure you want to revoke system privileges for <strong className="font-black text-rose-600">{deletingUser?.name}</strong> ({deletingUser?.email})?
          </p>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" onClick={() => setDeletingUser(null)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteUser} className="font-black text-xs px-5 rounded-xl">
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
