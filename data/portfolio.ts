// SAMPLE DATA — placeholder portfolio items for the Video Editing Studio carousel.
// Admins add, reorder and hide items per market; real videos replace these tiles (poster + lazy load).
export type PortfolioItem = { id: string; market: 'KR' | 'JP' | 'EN'; title: string; type: 'Short' | 'Long'; length: string; tone: number; note: string }

export const PORTFOLIO: PortfolioItem[] = [
  { id: 'kr-1', market: 'KR', title: '세럼 3일 사용 후기', type: 'Short', length: '0:24', tone: 1, note: 'Captions, jump cuts, product close-ups' },
  { id: 'kr-2', market: 'KR', title: '성수 팝업 브이로그', type: 'Short', length: '0:38', tone: 5, note: 'Vlog cut-down with music' },
  { id: 'kr-3', market: 'KR', title: '브랜드 스토리 인터뷰', type: 'Long', length: '6:12', tone: 2, note: 'Two-camera interview, lower thirds' },
  { id: 'kr-4', market: 'KR', title: '언박싱 하이라이트', type: 'Short', length: '0:19', tone: 3, note: 'Unboxing, hook in the first second' },
  { id: 'jp-1', market: 'JP', title: 'コンビニ新作レビュー', type: 'Short', length: '0:31', tone: 6, note: 'Review with on-screen ratings' },
  { id: 'jp-2', market: 'JP', title: '朝のスキンケア', type: 'Short', length: '0:22', tone: 0, note: 'Routine, step captions' },
  { id: 'jp-3', market: 'JP', title: 'デスクツアー完全版', type: 'Long', length: '8:40', tone: 4, note: 'Chapters, B-roll, product links' },
  { id: 'jp-4', market: 'JP', title: '新作ゲーム 30秒まとめ', type: 'Short', length: '0:30', tone: 7, note: 'Gameplay highlights' },
  { id: 'en-1', market: 'EN', title: '3 things I’d buy again', type: 'Short', length: '0:21', tone: 1, note: 'Listicle, captions, cuts, music' },
  { id: 'en-2', market: 'EN', title: 'Founder story, cut for YouTube', type: 'Long', length: '5:05', tone: 5, note: 'Interview with archive footage' },
  { id: 'en-3', market: 'EN', title: 'Before / after in 15 seconds', type: 'Short', length: '0:15', tone: 3, note: 'Split screen, one message' },
  { id: 'en-4', market: 'EN', title: 'How to use it, step by step', type: 'Short', length: '0:42', tone: 2, note: 'Tutorial with numbered steps' },
]
