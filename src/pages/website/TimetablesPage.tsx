import React, { useState } from 'react';
import { FiDownload, FiFileText, FiClock, FiSearch, FiLoader } from 'react-icons/fi';
import WebsiteNavbar from '../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../components/website/layout/MoreBottomSheet';
import { useTimetables, useDownloadTimetable } from '../../hooks/usePublicAPI';
import { Button } from '../../components/ui/Button';

const TimetablesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'WASSCE_NOVDEC' | 'BECE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const { data: timetables, isLoading } = useTimetables(activeTab === 'ALL' ? undefined : activeTab);
  const { mutate: downloadTimetable, isPending: isDownloading } = useDownloadTimetable();

  const handleDownload = (id: string, filename: string) => {
    downloadTimetable(id, {
      onSuccess: (data) => {
        // Trigger download via anchor link
        const a = document.createElement('a');
        a.href = data.fileUrl;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      onError: () => {
        alert('Failed to generate download link. The file may have been removed.');
      }
    });
  };

  const filteredTimetables = timetables?.filter(tt => 
    tt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (tt.academicYear && tt.academicYear.includes(searchQuery))
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              <FiClock className="w-4 h-4" />
              GES Examination Hub
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
              Official Timetables
            </h1>
            <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Download the officially published WAEC examination timetables for School and Private Candidates (WASSCE, NOV/DEC, and BECE).
            </p>
          </div>

          <div className="bg-warm border border-border rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="flex bg-surface rounded-xl p-1 border border-border w-full sm:w-auto">
              {(['ALL', 'WASSCE_NOVDEC', 'BECE'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-secondary text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab === 'WASSCE_NOVDEC' ? 'WASSCE' : tab}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
              <input 
                type="text"
                placeholder="Search timetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiLoader className="w-8 h-8 animate-spin text-secondary mb-4" />
              <p className="text-sm font-semibold text-text-secondary">Loading official timetables...</p>
            </div>
          ) : filteredTimetables.length === 0 ? (
            <div className="text-center py-20 bg-warm border border-border border-dashed rounded-3xl">
              <FiFileText className="w-12 h-12 text-text-secondary/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-1">No Timetables Found</h3>
              <p className="text-sm text-text-secondary">We couldn't find any published timetables matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTimetables.map(tt => (
                <div key={tt.id} className="bg-surface rounded-2xl border border-border p-6 hover:shadow-lg hover:border-secondary/40 transition-all group flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <FiFileText className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-black tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-md">
                        {tt.voucherType === 'WASSCE_NOVDEC' ? 'WASSCE / NOVDEC' : 'BECE'}
                      </span>
                      {tt.academicYear && (
                        <span className="text-[10px] uppercase font-black tracking-wider text-text-secondary bg-warm px-2.5 py-1 rounded-md border border-border">
                          {tt.academicYear}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary leading-tight mb-2">
                      {tt.title}
                    </h3>
                    <p className="text-xs text-text-secondary font-medium">
                      {(tt.fileSize! / 1024 / 1024).toFixed(2)} MB • PDF Format
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    fullWidth 
                    leftIcon={<FiDownload className="w-4 h-4" />}
                    onClick={() => handleDownload(tt.id, tt.filename)}
                    disabled={isDownloading}
                  >
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default TimetablesPage;
