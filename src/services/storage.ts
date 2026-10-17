import { Paper, PaperStatus, PaperReview, PaperComment } from '../types';
import { SAMPLE_PAPERS } from '../data/samplePapers';

const PAPERS_STORAGE_KEY = 'pyq_papers_v2';
const SAVED_PAPERS_STORAGE_KEY = 'pyq_saved_paper_ids_v2';

export const storageService = {
  // Initialize storage with sample data if not present
  getPapers(): Paper[] {
    try {
      const stored = localStorage.getItem(PAPERS_STORAGE_KEY);
      if (!stored) {
        const initialized = SAMPLE_PAPERS.map((p, idx) => ({
          ...p,
          rating: Number((4.6 + (idx % 4) * 0.1).toFixed(1)),
          ratingCount: 18 + idx * 7,
          reviews: [
            {
              id: `rev-${p.id}-1`,
              stars: 5,
              text: 'Very helpful question paper for exam preparation. Clean layout and legible questions.',
              authorName: 'Student Reviewer',
              createdAt: '2024-03-20T10:00:00.000Z',
            },
          ],
          comments: [
            {
              id: `com-${p.id}-1`,
              authorName: 'Rohan V.',
              text: 'Does this set include numerical solution keys for Section B?',
              createdAt: '2024-04-02T14:30:00.000Z',
            },
          ],
        }));
        localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(initialized));
        return initialized;
      }
      return JSON.parse(stored);
    } catch {
      return SAMPLE_PAPERS;
    }
  },

  savePapers(papers: Paper[]): void {
    try {
      localStorage.setItem(PAPERS_STORAGE_KEY, JSON.stringify(papers));
    } catch (e) {
      console.error('Failed to save papers to localStorage', e);
    }
  },

  getApprovedPapers(): Paper[] {
    const all = this.getPapers();
    return all.filter((p) => p.status === 'approved');
  },

  getAllPapersForOwner(): Paper[] {
    return this.getPapers();
  },

  getUserSubmissions(userId: string): Paper[] {
    const all = this.getPapers();
    return all.filter((p) => p.submittedBy.id === userId);
  },

  getPaperById(id: string): Paper | undefined {
    const all = this.getPapers();
    return all.find((p) => p.id === id);
  },

  submitPaper(
    data: Omit<Paper, 'id' | 'status' | 'submittedAt' | 'viewsCount' | 'downloadsCount'>,
  ): Paper {
    const papers = this.getPapers();
    const newPaper: Paper = {
      ...data,
      id: `pyq-user-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      viewsCount: 0,
      downloadsCount: 0,
      rating: 5.0,
      ratingCount: 1,
      reviews: [],
      comments: [],
    };
    papers.unshift(newPaper);
    this.savePapers(papers);
    return newPaper;
  },

  updatePaperStatus(id: string, status: PaperStatus, rejectionReason?: string): Paper | null {
    const papers = this.getPapers();
    const index = papers.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Paper = {
      ...papers[index],
      status,
      ...(status === 'approved' ? { approvedAt: new Date().toISOString() } : {}),
      ...(status === 'rejected' ? { rejectionReason: rejectionReason || 'Does not meet submission guidelines' } : {}),
    };

    papers[index] = updated;
    this.savePapers(papers);
    return updated;
  },

  deletePaper(id: string): boolean {
    const papers = this.getPapers();
    const filtered = papers.filter((p) => p.id !== id);
    if (filtered.length === papers.length) return false;
    this.savePapers(filtered);
    return true;
  },

  recordView(id: string): void {
    const papers = this.getPapers();
    const p = papers.find((item) => item.id === id);
    if (p) {
      p.viewsCount = (p.viewsCount || 0) + 1;
      this.savePapers(papers);
    }
  },

  recordDownload(id: string): void {
    const papers = this.getPapers();
    const p = papers.find((item) => item.id === id);
    if (p) {
      p.downloadsCount = (p.downloadsCount || 0) + 1;
      this.savePapers(papers);
    }
  },

  // Saved bookmarks
  getSavedPaperIds(): string[] {
    try {
      const stored = localStorage.getItem(SAVED_PAPERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['pyq-cbse-12-phy-2024', 'pyq-jee-main-2024-session1'];
    } catch {
      return [];
    }
  },

  isPaperSaved(id: string): boolean {
    return this.getSavedPaperIds().includes(id);
  },

  toggleSavePaper(id: string): boolean {
    try {
      const saved = this.getSavedPaperIds();
      const exists = saved.includes(id);
      const next = exists ? saved.filter((i) => i !== id) : [...saved, id];
      localStorage.setItem(SAVED_PAPERS_STORAGE_KEY, JSON.stringify(next));
      return !exists;
    } catch {
      return false;
    }
  },

  getBookmarkedPapers(): Paper[] {
    const savedIds = this.getSavedPaperIds();
    const all = this.getPapers();
    return all.filter((p) => savedIds.includes(p.id));
  },

  // Ratings & reviews (No login required)
  addReview(paperId: string, stars: number, text?: string, authorName: string = 'Student'): Paper | null {
    const papers = this.getPapers();
    const paper = papers.find((p) => p.id === paperId);
    if (!paper) return null;

    const newReview: PaperReview = {
      id: `rev-${Date.now()}`,
      stars,
      text: text?.trim(),
      authorName: authorName.trim() || 'Student',
      createdAt: new Date().toISOString(),
    };

    const currentReviews = paper.reviews || [];
    currentReviews.unshift(newReview);
    paper.reviews = currentReviews;

    const totalStars = currentReviews.reduce((acc, r) => acc + r.stars, 0);
    paper.rating = Number((totalStars / currentReviews.length).toFixed(1));
    paper.ratingCount = currentReviews.length;

    this.savePapers(papers);
    return paper;
  },

  // Comments (Login required)
  addComment(paperId: string, text: string, authorName: string, authorEmail?: string): Paper | null {
    const papers = this.getPapers();
    const paper = papers.find((p) => p.id === paperId);
    if (!paper) return null;

    const newComment: PaperComment = {
      id: `com-${Date.now()}`,
      authorName: authorName.trim(),
      authorEmail,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const currentComments = paper.comments || [];
    currentComments.unshift(newComment);
    paper.comments = currentComments;

    this.savePapers(papers);
    return paper;
  },
};
