import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Pagination } from '../../../components/ui/Pagination';
import { useToast } from '../../../components/ui/Toast';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../../hooks/useUsers';
import { createUserSchema, updateUserSchema, type User } from '../../../schemas/users';
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
  FiLock,
  FiRefreshCw,
  FiUsers
} from 'react-icons/fi';

export const UsersView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();
  
  // Two tabs: 'ADMINS' (Super Admin & Admin) vs 'AFFILIATES'
  const [activeTab, setActiveTab] = useState<'ADMINS' | 'AFFILIATES'>('ADMINS');
  const [adminSubRole, setAdminSubRole] = useState<'ALL' | 'SUPER_ADMIN' | 'ADMIN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Compute query role for API
  const queryRole = activeTab === 'AFFILIATES' 
    ? 'AFFILIATE' 
    : (adminSubRole !== 'ALL' ? adminSubRole : undefined);

  // API Hooks
  const { data: usersData, isLoading, isError, refetch, isFetching } = useUsers({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    role: queryRole,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const rawUsers = usersData?.users || [];
  
  // Filter for display: if ADMINS and ALL, only show SUPER_ADMIN and ADMIN
  const users = rawUsers.filter((u) => {
    if (activeTab === 'ADMINS') {
      if (adminSubRole === 'SUPER_ADMIN') return u.role === 'SUPER_ADMIN';
      if (adminSubRole === 'ADMIN') return u.role === 'ADMIN';
      return u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';
    } else {
      return u.role === 'AFFILIATE';
    }
  });

  const totalItems = users.length;
  const totalPages = usersData?.pagination?.totalPages || 1;

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'AFFILIATE' | 'USER'>('SUPER_ADMIN');
  const [showPassword, setShowPassword] = useState(false);

  // Modal State for Delete Confirmation
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole(activeTab === 'AFFILIATES' ? 'AFFILIATE' : 'SUPER_ADMIN');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role as any);
    setFormPassword('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Edit User
      const payload = {
        name: formName.trim(),
        email: formEmail.trim(),
        role: formRole,
        ...(formPassword.trim() ? { password: formPassword, confirmPassword: formPassword } : {})
      };

      const parsed = updateUserSchema.safeParse(payload);
      if (!parsed.success) {
        addToast({ title: 'Validation Error', message: parsed.error.issues[0].message, type: 'error', duration: 3000 });
        return;
      }

      updateUserMutation.mutate({ id: editingUser.id, data: parsed.data }, {
        onSuccess: () => {
          addToast({ title: 'User Updated', message: `Updated details for ${formName}.`, type: 'success' });
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          addToast({ title: 'Update Failed', message: err.response?.data?.message || 'Failed to update user', type: 'error' });
        }
      });
    } else {
      // Add New User
      const payload = {
        name: formName.trim(),
        email: formEmail.trim(),
        password: formPassword,
        confirmPassword: formPassword, // API requires confirmPassword, we auto-fill it from the single input for simplicity in this UI
        role: formRole,
      };

      const parsed = createUserSchema.safeParse(payload);
      if (!parsed.success) {
        addToast({ title: 'Validation Error', message: parsed.error.issues[0].message, type: 'error', duration: 3000 });
        return;
      }

      createUserMutation.mutate(parsed.data, {
        onSuccess: () => {
          addToast({ title: 'User Provisioned', message: `Provisioned new account for ${formName}.`, type: 'success' });
          setIsModalOpen(false);
        },
        onError: (err: any) => {
          addToast({ title: 'Provision Failed', message: err.response?.data?.message || 'Failed to create user', type: 'error' });
        }
      });
    }
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    
    deleteUserMutation.mutate(deletingUser.id, {
      onSuccess: () => {
        addToast({ title: 'Account Revoked', message: `Revoked access for ${deletingUser.name}.`, type: 'info' });
        setDeletingUser(null);
      },
      onError: (err: any) => {
        addToast({ title: 'Deletion Failed', message: err.response?.data?.message || 'Could not delete account', type: 'error' });
      }
    });
  };

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
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  User Management
                </h1>
                {isFetching && <FiRefreshCw className="w-4 h-4 text-teal-500 animate-spin" />}
              </div>
              <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Manage administrative staff, access credentials, and affiliate accounts.
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
            {activeTab === 'ADMINS' ? 'Add Administrator' : 'Add Affiliate User'}
          </Button>
        </div>
      </div>

      {/* Role Tabs: Administrators vs Affiliates */}
      <div className="flex items-center">
        <div className={`inline-flex items-center p-1 rounded-2xl border ${
          isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ADMINS');
              setAdminSubRole('ALL');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ADMINS'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white shadow-xs'
                  : 'bg-teal-500 text-slate-950 font-black shadow-md'
                : isLight
                ? 'text-slate-700 hover:text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiShield className="w-3.5 h-3.5" />
            <span>Administrators</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('AFFILIATES');
              setCurrentPage(1);
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'AFFILIATES'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white shadow-xs'
                  : 'bg-teal-500 text-slate-950 font-black shadow-md'
                : isLight
                ? 'text-slate-700 hover:text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiUsers className="w-3.5 h-3.5" />
            <span>Affiliates</span>
          </button>
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
            <FiCheckCircle className="inline mr-1 text-rose-600 dark:text-rose-400" />
            {users.length} {activeTab === 'ADMINS' ? 'Administrators' : 'Affiliates'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeTab === 'ADMINS' && (
            <select
              value={adminSubRole}
              onChange={(e) => { setAdminSubRole(e.target.value as any); setCurrentPage(1); }}
              className={`rounded-2xl px-4 py-2 text-xs font-black uppercase border focus:outline-none transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900 focus:border-teal-500'
              }`}
            >
              <option value="ALL">All Administrators</option>
              <option value="SUPER_ADMIN">Super Admin Only</option>
              <option value="ADMIN">Admin Only</option>
            </select>
          )}

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder={activeTab === 'ADMINS' ? "Search admin name or email..." : "Search affiliate name or email..."}
              className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none transition-colors border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#0F8B8D] focus:bg-white'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:bg-slate-900'
              }`}
            />
          </div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <FiRefreshCw className="w-6 h-6 mx-auto text-slate-400 animate-spin mb-2" />
                    <span className="text-slate-500">Loading users...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-rose-500 font-bold">
                    Failed to load users. <Button variant="ghost" size="sm" onClick={() => refetch()}>Retry</Button>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className={`font-black text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                        {u.role === 'AFFILIATE' ? (
                          <FiUsers className="text-purple-500 shrink-0" />
                        ) : (
                          <FiShield className="text-rose-500 shrink-0" />
                        )}
                        {u.name}
                      </div>
                      <span className={`text-xs flex items-center gap-1 mt-0.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                        <FiMail className="w-3.5 h-3.5 text-[#0F8B8D] dark:text-teal-400" /> {u.email}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className={`inline-block px-3 py-0.5 rounded-xl text-[10px] font-black tracking-wide uppercase ${
                        u.role === 'SUPER_ADMIN' 
                          ? isLight ? 'bg-rose-100 text-rose-950 border border-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : u.role === 'ADMIN'
                          ? isLight ? 'bg-blue-100 text-blue-950 border border-blue-300' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : isLight ? 'bg-purple-100 text-purple-950 border border-purple-300' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30">
                        ● {u.status || 'ACTIVE'}
                      </span>
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-900' : 'text-slate-300'}`}>
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never logged in'}
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
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
                    No {activeTab === 'ADMINS' ? 'administrators' : 'affiliates'} found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalItems > 0 && (
          <div className={`px-6 py-4 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newSize) => {
                setItemsPerPage(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User Details' : activeTab === 'ADMINS' ? 'Add Administrator' : 'Add Affiliate User'}
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

          {/* Role Dropdown */}
          <div>
            <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              System Role
            </label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as any)}
              className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold uppercase border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            >
              {activeTab === 'ADMINS' ? (
                <>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Control)</option>
                  <option value="ADMIN">ADMIN (Standard Access)</option>
                </>
              ) : (
                <>
                  <option value="AFFILIATE">AFFILIATE (Partner)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Control)</option>
                  <option value="ADMIN">ADMIN (Standard Access)</option>
                </>
              )}
            </select>
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

          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button 
              variant={isLight ? 'primary' : 'gradient'} 
              size="sm" 
              type="submit" 
              className="font-black text-xs px-5 rounded-xl"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? 'Saving...' : editingUser ? 'Save Changes' : 'Provision User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Revoke User Account"
      >
        <div className="space-y-4">
          <p className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
            Are you sure you want to revoke system privileges for <strong className="font-black text-rose-600">{deletingUser?.name}</strong> ({deletingUser?.email})?
          </p>
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <Button variant="ghost" size="sm" onClick={() => setDeletingUser(null)} className="font-bold text-xs">
              Cancel
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={handleDeleteUser} 
              className="font-black text-xs px-5 rounded-xl"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Yes, Delete Account'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
