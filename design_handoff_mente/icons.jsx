// Inline SVG icon set for Mente app — 1.75 stroke, rounded, lucide-ish but custom
// Usage: <Icon name="home" size={20} />

const ICON_PATHS = {
  home:   <><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2v-9z"/></>,
  users:  <><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="6" r="2.5"/><path d="M21 17c0-2.5-1.6-4-4-4"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><circle cx="8.5" cy="14.5" r="1" fill="currentColor"/><circle cx="12" cy="14.5" r="1" fill="currentColor"/></>,
  wallet: <><path d="M3 7a2 2 0 0 1 2-2h13l3 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M3 9h13"/><circle cx="17" cy="13" r="1.4" fill="currentColor"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2.1 1.2L5.1 6 3 9.4l2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.1 1.2L10 21h4l.5-2.6a7 7 0 0 0 2.1-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/></>,
  bell:   <><path d="M6 8a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
  search: <><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></>,
  plus:   <><path d="M12 5v14M5 12h14"/></>,
  filter: <><path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/></>,
  chevron:<><path d="M9 6l6 6-6 6"/></>,
  check:  <><path d="M5 12l5 5 9-11"/></>,
  x:      <><path d="M6 6l12 12M18 6L6 18"/></>,
  arrow:  <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  arrowback: <><path d="M19 12H5M11 6l-6 6 6 6"/></>,
  more:   <><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></>,
  phone:  <><path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></>,
  msg:    <><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></>,
  clock:  <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  trend:  <><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></>,
  sparkle:<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17z"/></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></>,
  heart:  <><path d="M12 20s-7-4.5-9-9.5C1.5 6.5 4.5 4 7.5 4c1.8 0 3.4.9 4.5 2.5C13.1 4.9 14.7 4 16.5 4c3 0 6 2.5 4.5 6.5-2 5-9 9.5-9 9.5z"/></>,
  brain:  <><path d="M12 5a3 3 0 0 0-3 3v.5A3 3 0 0 0 6 11v1a3 3 0 0 0 1.5 2.6V16a3 3 0 0 0 4.5 2.6 3 3 0 0 0 4.5-2.6v-1.4A3 3 0 0 0 18 12v-1a3 3 0 0 0-3-2.5V8a3 3 0 0 0-3-3z"/><path d="M12 5v14M9 9h6M9 14h6"/></>,
  download: <><path d="M12 4v12M6 11l6 6 6-6M4 20h16"/></>,
  doc:    <><path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h4M8 13h8M8 17h5"/></>,
  pix:    <><path d="M5 12L12 5l7 7-7 7-7-7zM9 12l3 3 3-3-3-3-3 3z"/></>,
  card:   <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></>,
  bolt:   <><path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z"/></>,
  tag:    <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z"/><circle cx="8" cy="8" r="1.5"/></>,
  lock:   <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
  user:   <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H10"/></>,
  moon:   <><path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10z"/></>,
  globe:  <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  edit:   <><path d="M16 3l5 5-12 12H4v-5L16 3z"/></>,
  trash:  <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></>,
  list:   <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></>,
  pin:    <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
  video:  <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/></>,
  star:   <><path d="M12 3l2.7 5.5 6.3.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.4l6.3-.9L12 3z"/></>,
  refresh:<><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 4v4h-4M21 12a9 9 0 0 1-15.5 6.3L3 16M3 20v-4h4"/></>,
  pie:    <><path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M14 3a7 7 0 0 1 7 7h-7V3z"/></>,
  arrowdown: <><path d="M12 4v16M6 14l6 6 6-6"/></>,
  arrowup:   <><path d="M12 20V4M6 10l6-6 6 6"/></>,
};

function Icon({ name, size = 20, color, stroke = 1.75, fill = 'none', style }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={color || 'currentColor'} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }}
    >
      {path}
    </svg>
  );
}

window.Icon = Icon;
