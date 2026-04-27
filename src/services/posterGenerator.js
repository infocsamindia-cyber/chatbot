// ═══════════════════════════════════════════════════════════════
// AYANIX TECH — ULTRA RANDOM POSTER GENERATOR
// Har baar alag layout, color, style, content — kabhi same nahi!
// ═══════════════════════════════════════════════════════════════


const COMPANY = {
  name: 'AYANIX TECH',
  website: 'ayanixtech.com',
  taglines: [
    'We build high-converting websites for growing businesses.',
    'Fast delivery. Transparent pricing. Real results.',
    'Website • App • Software — We build it all.',
    'Your digital growth partner since 2026.',
    'From idea to live product in 15 days.',
    'Direct founder communication. No middlemen.',
    '10+ specialists. 27+ projects delivered.',
    'Mobile-first. SEO-ready. Conversion-focused.',
  ],
  stats: ['27+ Projects', '10+ Team', '15 Day Delivery', '100% Transparent'],
};

// ═══════════════════════════════════════════════════════════════
// COLOR THEMES — 16 unique themes
// ═══════════════════════════════════════════════════════════════
const THEMES = [
  { name: 'cosmic',    bg: ['#0F0C29', '#302B63', '#24243E'], a1: '#A78BFA', a2: '#EC4899', text: '#FFFFFF' },
  { name: 'ocean',     bg: ['#000428', '#004E92', '#1565C0'], a1: '#60A5FA', a2: '#34D399', text: '#FFFFFF' },
  { name: 'sunset',    bg: ['#1a0533', '#6B21A8', '#DB2777'], a1: '#F9A8D4', a2: '#FBBF24', text: '#FFFFFF' },
  { name: 'forest',    bg: ['#052e16', '#065F46', '#047857'], a1: '#34D399', a2: '#A3E635', text: '#FFFFFF' },
  { name: 'gold',      bg: ['#1C1917', '#292524', '#44403C'], a1: '#FBBF24', a2: '#F97316', text: '#FFFFFF' },
  { name: 'royal',     bg: ['#1e1b4b', '#312e81', '#3730A3'], a1: '#818CF8', a2: '#C084FC', text: '#FFFFFF' },
  { name: 'crimson',   bg: ['#450A0A', '#7F1D1D', '#991B1B'], a1: '#FCA5A5', a2: '#FBBF24', text: '#FFFFFF' },
  { name: 'midnight',  bg: ['#020617', '#0F172A', '#1E293B'], a1: '#38BDF8', a2: '#818CF8', text: '#FFFFFF' },
  { name: 'aurora',    bg: ['#022c22', '#134e4a', '#0f766e'], a1: '#5EEAD4', a2: '#A78BFA', text: '#FFFFFF' },
  { name: 'neon',      bg: ['#000000', '#0D0D0D', '#1A0A2E'], a1: '#FF00FF', a2: '#00FFFF', text: '#FFFFFF' },
  { name: 'rose',      bg: ['#2D0A1F', '#831843', '#9D174D'], a1: '#FDA4AF', a2: '#FCD34D', text: '#FFFFFF' },
  { name: 'slate',     bg: ['#0F172A', '#1E293B', '#334155'], a1: '#94A3B8', a2: '#38BDF8', text: '#FFFFFF' },
  { name: 'volcano',   bg: ['#1C0A00', '#7C2D12', '#C2410C'], a1: '#FB923C', a2: '#FCD34D', text: '#FFFFFF' },
  { name: 'galaxy',    bg: ['#030712', '#111827', '#1F2937'], a1: '#E879F9', a2: '#818CF8', text: '#FFFFFF' },
  { name: 'jungle',    bg: ['#052e16', '#14532d', '#166534'], a1: '#86EFAC', a2: '#FDE68A', text: '#FFFFFF' },
  { name: 'ice',       bg: ['#0C4A6E', '#075985', '#0369A1'], a1: '#7DD3FC', a2: '#E0F2FE', text: '#FFFFFF' },
];

// ═══════════════════════════════════════════════════════════════
// LAYOUT STYLES — 8 different layouts
// ═══════════════════════════════════════════════════════════════
const LAYOUTS = ['centered', 'diagonal', 'split', 'bold-top', 'magazine', 'minimal', 'frame', 'dynamic'];

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export const generatePoster = (text, platform, fullContent = '') => {
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // Pick random theme and layout — seed from time so always different
  const seed   = Date.now() + Math.random() * 10000;
  const theme  = THEMES[Math.floor(seed % THEMES.length)];
  const layout = LAYOUTS[Math.floor((seed * 1.7) % LAYOUTS.length)];
  const tagline = COMPANY.taglines[Math.floor((seed * 2.3) % COMPANY.taglines.length)];
  const servicePick = pickServices(seed);

  // Draw based on layout
  switch(layout) {
    case 'centered':    drawCentered(ctx, text, platform, theme, tagline, servicePick);    break;
    case 'diagonal':    drawDiagonal(ctx, text, platform, theme, tagline, servicePick);    break;
    case 'split':       drawSplit(ctx, text, platform, theme, tagline, servicePick);       break;
    case 'bold-top':    drawBoldTop(ctx, text, platform, theme, tagline, servicePick);     break;
    case 'magazine':    drawMagazine(ctx, text, platform, theme, tagline, servicePick);    break;
    case 'minimal':     drawMinimal(ctx, text, platform, theme, tagline, servicePick);     break;
    case 'frame':       drawFrame(ctx, text, platform, theme, tagline, servicePick);       break;
    case 'dynamic':     drawDynamic(ctx, text, platform, theme, tagline, servicePick);     break;
    default:            drawCentered(ctx, text, platform, theme, tagline, servicePick);
  }

  return canvas.toDataURL('image/png');
};

// ═══════════════════════════════════════════════════════════════
// LAYOUT 1 — CENTERED (Classic glassmorphism)
// ═══════════════════════════════════════════════════════════════
function drawCentered(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);
  drawBgPattern(ctx, theme, 'circles');
  drawGlowOrbs(ctx, theme);

  // Glass card
  drawGlassCard(ctx, 80, 80, 920, 920, 40, theme);

  // Decorative top line
  drawAccentLine(ctx, 160, 115, 760, 6, theme);

  // Logo area
  drawCompanyBadge(ctx, 540, 185, theme);

  // Platform badge
  drawPlatformBadge(ctx, 540, 240, platform, theme);

  // Big illustration
  drawCenteredIllustration(ctx, text, theme);

  // Main title
  const titleY = drawBigTitle(ctx, text, 540, 430, 820, theme);

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '26px Arial';
  ctx.textAlign = 'center';
  const tLines = wrapText(ctx, tagline, 700, '26px Arial');
  tLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 540, titleY + 60 + i * 38));

  // Services row
  drawServicesRow(ctx, services, 540, 760, theme);

  // Stats
  drawStatsBubbles(ctx, 540, 840, theme);

  // Bottom
  drawBottomBar(ctx, 900, theme);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 2 — DIAGONAL (Bold diagonal split)
// ═══════════════════════════════════════════════════════════════
function drawDiagonal(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);

  // Diagonal stripe
  ctx.save();
  ctx.globalAlpha = 0.15;
  const dg = ctx.createLinearGradient(0, 0, 1080, 1080);
  dg.addColorStop(0, theme.a1);
  dg.addColorStop(1, theme.a2);
  ctx.fillStyle = dg;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(1080, 0);
  ctx.lineTo(1080, 500); ctx.lineTo(0, 700);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  drawBgPattern(ctx, theme, 'grid');
  drawGlowOrbs(ctx, theme);
  drawGlassCard(ctx, 70, 70, 940, 940, 36, theme);

  // Top left company
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('AYANIX TECH', 130, 165);

  // Accent underline
  const ag = ctx.createLinearGradient(130, 0, 500, 0);
  ag.addColorStop(0, theme.a1); ag.addColorStop(1, theme.a2);
  ctx.fillStyle = ag;
  roundRect(ctx, 130, 172, 280, 5, 3); ctx.fill();

  // Platform top right
  drawPlatformBadge(ctx, 850, 155, platform, theme);

  // HUGE title left-aligned
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 68px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 20;
  const diagLines = wrapText(ctx, text.toUpperCase(), 900, 'bold 68px Arial');
  diagLines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 120, 330 + i * 82));
  ctx.shadowBlur = 0;

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '28px Arial';
  ctx.textAlign = 'left';
  const tl = wrapText(ctx, tagline, 800, '28px Arial');
  tl.slice(0,2).forEach((l,i) => ctx.fillText(l, 120, 590 + i*40));

  // Service pills left-aligned
  drawServicesLeft(ctx, services, 120, 680, theme);

  // Big right side emoji
  ctx.font = '160px Arial';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#fff';
  ctx.fillText(getTopicEmoji(text), 900, 600);
  ctx.globalAlpha = 1;

  // Stats bottom
  drawStatsBubbles(ctx, 540, 860, theme);
  drawBottomBar(ctx, 920, theme);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 3 — SPLIT (Left dark, right colored)
// ═══════════════════════════════════════════════════════════════
function drawSplit(ctx, text, platform, theme, tagline, services) {
  // Left half dark
  ctx.fillStyle = theme.bg[0];
  ctx.fillRect(0, 0, 540, 1080);

  // Right half gradient
  const rg = ctx.createLinearGradient(540, 0, 1080, 1080);
  rg.addColorStop(0, theme.a1 + 'CC');
  rg.addColorStop(1, theme.a2 + 'CC');
  ctx.fillStyle = rg;
  ctx.fillRect(540, 0, 540, 1080);

  drawBgPattern(ctx, theme, 'dots');

  // Diagonal divider line
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.3;
  ctx.beginPath(); ctx.moveTo(540, 0); ctx.lineTo(480, 1080); ctx.stroke();
  ctx.restore();

  // Left side content
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('AYANIX TECH', 60, 120);

  drawAccentLine(ctx, 60, 132, 300, 4, theme);

  // Big title left
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 58px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 15;
  const sLines = wrapText(ctx, text.toUpperCase(), 420, 'bold 58px Arial');
  sLines.slice(0, 4).forEach((l,i) => ctx.fillText(l, 55, 260 + i * 72));
  ctx.shadowBlur = 0;

  // Tagline left
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '24px Arial';
  const tl = wrapText(ctx, tagline, 420, '24px Arial');
  tl.slice(0,3).forEach((l,i) => ctx.fillText(l, 55, 620 + i*34));

  // Left services
  drawServicesLeft(ctx, services.slice(0,3), 55, 730, theme);

  // Right side — stats + platform
  drawPlatformBadge(ctx, 810, 120, platform, theme);

  // Big emoji right
  ctx.font = '130px Arial';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#fff';
  ctx.fillText(getTopicEmoji(text), 810, 450);
  ctx.globalAlpha = 1;

  // Right stats
  const stats = COMPANY.stats;
  stats.forEach((s, i) => {
    const sy = 550 + i * 80;
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    roundRect(ctx, 610, sy - 28, 340, 56, 28); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(s, 780, sy + 8);
  });

  // Bottom
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ayanixtech.com', 540, 980);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 4 — BOLD TOP (Huge header band)
// ═══════════════════════════════════════════════════════════════
function drawBoldTop(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);
  drawBgPattern(ctx, theme, 'hexagons');
  drawGlowOrbs(ctx, theme);

  // Bold top banner
  const bannerG = ctx.createLinearGradient(0, 0, 1080, 0);
  bannerG.addColorStop(0, theme.a1);
  bannerG.addColorStop(1, theme.a2);
  ctx.fillStyle = bannerG;
  ctx.fillRect(0, 0, 1080, 340);

  // Company in banner
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px Arial';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 10;
  ctx.fillText('✦ AYANIX TECH ✦', 540, 90);
  ctx.shadowBlur = 0;

  // Platform in banner
  drawPlatformBadge(ctx, 540, 145, platform, theme);

  // Topic text in banner
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 62px Arial';
  ctx.textAlign = 'center';
  const btLines = wrapText(ctx, text.toUpperCase(), 900, 'bold 62px Arial');
  btLines.slice(0,2).forEach((l,i) => ctx.fillText(l, 540, 230 + i * 72));

  // Glass card below
  drawGlassCard(ctx, 60, 360, 960, 640, 30, theme);

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  const tl = wrapText(ctx, tagline, 820, 'bold 30px Arial');
  tl.slice(0,2).forEach((l,i) => ctx.fillText(l, 540, 440 + i*42));

  // Services grid 2x3
  drawServicesGrid(ctx, services, 540, 580, theme);

  // Stats row
  drawStatsBubbles(ctx, 540, 820, theme);

  // Bottom
  ctx.fillStyle = theme.a1;
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ayanixtech.com', 540, 940);
  const date = new Date().toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'});
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '22px Arial';
  ctx.fillText(date, 540, 978);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 5 — MAGAZINE (Editorial style)
// ═══════════════════════════════════════════════════════════════
function drawMagazine(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);

  // Big background shape
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = theme.a1;
  ctx.beginPath();
  ctx.arc(900, 200, 400, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = theme.a2;
  ctx.beginPath();
  ctx.arc(150, 900, 350, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawBgPattern(ctx, theme, 'waves');
  drawGlassCard(ctx, 60, 60, 960, 960, 40, theme);

  // Issue label top
  ctx.fillStyle = theme.a1;
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('◆ AYANIX TECH  ◆  DIGITAL EDITION  ◆  ' + new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'}).toUpperCase(), 100, 120);

  drawAccentLine(ctx, 100, 130, 880, 3, theme);

  // Platform badge top right
  drawPlatformBadge(ctx, 890, 170, platform, theme);

  // HUGE topic word
  ctx.font = 'bold 88px Arial';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 25;
  const mLines = wrapText(ctx, text.toUpperCase(), 840, 'bold 88px Arial');
  mLines.slice(0,2).forEach((l,i) => ctx.fillText(l, 100, 290 + i*96));
  ctx.shadowBlur = 0;

  // Colored accent word (first word)
  
  // (already drawn above, this is decorative)

  // Tagline below
  drawAccentLine(ctx, 100, 540, 500, 3, theme);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '28px Arial';
  ctx.textAlign = 'left';
  const tl = wrapText(ctx, tagline, 820, '28px Arial');
  tl.slice(0,2).forEach((l,i) => ctx.fillText(l, 100, 580 + i*40));

  // Topic emoji right large
  ctx.font = '180px Arial';
  ctx.textAlign = 'right';
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#fff';
  ctx.fillText(getTopicEmoji(text), 980, 550);
  ctx.globalAlpha = 1;

  // Services magazine-style list
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'left';
  services.slice(0, 4).forEach((svc, i) => {
    ctx.fillStyle = theme.a1;
    ctx.fillText('→', 100, 690 + i * 45);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText(svc, 135, 690 + i * 45);
  });

  // Right side: stats vertical
  const stats = COMPANY.stats;
  stats.forEach((s, i) => {
    ctx.fillStyle = theme.a2;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(s, 960, 690 + i * 60);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(650, 696 + i * 60, 280, 1);
  });

  // Bottom
  drawBottomBar(ctx, 930, theme);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 6 — MINIMAL (Clean & modern)
// ═══════════════════════════════════════════════════════════════
function drawMinimal(ctx, text, platform, theme, tagline, services) {
  // Pure solid dark bg
  ctx.fillStyle = theme.bg[0];
  ctx.fillRect(0, 0, 1080, 1080);

  // Subtle grid
  ctx.save(); ctx.globalAlpha = 0.03; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  for(let x=0;x<1080;x+=54){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1080);ctx.stroke();}
  for(let y=0;y<1080;y+=54){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1080,y);ctx.stroke();}
  ctx.restore();

  // Single glow
  const g = ctx.createRadialGradient(540, 300, 0, 540, 300, 500);
  g.addColorStop(0, theme.a1 + '20'); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(0,0,1080,1080);

  // Top accent bar full width
  const ag = ctx.createLinearGradient(0,0,1080,0);
  ag.addColorStop(0,theme.a1); ag.addColorStop(1,theme.a2);
  ctx.fillStyle = ag; ctx.fillRect(0, 0, 1080, 8);

  // Company top center
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '22px Arial'; ctx.textAlign = 'center';
  ctx.fillText('A Y A N I X  T E C H', 540, 80);

  // Platform
  drawPlatformBadge(ctx, 540, 130, platform, theme);

  // MASSIVE title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 76px Arial'; ctx.textAlign = 'center';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 30;
  const minLines = wrapText(ctx, text.toUpperCase(), 920, 'bold 76px Arial');
  minLines.slice(0,3).forEach((l,i) => ctx.fillText(l, 540, 320 + i * 90));
  ctx.shadowBlur = 0;

  // Horizontal rule
  ctx.save(); ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(200, 600); ctx.lineTo(880, 600); ctx.stroke();
  ctx.restore();

  // Tagline
  ctx.fillStyle = theme.a1; ctx.font = 'bold 28px Arial'; ctx.textAlign = 'center';
  ctx.fillText(tagline.length > 60 ? tagline.slice(0,60)+'...' : tagline, 540, 650);

  // 3 service pills centered
  const minSvc = services.slice(0,3);
  const totalW2 = minSvc.reduce((a,s) => a + ctx.measureText(s).width + 48, 0) + 20 * (minSvc.length-1);
  let sx = 540 - totalW2/2;
  minSvc.forEach(svc => {
    const sw = ctx.measureText(svc).width + 48;
    ctx.fillStyle = theme.a1 + '25';
    roundRect(ctx, sx, 700, sw, 44, 22); ctx.fill();
    ctx.strokeStyle = theme.a1; ctx.lineWidth = 1.5;
    roundRect(ctx, sx, 700, sw, 44, 22); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
    ctx.fillText(svc, sx + sw/2, 728);
    sx += sw + 20;
  });

  // Bottom accent bar
  ctx.fillStyle = ag; ctx.fillRect(0, 1072, 1080, 8);

  // Website
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '26px Arial'; ctx.textAlign = 'center';
  ctx.fillText('ayanixtech.com', 540, 860);
  const date = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '20px Arial';
  ctx.fillText(date, 540, 895);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 7 — FRAME (Ornate bordered)
// ═══════════════════════════════════════════════════════════════
function drawFrame(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);
  drawBgPattern(ctx, theme, 'dots');
  drawGlowOrbs(ctx, theme);

  // Outer frame
  ctx.save();
  const fg = ctx.createLinearGradient(0,0,1080,1080);
  fg.addColorStop(0, theme.a1); fg.addColorStop(1, theme.a2);
  ctx.strokeStyle = fg; ctx.lineWidth = 8;
  roundRect(ctx, 30, 30, 1020, 1020, 30); ctx.stroke();

  // Inner frame
  ctx.strokeStyle = fg; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
  roundRect(ctx, 50, 50, 980, 980, 24); ctx.stroke();
  ctx.restore();

  // Corner ornaments
  const corners = [[60,60],[1020,60],[60,1020],[1020,1020]];
  corners.forEach(([x,y]) => {
    ctx.fillStyle = theme.a1; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Company
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 40px Arial'; ctx.textAlign = 'center';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 15;
  ctx.fillText('⚡ AYANIX TECH ⚡', 540, 145);
  ctx.shadowBlur = 0;
  drawAccentLine(ctx, 200, 158, 680, 5, theme);

  // Platform
  drawPlatformBadge(ctx, 540, 210, platform, theme);

  // Illustration
  drawFrameIllustration(ctx, text, theme);

  // Main title
  drawBigTitle(ctx, text, 540, 420, 840, theme);

  // Ornate divider
  ctx.fillStyle = theme.a2; ctx.font = '28px Arial'; ctx.textAlign = 'center';
  ctx.fillText('✦  ✦  ✦', 540, 570);

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '26px Arial';
  const tl = wrapText(ctx, tagline, 780, '26px Arial');
  tl.slice(0,2).forEach((l,i) => ctx.fillText(l, 540, 615 + i*38));

  // Services ornate
  drawServicesRow(ctx, services, 540, 730, theme);
  drawStatsBubbles(ctx, 540, 820, theme);
  drawBottomBar(ctx, 905, theme);
}

// ═══════════════════════════════════════════════════════════════
// LAYOUT 8 — DYNAMIC (Energetic asymmetric)
// ═══════════════════════════════════════════════════════════════
function drawDynamic(ctx, text, platform, theme, tagline, services) {
  drawGradientBg(ctx, theme);

  // Dynamic shapes
  ctx.save();
  ctx.globalAlpha = 0.12;
  const dg = ctx.createLinearGradient(0,0,1080,1080);
  dg.addColorStop(0, theme.a1); dg.addColorStop(1, theme.a2);
  ctx.fillStyle = dg;
  // Triangle top-right
  ctx.beginPath(); ctx.moveTo(600,0); ctx.lineTo(1080,0); ctx.lineTo(1080,600); ctx.closePath(); ctx.fill();
  // Triangle bottom-left
  ctx.beginPath(); ctx.moveTo(0,500); ctx.lineTo(0,1080); ctx.lineTo(500,1080); ctx.closePath(); ctx.fill();
  ctx.restore();

  drawBgPattern(ctx, theme, 'circles');
  drawGlowOrbs(ctx, theme);
  drawGlassCard(ctx, 65, 65, 950, 950, 36, theme);

  // Company top
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 36px Arial'; ctx.textAlign = 'left';
  ctx.fillText('AYANIX TECH', 120, 155);
  drawAccentLine(ctx, 120, 165, 340, 5, theme);

  // Platform right
  drawPlatformBadge(ctx, 900, 150, platform, theme);

  // Giant topic — asymmetric
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 72px Arial'; ctx.textAlign = 'left';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 20;
  const dynLines = wrapText(ctx, text.toUpperCase(), 920, 'bold 72px Arial');
  dynLines.slice(0,3).forEach((l,i) => ctx.fillText(l, 110, 310 + i * 85));
  ctx.shadowBlur = 0;

  // Accent number (days / projects)
  ctx.fillStyle = theme.a1; ctx.font = 'bold 120px Arial'; ctx.textAlign = 'right';
  ctx.globalAlpha = 0.08; ctx.fillText('27+', 980, 500); ctx.globalAlpha = 1;

  // Tagline
  ctx.fillStyle = theme.a2; ctx.font = 'bold 26px Arial'; ctx.textAlign = 'left';
  ctx.fillText('— ' + tagline.slice(0,65), 110, 640);

  // Service chips
  drawServicesLeft(ctx, services, 110, 710, theme);

  // Right side floating stats
  [[27, 'Projects'], [10, 'Team Members'], [15, 'Day Delivery'], [100, '% Transparent']].forEach((s,i) => {
    ctx.fillStyle = theme.a1 + '20';
    roundRect(ctx, 680, 680 + i*60, 290, 48, 24); ctx.fill();
    ctx.strokeStyle = theme.a1; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    roundRect(ctx, 680, 680 + i*60, 290, 48, 24); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = theme.a1; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'left';
    ctx.fillText(s[0]+'+ '+s[1], 710, 712 + i*60);
  });

  drawBottomBar(ctx, 935, theme);
}

// ═══════════════════════════════════════════════════════════════
// SHARED DRAWING HELPERS
// ═══════════════════════════════════════════════════════════════
function drawGradientBg(ctx, theme) {
  const g = ctx.createLinearGradient(0, 0, 1080, 1080);
  g.addColorStop(0,   theme.bg[0]);
  g.addColorStop(0.5, theme.bg[1]);
  g.addColorStop(1,   theme.bg[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1080, 1080);
}

function drawBgPattern(ctx, theme, type) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  if(type === 'grid') {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    for(let x=0;x<1080;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1080);ctx.stroke();}
    for(let y=0;y<1080;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1080,y);ctx.stroke();}
  } else if(type==='circles') {
    ctx.strokeStyle = theme.a1; ctx.lineWidth = 1.5;
    [[200,200,280],[900,800,220],[540,540,380],[120,880,180],[950,200,150]].forEach(([x,y,r])=>{
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
    });
  } else if(type==='dots') {
    ctx.fillStyle = '#fff';
    for(let x=40;x<1080;x+=65){for(let y=40;y<1080;y+=65){ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();}}
  } else if(type==='waves') {
    ctx.strokeStyle = theme.a1; ctx.lineWidth = 1.5;
    for(let i=0;i<7;i++){
      ctx.beginPath();
      for(let x=0;x<=1080;x+=8){
        const y = 130*i + 60*Math.sin((x+i*50)/100);
        i===0&&x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
  } else if(type==='hexagons') {
    ctx.strokeStyle = theme.a2; ctx.lineWidth = 1;
    for(let row=0;row<7;row++)for(let col=0;col<7;col++){
      drawHex(ctx, col*155+(row%2?77:0), row*135, 50);
    }
  }
  ctx.restore();
}

function drawGlowOrbs(ctx, theme) {
  [[160,200,theme.a1],[920,840,theme.a2],[540,90,theme.a1],[80,900,theme.a2]].forEach(([x,y,c])=>{
    const g = ctx.createRadialGradient(x,y,0,x,y,220);
    g.addColorStop(0, c+'30'); g.addColorStop(1,'transparent');
    ctx.fillStyle = g; ctx.fillRect(0,0,1080,1080);
  });
}

function drawGlassCard(ctx, x, y, w, h, r, theme) {
  ctx.save();
  ctx.globalAlpha = 0.10; ctx.fillStyle = '#fff';
  roundRect(ctx,x,y,w,h,r); ctx.fill();
  ctx.globalAlpha = 0.20; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
  roundRect(ctx,x,y,w,h,r); ctx.stroke();
  ctx.restore();
}

function drawAccentLine(ctx, x, y, w, h, theme) {
  const g = ctx.createLinearGradient(x,0,x+w,0);
  g.addColorStop(0,theme.a1); g.addColorStop(1,theme.a2);
  ctx.fillStyle = g;
  roundRect(ctx,x,y,w,h,h/2); ctx.fill();
}

function drawCompanyBadge(ctx, cx, y, theme) {
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial'; ctx.textAlign = 'center';
  ctx.shadowColor = theme.a1; ctx.shadowBlur = 18;
  ctx.fillText('AYANIX TECH', cx, y);
  ctx.shadowBlur = 0;
}

function drawPlatformBadge(ctx, cx, y, platform, theme) {
  const platC = {
    instagram:['#833AB4','#E1306C'], linkedin:['#0077B5','#00A0DC'],
    twitter:  ['#1DA1F2','#0D8FD8'], facebook: ['#1877F2','#0C5FD4'],
    youtube:  ['#FF0000','#CC0000'], threads:  ['#555555','#333333'],
  };
  const c = platC[platform] || [theme.a1, theme.a2];
  const g = ctx.createLinearGradient(cx-130,0,cx+130,0);
  g.addColorStop(0,c[0]); g.addColorStop(1,c[1]);
  ctx.fillStyle = g;
  roundRect(ctx, cx-130, y-20, 260, 44, 22); ctx.fill();
  ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'center';
  ctx.fillText(platform.charAt(0).toUpperCase()+platform.slice(1), cx, y+8);
}

function drawBigTitle(ctx, text, cx, y, maxW, theme) {
  ctx.font = 'bold 58px Arial'; ctx.textAlign = 'center';
  const lines = wrapText(ctx, text.toUpperCase(), maxW, 'bold 58px Arial');
  const slice = lines.slice(0,3);
  ctx.save(); ctx.shadowColor = theme.a1; ctx.shadowBlur = 18; ctx.fillStyle = '#FFFFFF';
  slice.forEach((l,i) => ctx.fillText(l, cx, y + i*72));
  ctx.restore();
  return y + slice.length * 72;
}

function drawServicesRow(ctx, services, cx, y, theme) {
  ctx.font = 'bold 19px Arial';
  const pillH = 36; const gap = 10;
  const measured = services.map(s=>({s, w:ctx.measureText(s).width+36}));
  const totalW = measured.reduce((a,m)=>a+m.w+gap,0)-gap;
  let x = cx - totalW/2;
  measured.forEach(({s,w})=>{
    ctx.save(); ctx.globalAlpha=0.18; ctx.fillStyle=theme.a1;
    roundRect(ctx,x,y-pillH/2,w,pillH,pillH/2); ctx.fill();
    ctx.globalAlpha=0.35; ctx.strokeStyle=theme.a1; ctx.lineWidth=1.2;
    roundRect(ctx,x,y-pillH/2,w,pillH,pillH/2); ctx.stroke(); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.textAlign='center';
    ctx.fillText(s, x+w/2, y+7); x+=w+gap;
  });
}

function drawServicesLeft(ctx, services, x, y, theme) {
  ctx.font = 'bold 19px Arial'; ctx.textAlign = 'left';
  const pillH = 36; const gap = 10; let cx = x;
  services.forEach(svc => {
    const w = ctx.measureText(svc).width + 36;
    if(cx + w > 1020){ cx = x; y += pillH + 8; }
    ctx.save(); ctx.globalAlpha=0.18; ctx.fillStyle=theme.a1;
    roundRect(ctx,cx,y-pillH/2,w,pillH,pillH/2); ctx.fill();
    ctx.globalAlpha=0.35; ctx.strokeStyle=theme.a1; ctx.lineWidth=1.2;
    roundRect(ctx,cx,y-pillH/2,w,pillH,pillH/2); ctx.stroke(); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.textAlign='center';
    ctx.fillText(svc, cx+w/2, y+7); cx += w + gap;
  });
}

function drawServicesGrid(ctx, services, cx, y, theme) {
  const cols = 3; const cellW = 270; const cellH = 54; const gap = 12;
  const totalW = cols*cellW + (cols-1)*gap;
  const startX = cx - totalW/2;
  services.slice(0,6).forEach((svc,i) => {
    const col = i%cols; const row = Math.floor(i/cols);
    const bx = startX + col*(cellW+gap);
    const by = y + row*(cellH+gap);
    ctx.save(); ctx.globalAlpha=0.15; ctx.fillStyle=theme.a1;
    roundRect(ctx,bx,by,cellW,cellH,cellH/2); ctx.fill();
    ctx.globalAlpha=0.3; ctx.strokeStyle=theme.a1; ctx.lineWidth=1;
    roundRect(ctx,bx,by,cellW,cellH,cellH/2); ctx.stroke(); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,0.85)'; ctx.font='bold 20px Arial'; ctx.textAlign='center';
    ctx.fillText(svc, bx+cellW/2, by+cellH/2+7);
  });
}

function drawStatsBubbles(ctx, cx, y, theme) {
  const stats = COMPANY.stats;
  const bw = 200; const gap = 14;
  const totalW = stats.length*(bw+gap)-gap;
  let x = cx - totalW/2;
  stats.forEach(s => {
    ctx.save(); ctx.globalAlpha=0.12; ctx.fillStyle='#fff';
    roundRect(ctx,x,y-20,bw,40,20); ctx.fill();
    ctx.globalAlpha=0.25; ctx.strokeStyle=theme.a1; ctx.lineWidth=1;
    roundRect(ctx,x,y-20,bw,40,20); ctx.stroke(); ctx.restore();
    ctx.fillStyle=theme.a1; ctx.font='bold 19px Arial'; ctx.textAlign='center';
    ctx.fillText(s, x+bw/2, y+7); x+=bw+gap;
  });
}

function drawBottomBar(ctx, y, theme) {
  ctx.save(); ctx.globalAlpha=0.25; ctx.strokeStyle='#fff'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(130,y); ctx.lineTo(950,y); ctx.stroke(); ctx.restore();
  ctx.fillStyle=theme.a1; ctx.font='bold 30px Arial'; ctx.textAlign='center';
  ctx.fillText('ayanixtech.com', 540, y+44);
  const date = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='20px Arial';
  ctx.fillText(date+'  •  Website • App • Software', 540, y+74);
}

function drawCenteredIllustration(ctx, text, theme) {
  // Left floating icons
  ctx.save(); ctx.font='38px Arial'; ctx.globalAlpha=0.18; ctx.fillStyle='#fff'; ctx.textAlign='center';
  getFloatIcons(text).forEach((ic,i) => ctx.fillText(ic, 130, 300+i*90));
  ctx.restore();
  // Right big faded emoji
  ctx.save(); ctx.font='140px Arial'; ctx.globalAlpha=0.10; ctx.fillStyle='#fff'; ctx.textAlign='center';
  ctx.fillText(getTopicEmoji(text), 900, 480); ctx.restore();
}

function drawFrameIllustration(ctx, text, theme) {
  ctx.save(); ctx.font='52px Arial'; ctx.globalAlpha=0.12; ctx.fillStyle='#fff'; ctx.textAlign='center';
  const icons = getFloatIcons(text);
  ctx.fillText(icons[0], 160, 350); ctx.fillText(icons[1]||'✨', 920, 300);
  ctx.restore();
}

function getTopicEmoji(text) {
  const t = text.toLowerCase();
  if(t.includes('web')||t.includes('code'))  return '💻';
  if(t.includes('ai')||t.includes('tool'))   return '🤖';
  if(t.includes('app')||t.includes('mobil')) return '📱';
  if(t.includes('team')||t.includes('peopl'))return '👥';
  if(t.includes('growth')||t.includes('seo'))return '📈';
  if(t.includes('design')||t.includes('ui')) return '🎨';
  if(t.includes('launch')||t.includes('proj'))return '🚀';
  if(t.includes('client'))                   return '🤝';
  if(t.includes('software'))                 return '⚙️';
  return '💡';
}

function getFloatIcons(text) {
  const t = text.toLowerCase();
  if(t.includes('web'))    return ['💻','🌐','⚙️'];
  if(t.includes('ai'))     return ['🤖','🧠','⚡'];
  if(t.includes('app'))    return ['📱','🚀','✨'];
  if(t.includes('design')) return ['🎨','✏️','📐'];
  if(t.includes('growth')) return ['📈','💰','🎯'];
  if(t.includes('team'))   return ['👥','🏆','🤝'];
  if(t.includes('software'))return ['⚙️','🔧','💡'];
  return ['🚀','💡','⭐'];
}

function pickServices(seed) {
  // Always include website, app, software + 3 random others
  const fixed = ['🌐 Website', '📱 App Dev', '⚙️ Software'];
  const extras = ['🎨 UI/UX', '📢 Meta Ads', '🔍 SEO', '🛒 E-Commerce', '📊 Analytics'];
  const shuffled = extras.sort(()=>Math.random()-0.5).slice(0,3);
  return [...fixed, ...shuffled];
}

// ═══════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════
function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(' ');
  const lines = []; let cur = '';
  for(const w of words){
    const test = cur ? cur+' '+w : w;
    if(ctx.measureText(test).width > maxWidth){ if(cur)lines.push(cur); cur=w; }
    else cur=test;
  }
  if(cur) lines.push(cur);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.arcTo(x+w,y,x+w,y+r,r); ctx.lineTo(x+w,y+h-r);
  ctx.arcTo(x+w,y+h,x+w-r,y+h,r); ctx.lineTo(x+r,y+h);
  ctx.arcTo(x,y+h,x,y+h-r,r); ctx.lineTo(x,y+r);
  ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

function drawHex(ctx, cx, cy, r) {
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=(Math.PI/3)*i-Math.PI/6;
    const x=cx+r*Math.cos(a); const y=cy+r*Math.sin(a);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.stroke();
}