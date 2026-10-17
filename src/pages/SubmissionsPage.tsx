import React, { useEffect } from 'react';
import { Paper } from '../types';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { FolderClosed, PlusCircle, Trash2, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient.js';

interface SubmissionsPageProps {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  onNavigateToUpload: () => void;
  onPaperDeleted: (id: string) => void;
  onRedirectToLogin?: () => void;
}

export const SubmissionsPage: React.FC<SubmissionsPageProps> = ({
  papers,
  onSelectPaper,
  onNavigateToUpload,
  onPaperDeleted,
  onRedirectToLogin,
}) => {
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        if (window.location.pathname !== '/login') {
          window.history.pushState(null, '', '/login');
        }
        if (onRedirectToLogin) {
          onRedirectToLogin();
        } else {
          window.location.href = '/login';
        }
      }
    });
  }, [onRedirectToLogin]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-[#171717] border border-white/[0.09] rounded-2xl flex items-center justify-center mx-auto text-[#F5F5F5]">
          <FolderClosed className="w-5 h-5 text-[#A0A0A0]" />
        </div>
        <h1 className="text-xl font-semibold text-[#F5F5F5]">
          Sign in to continue
        </h1>
        <p className="text-xs text-[#A0A0A0]">
          Sign in to view question papers you have uploaded.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 bg-[#F5F5F5] hover:bg-white text-[#090909] text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          Sign in
        </button>
      </div>
    );
  }

  const userSubmissions = papers.filter((p) => p.submittedBy.id === currentUser.id);

  const getStatusText = (status: Paper['status']) => {
    switch (status) {
      case 'pending':
        return 'Waiting for review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Not approved';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this submission?')) {
      storageService.deletePaper(id);
      onPaperDeleted(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#F5F5F5] tracking-tight">
            My materials
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Question papers uploaded by {currentUser.name}
          </p>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#1D1D1D] border border-white/[0.09] hover:border-white/[0.16] text-[#F5F5F5] text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Upload paper</span>
        </button>
      </div>

      {userSubmissions.length > 0 ? (
        <div className="space-y-3">
          {userSubmissions.map((paper) => (
            <div
              key={paper.id}
              className="bg-[#171717] border border-white/[0.09] rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/30 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-[#F5F5F5]">
                    {paper.title}
                  </h3>
                  <div className="text-xs text-[#A0A0A0] flex flex-wrap items-center gap-2">
                    <span>Submitted on {new Date(paper.submittedAt).toLocaleDateString()}</span>
                    <span aria-hidden="true" className="text-[#707070]">·</span>
                    <span>
                      Status: <strong className="text-white font-medium">{getStatusText(paper.status)}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {paper.status === 'approved' && (
                    <button
                      onClick={() => onSelectPaper(paper)}
                      className="px-3 py-1.5 text-xs font-medium text-[#F5F5F5] bg-[#1D1D1D] hover:bg-[#252525] border border-white/[0.09] rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View paper</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="p-1.5 text-[#707070] hover:text-[#F5F5F5] hover:bg-[#252525] rounded-lg transition-colors"
                    title="Delete submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {paper.status === 'rejected' && paper.rejectionReason && (
                <div className="p-3 bg-[#101010] border border-white/[0.08] rounded-xl text-xs text-[#A0A0A0] space-y-0.5">
                  <span className="text-[#F5F5F5] font-medium block">Feedback from reviewer:</span>
                  <p>{paper.rejectionReason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-14 text-center text-xs text-[#707070] border border-white/[0.08] rounded-2xl bg-[#171717] p-8 space-y-3">
          <p className="font-medium text-[#F5F5F5]">You haven't uploaded any papers yet.</p>
          <button
            onClick={onNavigateToUpload}
            className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-[#090909] font-medium text-xs rounded-xl transition-all"
          >
            Upload paper
          </button>
        </div>
      )}
    </div>
  );
};
