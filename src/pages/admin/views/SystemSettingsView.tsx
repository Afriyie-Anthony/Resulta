import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { useAuthStore } from '../../../store/authStore';
import { useGetProfile, useUpdateProfile } from '../../../hooks/useProfile';
import { updateProfileSchema } from '../../../schemas/profile';
import {
  FiSave,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiMail,
  FiCheckCircle,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';

export const SystemSettingsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // Profile State
  const user = useAuthStore((state) => state.user);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  const { isFetching: isFetchingProfile } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  // Security Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { name: profileName.trim(), email: profileEmail.trim() };
    const parsed = updateProfileSchema.safeParse(payload);

    if (!parsed.success) {
      addToast({
        title: 'Validation Error',
        message: parsed.error.issues[0].message,
        type: 'error',
      });
      return;
    }

    updateProfileMutation.mutate(parsed.data, {
      onSuccess: () => {
        addToast({
          title: 'Profile Updated',
          message: `Updated profile details for ${profileName}.`,
          type: 'success',
        });
      },
      onError: (err: any) => {
        addToast({
          title: 'Update Failed',
          message: err.response?.data?.message || 'Failed to update profile.',
          type: 'error',
        });
      },
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    const parsed = updateProfileSchema.safeParse(payload);
    if (!parsed.success) {
      addToast({
        title: 'Validation Error',
        message: parsed.error.issues[0].message,
        type: 'error',
      });
      return;
    }

    updateProfileMutation.mutate(parsed.data, {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        addToast({
          title: 'Security Credentials Updated',
          message: 'Admin password successfully updated.',
          type: 'success',
        });
      },
      onError: (err: any) => {
        addToast({
          title: 'Update Failed',
          message: err.response?.data?.message || 'Failed to change password.',
          type: 'error',
        });
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Account Profile & Security Settings
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Manage your administrator account details, official contact email, and reset encrypted password credentials.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information Form */}
        <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <FiUser className="text-[#0F8B8D] dark:text-teal-400" /> Administrator Profile Information
              {isFetchingProfile && <FiRefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400 ml-2" />}
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300">
              {user?.role?.replace('_', ' ') || 'ADMIN'}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 uppercase">
                {user?.name?.substring(0, 2) || 'AD'}
              </div>
              <div>
                <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {user?.name || profileName}
                </h4>
                <p className={`text-xs font-bold ${user?.role === 'SUPER_ADMIN' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {user?.role?.replace('_', ' ')} (Platform Administrator)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Official Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant={isLight ? 'primary' : 'gradient'}
                leftIcon={<FiSave />}
                className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile Details'}
              </Button>
            </div>
          </form>
        </div>

        {/* Password & Security Credentials Reset Form */}
        <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
            <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <FiLock className="text-rose-600 dark:text-rose-400" /> Reset Security Credentials & Password
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
              ENCRYPTED CREDENTIALS
            </span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
            {/* Current Password */}
            <div>
              <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password..."
                  className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password..."
                  className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="danger"
                leftIcon={<FiCheckCircle />}
                className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Password Credentials'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
