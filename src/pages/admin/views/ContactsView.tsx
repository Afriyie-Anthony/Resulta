import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { useToast } from '../../../components/ui/Toast';
import { 
  useContactsStats, 
  usePaginatedContacts, 
  useContactMessage, 
  useUpdateContactStatus, 
  useReplyContactMessage,
  useDeleteContactMessage
} from '../../../hooks/useContacts';
import type { ContactStatus } from '../../../schemas/contacts';
import { FiInbox, FiSearch, FiFilter, FiCheck, FiMail, FiArchive, FiTrash2, FiSend } from 'react-icons/fi';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Pagination } from '../../../components/ui/Pagination';

export const ContactsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | ''>('');
  
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useContactsStats();
  const { data: listData, isLoading: isListLoading, refetch } = usePaginatedContacts({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: activeMessage, isLoading: isActiveMessageLoading } = useContactMessage(
    selectedMessageId as string,
    !!selectedMessageId
  );

  // Mutations
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateContactStatus();
  const { mutate: sendReply, isPending: isReplying } = useReplyContactMessage();
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteContactMessage();

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleOpenMessage = (id: string) => {
    setSelectedMessageId(id);
    setReplyText('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessageId(null);
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatus({ id, status }, {
      onSuccess: () => {
        addToast({ title: 'Success', message: `Message marked as ${status}`, type: 'success' });
        if (status === 'ARCHIVED' || status === 'PENDING') handleCloseModal();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this message?')) {
      deleteMessage(id, {
        onSuccess: () => {
          addToast({ title: 'Deleted', message: 'Message permanently deleted', type: 'info' });
          handleCloseModal();
        }
      });
    }
  };

  const handleReplySubmit = () => {
    if (!replyText.trim() || !selectedMessageId) return;
    
    sendReply({ id: selectedMessageId, replyMessage: replyText }, {
      onSuccess: () => {
        addToast({ title: 'Reply Sent', message: 'Email has been successfully dispatched.', type: 'success' });
        setReplyText('');
      }
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'READ': return 'info';
      case 'REPLIED': return 'success';
      case 'ARCHIVED': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className={`p-6 rounded-3xl border shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-2xl font-black flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <FiInbox className={isLight ? 'text-indigo-600' : 'text-indigo-400'} />
              Support Inbox
            </h1>
            <p className={`text-sm font-semibold mt-1 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Manage incoming customer inquiries and provide immediate assistance.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Messages', value: stats?.totalMessages || 0, color: 'text-indigo-500' },
          { label: 'Unread', value: stats?.unreadCount || 0, color: 'text-rose-500' },
          { label: 'Pending', value: stats?.pendingCount || 0, color: 'text-amber-500' },
          { label: 'Replied', value: stats?.repliedCount || 0, color: 'text-emerald-500' },
          { label: 'Archived', value: stats?.archivedCount || 0, color: 'text-slate-500' },
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className="text-[10px] uppercase font-black text-slate-500 block truncate mb-1">
              {kpi.label}
            </span>
            <span className={`text-2xl font-black block ${kpi.color}`}>
              {isStatsLoading ? '...' : kpi.value}
            </span>
          </div>
        ))}
      </div>

      {/* Main Inbox Panel */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden flex flex-col ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        
        {/* Toolbar */}
        <div className={`p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/50'
        }`}>
          <form onSubmit={handleSearch} className="relative w-full sm:w-96">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              placeholder="Search email, name, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-sm font-semibold rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                isLight 
                  ? 'bg-white border-slate-300 text-slate-900 focus:ring-indigo-500/20 focus:border-indigo-500' 
                  : 'bg-slate-900 border-slate-700 text-white focus:ring-indigo-500/30 focus:border-indigo-500'
              }`}
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <FiFilter className={`w-4 h-4 mr-1 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            {(['', 'PENDING', 'READ', 'REPLIED', 'ARCHIVED'] as const).map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap border ${
                  statusFilter === status
                    ? isLight
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-indigo-500 text-slate-950 border-indigo-500'
                    : isLight
                      ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {status === '' ? 'ALL' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Datatable */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-sm font-semibold ${
              isLight ? 'divide-slate-200' : 'divide-slate-800'
            }`}>
              {isListLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-bold">
                    Loading messages...
                  </td>
                </tr>
              ) : listData?.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-bold">
                    No messages found for this filter.
                  </td>
                </tr>
              ) : (
                listData?.data.map((msg) => (
                  <tr key={msg.id} className={`transition-colors group ${
                    isLight 
                      ? msg.status === 'PENDING' ? 'bg-amber-50 hover:bg-amber-100/50' : 'hover:bg-slate-50'
                      : msg.status === 'PENDING' ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-slate-800/50'
                  }`}>
                    <td className="py-3 px-4">
                      <div className={`font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {msg.fullName}
                      </div>
                      <div className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {msg.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">
                      <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>{msg.subject}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs font-bold text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(msg.status)} className="text-[10px] font-black uppercase tracking-wider">
                        {msg.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenMessage(msg.id)}
                        className={`text-xs font-bold px-3 py-1 ${
                          msg.status === 'PENDING' && (isLight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30')
                        }`}
                      >
                        {msg.status === 'PENDING' ? 'Review & Reply' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {listData && listData.pagination.totalPages > 1 && (
          <div className={`p-4 border-t flex justify-center ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/50'
          }`}>
            <Pagination
              currentPage={page}
              totalPages={listData.pagination.totalPages}
              totalItems={listData.pagination.total}
              itemsPerPage={listData.pagination.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Message Reader & Reply Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Message Thread">
        {isActiveMessageLoading ? (
          <div className="py-12 text-center text-slate-500 font-bold">Loading thread...</div>
        ) : activeMessage ? (
          <div className="flex flex-col gap-6">
            
            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
              <Badge variant={getStatusBadgeVariant(activeMessage.status)} className="text-[10px] font-black uppercase">
                {activeMessage.status}
              </Badge>
              
              <div className="flex items-center gap-2">
                {activeMessage.status !== 'ARCHIVED' && (
                  <Button size="sm" variant="outline" leftIcon={<FiArchive />} onClick={() => handleStatusUpdate(activeMessage.id, 'ARCHIVED')} isLoading={isUpdating}>
                    Archive
                  </Button>
                )}
                <Button size="sm" variant="danger" leftIcon={<FiTrash2 />} onClick={() => handleDelete(activeMessage.id)} isLoading={isDeleting}>
                  Delete
                </Button>
              </div>
            </div>

            {/* Original Message */}
            <div className={`p-5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {activeMessage.subject}
                  </h3>
                  <div className={`text-xs font-semibold flex items-center gap-2 mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <FiMail className="w-3.5 h-3.5" />
                    <a href={`mailto:${activeMessage.email}`} className="hover:underline">{activeMessage.fullName} ({activeMessage.email})</a>
                    {activeMessage.phoneNumber && <span>• {activeMessage.phoneNumber}</span>}
                  </div>
                </div>
                <div className={`text-xs font-bold shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {new Date(activeMessage.createdAt).toLocaleString()}
                </div>
              </div>
              <div className={`text-sm whitespace-pre-wrap leading-relaxed ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {activeMessage.message}
              </div>
            </div>

            {/* Previous Reply (If Replied) */}
            {activeMessage.status === 'REPLIED' && activeMessage.replyMessage && (
              <div className={`p-5 rounded-2xl border ${
                isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-900/20 border-emerald-800/50'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`text-sm font-black flex items-center gap-2 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    <FiCheck /> Official Reply Sent
                  </h4>
                  {activeMessage.repliedAt && (
                    <div className={`text-xs font-bold ${isLight ? 'text-emerald-600/70' : 'text-emerald-500/70'}`}>
                      {new Date(activeMessage.repliedAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className={`text-sm whitespace-pre-wrap leading-relaxed ${
                  isLight ? 'text-emerald-900' : 'text-emerald-100'
                }`}>
                  {activeMessage.replyMessage}
                </div>
              </div>
            )}

            {/* Reply Composer (Only if not Replied/Archived) */}
            {(activeMessage.status === 'PENDING' || activeMessage.status === 'READ') && (
              <div className="space-y-3 mt-4">
                <label className={`text-sm font-black flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Compose Email Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Draft your professional response here... An HTML email will be dispatched immediately."
                  rows={6}
                  className={`w-full p-4 text-sm font-semibold rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none ${
                    isLight 
                      ? 'bg-white border-slate-300 text-slate-900 focus:ring-indigo-500/20 focus:border-indigo-500' 
                      : 'bg-slate-900 border-slate-700 text-white focus:ring-indigo-500/30 focus:border-indigo-500 placeholder-slate-600'
                  }`}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    leftIcon={<FiSend />} 
                    onClick={handleReplySubmit}
                    isLoading={isReplying}
                    disabled={!replyText.trim()}
                    className={isLight ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'}
                  >
                    Dispatch Email
                  </Button>
                </div>
              </div>
            )}
            
          </div>
        ) : (
          <div className="py-12 text-center text-rose-500 font-bold">Failed to load message details.</div>
        )}
      </Modal>

    </div>
  );
};
