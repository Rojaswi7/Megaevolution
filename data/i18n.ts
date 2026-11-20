// UI strings for the shared chrome (header, footer, CTAs).
// Page body copy is English in every locale for the mockup — the structure
// (locale routes, hreflang, per-locale dictionaries) is real. See HANDOFF.md.
import type { Locale } from './site'

const en = {
  nav: { creators: 'Creators', tools: 'Tools', video: 'Video Editing', agency: 'Agency', markets: 'Markets', ai: 'Connect your AI', blog: 'Blog' },
  new: 'New',
  searchPlaceholder: 'Search creators, tools, help…',
  login: 'Log in',
  signup: 'Sign up',
  request: 'Request a campaign',
  searchCreators: 'Search creators',
  menu: 'Menu',
  close: 'Close',
  language: 'Language',
  currency: 'Currency',
  footerTag: 'Reach globally, delivered locally.',
  newsletterTitle: 'The market report, once a month',
  newsletterText: 'What’s selling, which platforms are moving and what creators charge, by market.',
  newsletterCta: 'Subscribe',
  emailLabel: 'Work email',
  skip: 'Skip to content',
}
export type Dict = typeof en

const ko: Dict = {
  ...en,
  nav: { creators: '크리에이터 마케팅', tools: '툴', video: '영상 편집', agency: '에이전시', markets: '마켓', ai: 'AI 연결', blog: '블로그' },
  new: '신규', searchPlaceholder: '크리에이터, 툴, 도움말 검색…', login: '로그인', signup: '회원가입', request: '캠페인 문의',
  searchCreators: '크리에이터 검색', menu: '메뉴', close: '닫기', language: '언어', currency: '통화',
  footerTag: '글로벌하게, 현지답게.', newsletterTitle: '월간 마켓 리포트', newsletterCta: '구독하기', emailLabel: '업무용 이메일', skip: '본문으로 건너뛰기',
}
const ja: Dict = {
  ...en,
  nav: { creators: 'クリエイターマーケティング', tools: 'ツール', video: '動画編集', agency: 'エージェンシー', markets: 'マーケット', ai: 'AI連携', blog: 'ブログ' },
  new: '新着', searchPlaceholder: 'クリエイター、ツール、ヘルプを検索…', login: 'ログイン', signup: '登録', request: 'キャンペーンを相談',
  searchCreators: 'クリエイターを探す', menu: 'メニュー', close: '閉じる', language: '言語', currency: '通貨',
  footerTag: '世界へ届け、現地で動かす。', newsletterTitle: '月刊マーケットレポート', newsletterCta: '購読する', emailLabel: '仕事用メール', skip: '本文へスキップ',
}
const zh: Dict = {
  ...en,
  nav: { creators: '达人营销', tools: '工具', video: '视频剪辑', agency: '代运营', markets: '市场', ai: '连接你的 AI', blog: '博客' },
  new: '新', searchPlaceholder: '搜索达人、工具、帮助…', login: '登录', signup: '注册', request: '咨询合作',
  searchCreators: '搜索达人', menu: '菜单', close: '关闭', language: '语言', currency: '货币',
  footerTag: '触达全球，本地执行。', newsletterTitle: '每月市场报告', newsletterCta: '订阅', emailLabel: '工作邮箱', skip: '跳到正文',
}
const vi: Dict = {
  ...en,
  nav: { creators: 'Creator Marketing', tools: 'Công cụ', video: 'Dựng video', agency: 'Agency', markets: 'Thị trường', ai: 'Kết nối AI', blog: 'Blog' },
  new: 'Mới', searchPlaceholder: 'Tìm creator, công cụ, trợ giúp…', login: 'Đăng nhập', signup: 'Đăng ký', request: 'Yêu cầu chiến dịch',
  searchCreators: 'Tìm creator', menu: 'Menu', close: 'Đóng', language: 'Ngôn ngữ', currency: 'Tiền tệ',
  footerTag: 'Vươn ra toàn cầu, triển khai bản địa.', newsletterTitle: 'Báo cáo thị trường hằng tháng', newsletterCta: 'Đăng ký', emailLabel: 'Email công việc', skip: 'Đến nội dung chính',
}

const DICTS: Record<Locale, Dict> = { en, ko, ja, zh, vi }
export const getDict = (lang: string): Dict => DICTS[lang as Locale] || en
