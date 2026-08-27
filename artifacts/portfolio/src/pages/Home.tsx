import React, { useState, useEffect, useRef } from 'react';
import lottieWeb from 'lottie-web';
import MdiIcon from '@mdi/react';
import {
  mdiBookOpenPageVariant,
  mdiFilmstrip,
  mdiPrinter,
  mdiDisc,
  mdiGamepadVariant,
  mdiRocketLaunch,
  mdiTrophy,
  mdiPalette,
  mdiMovieOpen,
  mdiHammerWrench,
  mdiRobot,
  mdiLightningBolt,
} from '@mdi/js';

// ── Assets ───────────────────────────────────────────────────────────────────
// Hero images live in /public so the browser can preload them before JS runs
const BASE = import.meta.env.BASE_URL;
const heroAbstract = `${BASE}hero-abstract.jpg`;
// Arcade gameplay sound is intentionally desktop-only. Mobile stays silent to
// preserve the responsive pointer controls on physical devices.
const canUseDesktopArcadeAudio = () => (
  typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
);

import projectMasterData  from '@assets/images/projects/master-data-quest.jpg';
import projectMasterDataVideo from '@assets/images/projects/master-data-quest.mp4';
import projectWorldCup    from '@assets/images/projects/world-cup.jpg';
import projectWorldCupVideo from '@assets/images/projects/world-cup.mp4';
import projectRoi         from '@assets/images/projects/roi-calculator-bg.jpg';
import projectRoiVideo    from '@assets/images/projects/roi-calculator.mp4';
import projectQuiz        from '@assets/images/projects/quiz.jpg';
import projectQuizVideo   from '@assets/images/projects/quiz.mp4';
import projectShipFaster  from '@assets/images/projects/ship-faster.png';
import starbreakerLogo    from '@assets/starbreaker-logo_1787704094669.png';
// robotLottie loaded lazily in CardMedia via IntersectionObserver

import brandTerrain       from '@assets/images/brand/terrain.jpg';
import brandTamr          from '@assets/images/brand/tamr.jpg';
import brandLocalytics    from '@assets/images/brand/localytics-web.jpg';
import brandRevenueBase   from '@assets/images/brand/revenuebase.webp';
import brandAlex          from '@assets/images/brand/alex.webp';
import brandPluto         from '@assets/images/brand/pluto.webp';
import brandDental        from '@assets/images/brand/alabaster-dental.jpg';
import brandVictorFox     from '@assets/images/brand/victor-fox.jpg';
import brandBridgeBuilder from '@assets/images/brand/bridge-builder.webp';

// ── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: '30+',  label: 'Years Directing\nCreative' },
  { value: '2M',   label: 'Monthly Uniques\nGrown from 0' },
  { value: '$10M', label: 'Pipeline from\nABM Design' },
  { value: '22%',  label: 'Trial Lift from\nUX Testing' },
];

const testimonials = [
  {
    name: 'Don Mikell',
    role: 'Independent Consultant | Product Innovation & Development',
    quote: 'Trey is a true renaissance man… a practical perfectionist that will ‘do what it takes’ to get the best solution on budget and on time.',
  },
  {
    name: 'Kevin Corcoran',
    role: 'Retired Brand Marketing & Creative',
    quote: 'Trey is extremely creative and quick… and always brings great ideas and results in a fast time frame.',
  },
  {
    name: 'JJ Lee',
    role: 'Product Design @ Amenities Health',
    quote: 'Trey’s vision for developing the brand and the role of design in a company is amazing.',
  },
];

type ScoreEntry = {
  id?: string;
  name: string;
  score: number;
  level: number;
  created_at?: string;
};

const LOCAL_SCORE_KEY = 'trey-arcade-high-scores';
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const readLocalScores = (): ScoreEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(LOCAL_SCORE_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 10) : [];
  } catch {
    return [];
  }
};

const saveLocalScore = (entry: ScoreEntry) => {
  if (typeof window === 'undefined') return;
  const scores = [...readLocalScores(), entry]
    .sort((a, b) => b.score - a.score || b.level - a.level)
    .slice(0, 10);
  window.localStorage.setItem(LOCAL_SCORE_KEY, JSON.stringify(scores));
};

const fetchLeaderboard = async (): Promise<ScoreEntry[]> => {
  if (!supabaseUrl || !supabaseAnonKey) return readLocalScores();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/arcade_scores?select=id,name,score,level,created_at&order=score.desc,level.desc&limit=10`,
    { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } },
  );
  if (!response.ok) throw new Error('Leaderboard unavailable');
  return response.json() as Promise<ScoreEntry[]>;
};

const submitLeaderboardScore = async (entry: ScoreEntry): Promise<ScoreEntry[]> => {
  if (!supabaseUrl || !supabaseAnonKey) {
    saveLocalScore(entry);
    return readLocalScores();
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/submit_arcade_score`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ player_name: entry.name, player_score: entry.score, player_level: entry.level }),
  });
  if (!response.ok) throw new Error('Score submission failed');
  return fetchLeaderboard();
};

const toolGroups = [
  {
    iconPath: 'm352-522 86-87-56-57-44 44-56-56 43-44-45-45-87 87 159 158Zm328 329 87-87-45-45-44 43-56-56 43-44-57-56-86 86 158 159Zm24-567 57 57-57-57ZM290-120H120v-170l175-175L80-680l200-200 216 216 151-152q12-12 27-18t31-6q16 0 31 6t27 18l53 54q12 12 18 27t6 31q0 16-6 30.5T816-647L665-495l215 215L680-80 465-295 290-120Zm-90-80h56l392-391-57-57-391 392v56Zm420-419-29-29 57 57-28-28Z',
    label: 'Design',
    tools: ['Adobe Creative Suite', 'Figma', 'InDesign', 'Miro'],
  },
  {
    iconPath: 'M360-80q-58 0-109-22t-89-60q-38-38-60-89T80-360q0-81 42-148t110-102q20-39 49.5-68.5T350-728q33-68 101-110t149-42q58 0 109 22t89 60q38 38 60 89t22 109q0 85-42 150T728-350q-20 39-49.5 68.5T610-232q-35 68-102 110T360-80Zm0-80q33 0 63.5-10t56.5-30q-58 0-109-22t-89-60q-38-38-60-89t-22-109q-20 26-30 56.5T160-360q0 42 16 78t43 63q27 27 63 43t78 16Zm120-120q33 0 64.5-10t57.5-30q-59 0-110-22.5T403-403q-38-38-60.5-89T320-602q-20 26-30 57.5T280-480q0 42 15.5 78t43.5 63q27 28 63 43.5t78 15.5Zm120-120q18 0 34.5-3t33.5-9q22-60 6.5-115.5T621-621q-38-38-93.5-53.5T412-668q-6 17-9 33.5t-3 34.5q0 42 15.5 78t43.5 63q27 28 63 43.5t78 15.5Zm160-78q20-26 30-57.5t10-64.5q0-42-15.5-78T741-741q-27-28-63-43.5T600-800q-35 0-65.5 10T478-760q59 0 110 22.5t89 60.5q38 38 60.5 89T760-478ZM600-600Z',
    label: 'Motion / Video',
    tools: ['Framer', 'Lottie', 'Premiere Pro', 'After Effects', 'Runway'],
  },
  {
    iconPath: 'M739-83.5q-7-2.5-13-8.5L522-296q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l85-85q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l204 204q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13l-85 85q-6 6-13 8.5T754-81q-8 0-15-2.5Zm15-92.5 29-29-147-147-29 29 147 147ZM189.5-83q-7.5-3-13.5-9l-84-84q-6-6-9-13.5T80-205q0-8 3-15t9-13l212-212h85l34-34-165-165h-57L80-765l113-113 121 121v57l165 165 116-116-43-43 56-56H495l-28-28 142-142 28 28v113l56-56 142 142q17 17 26 38.5t9 45.5q0 24-9 46t-26 39l-85-85-56 56-42-42-207 207v84L233-92q-6 6-13 9t-15 3q-8 0-15.5-3Zm15.5-93 170-170v-29h-29L176-205l29 29Zm0 0-29-29 15 14 14 15Zm549 0 29-29-29 29Z',
    label: 'Build',
    tools: ['Webflow', 'Replit', 'v0', 'GitHub', 'Supabase', 'SQL', 'REST APIs'],
  },
  {
    iconPath: 'M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm242.5-97.5Q420-475 420-500t-17.5-42.5Q385-560 360-560t-42.5 17.5Q300-525 300-500t17.5 42.5Q335-440 360-440t42.5-17.5Zm240 0Q660-475 660-500t-17.5-42.5Q625-560 600-560t-42.5 17.5Q540-525 540-500t17.5 42.5Q575-440 600-440t42.5-17.5ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z',
    label: 'AI',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Lovable', 'Cursor'],
  },
  {
    iconPath: 'm520-120 40-280H319l321-440h40l-40 280h241L560-120h-40ZM120-240v-80h348l-12 80H120ZM80-440v-80h228l-58 80H80Zm80-200v-80h294l-58 80H160Z',
    label: 'Optimization',
    tools: ['Google Analytics 4', 'VWO / Optimizely', 'Website Optimization'],
  },
];

const projects = [
  {
    id: 'master-data-quest',
    num: '01',
    category: 'Booth Game · Gartner Engagement Zone',
    title: 'Master Data Quest',
    desc: 'Owned the creative for this Gartner booth activation: booth design, game design, swag, and all event marketing visuals.',
    tags: ['Endless runner', 'Gartner Engagement Zone', '4 years running'],
    img: projectMasterData,
    video: projectMasterDataVideo,
    url: 'https://www.tamr.com/master-data-quest',
    cta: 'See the game →',
  },
  {
    id: 'world-cup',
    num: '02',
    category: 'Live Event Platform',
    title: 'World Cup Watch Party',
    desc: 'A game-day companion for World Cup watch parties — leaderboard scoring, a live prize spinner, and a dynamic admin console built to run the whole event from a laptop backstage.',
    tags: ['Live leaderboard', 'Real-time', 'Admin controls', 'Prize wheel'],
    img: projectWorldCup,
    video: projectWorldCupVideo,
    url: 'https://tamr.events',
    cta: 'See the platform →',
  },
  {
    id: 'roi-calc',
    num: '03',
    category: 'Interactive Tool',
    title: 'ROI Value Calculator',
    desc: 'Co-created with Tamr’s Director of Product Marketing, this interactive value calculator turns “trust me” into measurable ROI by quantifying the business impact of bad data.',
    tags: ['Multi-variable inputs', 'Personalized $ report'],
    img: projectRoi,
    video: projectRoiVideo,
    url: 'https://tamr.com/value-calculator',
    cta: 'See the calculator →',
  },
  {
    id: 'quiz',
    num: '04',
    category: 'A/B Tested',
    title: 'Interactive Quizzes',
    desc: 'A branching quiz experience that scores visitors on their data maturity and hands back a personalized report — tuned through real A/B testing.',
    tags: ['8-question branch', 'Personalized score', 'A/B tested'],
    img: projectQuiz,
    video: projectQuizVideo,
    url: 'https://www.tamr.com/quiz',
    cta: 'See the quiz →',
  },
  {
    id: 'ship-faster',
    num: '05',
    category: 'Animation System',
    title: 'Ship Faster',
    desc: 'A Lottie-based animation system that let the team deploy HTML5 banner creative fast, without waiting on a full production cycle.',
    tags: ['Lottie / HTML5', 'Days → hours'],
    img: projectShipFaster,
    lottie: true,
    hideCta: true,
  },
];

// ── Card media (Lottie · static image · mp4-on-hover) ────────────────────────
// To add a hover video to any card, add:  video: '/path/to/clip.mp4'
// to the matching entry in the projects array above.
// CardMedia receives hovered from the parent card so the whole card triggers the effect
function CardMedia({
  img, lottie, video, title, hovered,
}: {
  img: string;
  lottie?: boolean;
  video?: string;
  title: string;
  hovered: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play / pause with Promise guard so a buffering video doesn't throw
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [hovered]);

  const lottieRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!lottie || !lottieRef.current) return;
    const el = lottieRef.current;
    let anim: ReturnType<typeof lottieWeb.loadAnimation> | null = null;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      import('@assets/images/projects/robot-lottie.json').then((mod) => {
        if (!el) return;
        anim = lottieWeb.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: mod.default,
        });
      });
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => { obs.disconnect(); anim?.destroy(); };
  }, [lottie]);

  if (lottie) {
    return (
      <div className="h-full w-full bg-ink">
        <div ref={lottieRef} className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Static image — cross-dissolves out when video takes over */}
      <img
        src={img}
        alt={title}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-all duration-500 ease-in-out
          ${video ? (hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100') : 'group-hover:scale-105'}`}
      />
      {/* Video — loaded on first hover, cross-dissolves in */}
      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          loop
          playsInline
          preload="none"
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover
            transition-opacity duration-500 ease-in-out
            ${hovered ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
}

// ProjectCard manages hover at the article level so the whole card triggers media
function ProjectCard({ proj }: { proj: (typeof projects)[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className="group card-hard card-hard-hover relative flex flex-col overflow-hidden rounded-2xl bg-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Index badge */}
      <div className="absolute right-4 top-4 z-10 label-mono rounded-full border border-paper/40 bg-ink px-3 py-1">
        {proj.num}
      </div>

      {/* Media */}
      <div className="relative aspect-[300/250] overflow-hidden border-b border-paper/25">
        <CardMedia
          img={proj.img}
          lottie={(proj as any).lottie}
          video={(proj as any).video}
          title={proj.title}
          hovered={hovered}
        />
      </div>

      {/* Copy */}
      <div className="flex flex-1 flex-col p-6">
        <div className="label-mono text-muted-foreground">{proj.category}</div>
        <h3 className="display-xl mt-2 text-2xl md:text-3xl">{proj.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-sans">{proj.desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {proj.tags.map(tag => (
            <span key={tag} className="label-mono rounded-full border border-border px-3 py-1">{tag}</span>
          ))}
        </div>
        {!proj.hideCta && (
          <div className="mt-auto pt-6 flex justify-center">
            <a
              href={proj.url}
              style={{ lineHeight: 1 }}
              className="display-xl btn-secondary uppercase tracking-wider"
            >
              {proj.cta}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

const resumeItems = [
  {
    org: 'Tamr',
    role: 'Senior Creative Director — Brand, Digital, Product UX & Experiential',
    years: 'May 2020 — Present',
    notes: [
      'Led Tamr\'s brand refresh and ongoing digital evolution.',
      'Drive UX optimization through analytics, research, and A/B testing.',
      'Created interactive quizzes, calculators, infographics, lead-gen tools, and a World Cup prediction game.',
      'Use AI tools to rapidly prototype and build functional digital experiences.',
      'Designed nine Gartner games (2024–2026), a flight simulator, and event experiences.',
      'Built scalable Lottie/HTML5 animation systems for digital campaigns.',
      'Created the DataMasters Summit and podcast brand.',
    ],
  },
  {
    org: 'Localytics',
    role: 'Creative Director — Brand, Digital, Product UX & Demand Generation',
    years: 'Dec 2014 — May 2020',
    notes: [
      'Led award-winning ABM campaigns generating $10M+ pipeline and $2M+ revenue.',
      'Designed and developed the App Grader and Labs In-App Creative Builder.',
      'Drove conversion optimization through A/B testing, UX research, and funnel design.',
      'Built acquisition web experiences across core web, campaign, blog, and documentation properties.',
      'Supported the HubSpot-to-Marketo migration.',
    ],
  },
  {
    org: 'Sittercity',
    role: 'Creative Director — Brand, Marketing & Product',
    years: 'Aug 2012 — Dec 2014',
    notes: [
      'Led a company-wide brand refresh and product redesign.',
      'Improved acquisition and conversion experiences through A/B testing and UX research.',
      'Designed acquisition web properties and membership experiences.',
      'Produced two national broadcast TV campaigns.',
    ],
  },
  {
    org: 'Constant Contact',
    role: 'Creative Director · Dir. of Website Design & UX · Sr. Design & UX Production Manager',
    years: 'Feb 2010 — May 2012',
    notes: [
      'Promoted through three creative and UX leadership roles, ultimately leading a 20-person Creative Services team and 6-person Website Design function.',
      'Increased trials 22% through UX research, eye-tracking, and redesigned product experiences.',
      'Led A/B testing and conversion optimization across signup, product, and acquisition flows.',
      'Directed web, microsite, video, and digital campaign experiences.',
      'Won a MITX Award for the Social Bridges video.',
    ],
  },
  {
    org: 'BobVila.com',
    role: 'Creative Director — Brand, UX, Digital Product & Emerging Technology',
    years: 'Sep 2000 — Feb 2010',
    notes: [
      'Founding creative leader as BobVila.com grew from 93K to 2M+ monthly visitors.',
      'Led brand, UX, UI, information architecture, and digital product design.',
      'Drove UGC strategy that became a major source of site traffic and audience growth.',
      'Led development of a custom CMS supporting articles, video, imagery, showrooms, and commerce content.',
      'Built an internal advertising platform serving 20M+ banner impressions per month.',
      'Led digital programs and brand integration with Sears, Craftsman, Kenmore, and Ty Pennington.',
      'Earned Forbes Best of the Web and Macromedia Site of the Day recognition.',
    ],
  },
  {
    org: 'Viant',
    role: 'Creative Lead / Director',
    years: 'Mar 2000 — Sep 2000',
    notes: [
      'Managed 16 direct reports across Boston and Chicago design teams.',
      'Served as creative and strategic lead for the $14M BobVila.com/Sears launch.',
      'Helped build and staff Viant\'s Chicago creative organization.',
    ],
  },
  {
    org: 'Studio Z',
    role: 'Art Director & Co-Owner',
    years: 'Sep 1992 — Feb 2000',
    notes: [
      'Co-led a multidisciplinary creative studio spanning brand, digital, packaging, advertising, and emerging interactive media.',
      'Served as an Adobe Photoshop consultant and GUI/Web consultant to NASA.',
      'Created brand, digital, packaging, and campaign work for Kodak, Coca-Cola, McDonald\'s, Nintendo, and Duracell.',
      'Led early digital experiences including HSV Citypages, Astrotops e-commerce, and Borderwars (a Fox sports site acquired by Paul Allen).',
      'Developed 3D stereogram artwork and co-authored the European bestseller Magical Illusions.',
    ],
  },
  {
    org: 'E.S. Robbins Corporation',
    role: 'Graphic Lead, R&D — Packaging, Brand & Product Design',
    years: 'Sep 1991 — Sep 1993',
    notes: [
      'Developed brand identity and marketing for Pop-Tite, a collapsible bottle technology later acquired by Dow Chemical\'s Glad division.',
      'Led packaging, POP, and product design informed by national focus-group research.',
      'Served as a Kodak Photo CD beta developer.',
      'Collaborated with international design firms including Group 4 and Fitch Richardson.',
    ],
  },
];

const brandItems = [
  { img: brandTerrain,       title: 'Terrain',           desc: 'Brand identity, marketing site & product UI' },
  { img: brandLocalytics,    title: 'Localytics',        desc: 'Responsive marketing site & product launch' },
  { img: brandTamr,          title: 'Tamr',              desc: 'Full brand system refresh' },
  { img: brandRevenueBase,   title: 'RevenueBase',       desc: 'Identity, logo lockups & color' },
  { img: brandAlex,          title: 'ALEX',              desc: 'Alabama Learning Exchange logo guide' },
  { img: brandPluto,         title: 'Pluto',             desc: 'App identity & marketing site' },
  { img: brandDental,        title: 'Alabaster Dental',  desc: 'Full identity' },
  { img: brandVictorFox,     title: 'Victor Fox',        desc: 'Mark, stationery, packaging' },
  { img: brandBridgeBuilder, title: 'Bridge Builder',    desc: 'Salesforce consulting identity' },
];

// ── Stat counter ─────────────────────────────────────────────────────────────
function useCountUp(end: string, active: boolean, delay: number) {
  const [display, setDisplay] = useState('–');

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      const m = end.match(/([\d.]+)/);
      if (!m) { setDisplay(end); return; }
      const num   = parseFloat(m[1]);
      const before = end.slice(0, m.index);
      const after  = end.slice((m.index ?? 0) + m[1].length);
      let raf: number;
      const t0  = performance.now();
      const dur = 900;
      const tick = (now: number) => {
        const p    = Math.min((now - t0) / dur, 1);
        const ease = 1 - (1 - p) ** 3;
        const cur  = ease * num;
        const fmt  = cur >= 10 ? Math.round(cur) : +(cur.toFixed(1));
        setDisplay(`${before}${fmt}${after}`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, delay);
    return () => clearTimeout(t);
  }, [active, end, delay]);

  return display;
}

function StatCol({ value, label, delay, active }: {
  value: string; label: string; delay: number; active: boolean;
}) {
  const displayed = useCountUp(value, active, delay);
  return (
    <div className="hero-stat" style={{ animation: active ? `count-up 0.6s ${delay}ms cubic-bezier(.2,.8,.2,1) both` : 'none' }}>
      <div className="display-xl text-4xl text-lime md:text-5xl">{active ? displayed : '–'}</div>
      <div className="label-mono mt-2 whitespace-pre-line text-muted-foreground">{label}</div>
    </div>
  );
}

// ── 30-second portrait Easter egg ────────────────────────────────────────────
type GameStage = 'closed' | 'intro' | 'coin-drop' | 'loading' | 'playing' | 'over';

function LifeShips({ lives }: { lives: number }) {
  return (
    <div className="game-life-ships" role="img" aria-label={`${lives} ${lives === 1 ? 'life' : 'lives'} remaining`}>
      {[0, 1, 2].map((ship) => (
        <svg
          key={ship}
          viewBox="0 0 24 28"
          className={`game-life-ship ${ship < lives ? 'is-active' : 'is-spent'}`}
          aria-hidden="true"
        >
          <path d="M12 2 21 23l-9-4-9 4L12 2Z" />
          <path d="M8 21 9 26l3-3 3 3 1-5" />
        </svg>
      ))}
    </div>
  );
}

function AsteroidsGame({
  onExit,
  onGameOver,
}: {
  onExit: () => void;
  onGameOver: (score: number, level: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  type GameControl = 'left' | 'right' | 'thrust' | 'fire';
  const controlsRef = useRef({
    left: false, right: false, thrust: false, fire: false, reverse: false,
    turnPower: 1, thrustPower: 0, reversePower: 0,
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [dualLaserSeconds, setDualLaserSeconds] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [reverseActive, setReverseActive] = useState(false);
  const [activeControls, setActiveControls] = useState<Record<GameControl, boolean>>({
    left: false,
    right: false,
    thrust: false,
    fire: false,
  });
  const dpadRef = useRef<HTMLDivElement>(null);
  const dpadPointerIdRef = useRef<number | null>(null);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const onExitRef = useRef(onExit);
  const onGameOverRef = useRef(onGameOver);

  useEffect(() => { onExitRef.current = onExit; }, [onExit]);
  useEffect(() => { onGameOverRef.current = onGameOver; }, [onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type AsteroidSize = 'large' | 'medium' | 'small';
    type Asteroid = {
      x: number; y: number; vx: number; vy: number; r: number; spin: number; angle: number;
      size: AsteroidSize; hits: number; maxHits: number; points: number[]; hue: number; sprite: number;
      flashUntil: number; blastRadius: number; destroyed: boolean; destroyedAt: number;
    };
    type AlphaMask = { size: number; alpha: Uint8ClampedArray };
    type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
    type EnemyLaser = { x: number; y: number; vx: number; vy: number; life: number };
    type BlastWave = { x: number; y: number; radius: number; life: number };
    type Fragment = { x: number; y: number; vx: number; vy: number; life: number; size: number; angle: number };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let lowPower = Math.min(width, height) < 640;
    const mobileGameScale = 0.5;
    const mobileAsteroidScale = 1.5;
    let contentScale = lowPower ? mobileGameScale : 1;
    let asteroidScale = lowPower ? mobileAsteroidScale : 1;
    let raf = 0;
    let last = performance.now();
    let lastFrameAt = 0;
    let lastFire = 0;
    let lastThrustSound = 0;
    let lastBeatAt = 0;
    let beatIndex = 0;
    let running = true;
    let scoreValue = 0;
    let displayedDualLaserSecond = 0;
    let dualLaserUntil = 0;
    let levelValue = 1;
    let levelTransitionUntil = 0;
    let ufoTimer = 7;
    let ufoSpawned = false;
    let ufo: {
      x: number;
      y: number;
      vx: number;
      phase: number;
      baseY: number;
      amplitude: number;
      frequency: number;
      sizeScale: number;
      shotCooldown: number;
      soundPlayed: boolean;
    } | null = null;
    let livesValue = 3;
    let invulnerableUntil = 0;
    let shipDestroyedUntil = 0;
    let gameOverTimer: number | undefined;
    const desktopAudio = canUseDesktopArcadeAudio();
    let audioContext: AudioContext | null = null;
    let ufoSoundSource: AudioBufferSourceNode | null = null;
    let ufoSoundGain: GainNode | null = null;
    const audioBuffers = new Map<string, AudioBuffer>();
    const startedAt = performance.now();
    const ship = { x: width / 2, y: height / 2, vx: 0, vy: 0, angle: -Math.PI / 2 };
    const bullets: Bullet[] = [];
    const enemyLasers: EnemyLaser[] = [];
    const blastWaves: BlastWave[] = [];
    const fragments: Fragment[] = [];
    const asteroidImageSources: Record<AsteroidSize, string[]> = {
      large: ['asteroid-mix-large.svg', 'asteroid-yellow-large.svg', 'asteroid-blue-large.svg', 'asteroid-red-large.svg'],
      medium: ['asteroid-mix-medium.svg', 'asteroid-yellow-medium.svg', 'asteroid-blue-medium.svg', 'asteroid-red-medium.svg'],
      small: ['asteroid-mix-small.svg', 'asteroid-yellow-small.svg', 'asteroid-blue-small.svg', 'asteroid-red-small.svg'],
    };
    const asteroidMasks: Record<AsteroidSize, Array<AlphaMask | null>> = {
      large: [null, null, null, null],
      medium: [null, null, null, null],
      small: [null, null, null, null],
    };
    const makeAlphaMask = (image: HTMLImageElement): AlphaMask => {
      const maskSize = 96;
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = maskSize;
      maskCanvas.height = maskSize;
      const maskContext = maskCanvas.getContext('2d');
      if (!maskContext) return { size: maskSize, alpha: new Uint8ClampedArray(maskSize * maskSize * 4) };
      maskContext.drawImage(image, 0, 0, maskSize, maskSize);
      return { size: maskSize, alpha: maskContext.getImageData(0, 0, maskSize, maskSize).data };
    };
    const asteroidImages = {} as Record<AsteroidSize, HTMLImageElement[]>;
    (['large', 'medium', 'small'] as AsteroidSize[]).forEach((size) => {
      asteroidImages[size] = asteroidImageSources[size].map((source, color) => {
        const image = new Image();
        image.onload = () => { asteroidMasks[size][color] = makeAlphaMask(image); };
        image.src = `${BASE}${source}`;
        return image;
      });
    });
    const ufoImage = new Image();
    let ufoImageReady = false;
    ufoImage.onload = () => { ufoImageReady = true; };
    ufoImage.src = `${BASE}arcade-ufo-sports.svg`;
    const seeded = (seed: number) => {
      const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    const stars = Array.from({ length: 320 }, (_, i) => {
      const inCloud = i < 220;
      const x = seeded(i + 2);
      const cloudCenter = .72 - x * .32;
      const y = inCloud
        ? (cloudCenter + (seeded(i + 31) - .5) * (.07 + seeded(i + 101) * .22) + 1) % 1
        : seeded(i + 401);
      const depth = .2 + seeded(i + 701) * .8;
      return {
        x,
        y,
        r: .28 + depth * 1.05,
        alpha: .2 + depth * .62,
        twinkle: .45 + seeded(i + 901) * 1.5,
        phase: seeded(i + 1101) * Math.PI * 2,
        drift: .00004 + depth * .00018,
        tone: seeded(i + 1301) > .82 ? 'blue' : seeded(i + 1301) > .68 ? 'warm' : 'white',
      };
    });
    const wakeAudio = () => {
      if (!desktopAudio) return;
      if (!audioContext) {
        try {
          audioContext = new AudioContext();
        } catch {
          return;
        }
      }
      if (audioContext.state === 'suspended') void audioContext.resume().catch(() => {});
    };
    const playClip = (name: string, volume = .28, rate = 1) => {
      if (!desktopAudio) return;
      wakeAudio();
      const buffer = audioBuffers.get(name);
      if (!audioContext || !buffer || audioContext.state !== 'running') return;
      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      source.buffer = buffer;
      source.playbackRate.value = rate;
      gain.gain.value = volume;
      source.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
    };
    const stopUfoSound = (fadeSeconds = .1) => {
      const source = ufoSoundSource;
      const gain = ufoSoundGain;
      ufoSoundSource = null;
      ufoSoundGain = null;
      if (!source) return;
      try {
        if (audioContext && gain) {
          const stopAt = audioContext.currentTime + fadeSeconds;
          gain.gain.cancelScheduledValues(audioContext.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(0, stopAt);
          source.stop(stopAt);
        } else {
          source.stop();
        }
      } catch {
        // The source may already have ended during game cleanup.
      }
    };
    const loadDesktopAudio = async () => {
      if (!desktopAudio) return;
      wakeAudio();
      if (!audioContext) return;
      const clips = {
        fire: 'arcade-fire.wav',
        thrust: 'arcade-thrust.wav',
        bangSmall: 'arcade-bang-small.wav',
        bangMedium: 'arcade-bang-medium.wav',
        bangLarge: 'arcade-bang-large.wav',
        saucerBig: 'arcade-saucer-big.wav',
        saucerSmall: 'arcade-saucer-small.wav',
        beat1: 'arcade-beat-1.wav',
        beat2: 'arcade-beat-2.wav',
      };
      await Promise.all(Object.entries(clips).map(async ([name, file]) => {
        try {
          const response = await fetch(`${BASE}${file}`);
          const data = await response.arrayBuffer();
          const buffer = await audioContext!.decodeAudioData(data);
          audioBuffers.set(name, buffer);
        } catch {
          // Individual clips are optional; gameplay stays functional without them.
        }
      }));
    };
    void loadDesktopAudio();
    const playFireSound = () => playClip('fire', .23);
    const playThrustSound = () => playClip('thrust', .15);
    const playAsteroidHitSound = (size: AsteroidSize, destroyed: boolean) => {
      const clip = size === 'large' ? 'bangLarge' : size === 'medium' ? 'bangMedium' : 'bangSmall';
      playClip(clip, destroyed ? .32 : .15, destroyed ? 1 : 1.15);
    };
    const playUfoHitSound = () => playClip('saucerSmall', .32, 1.08);
    const playShipDeathSound = () => playClip('bangLarge', .38, .78);
    const startUfoSound = (small: boolean) => {
      if (!desktopAudio) return false;
      wakeAudio();
      const buffer = audioBuffers.get(small ? 'saucerSmall' : 'saucerBig');
      if (!audioContext || !buffer || audioContext.state !== 'running') return false;
      stopUfoSound(.02);
      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = buffer.duration;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(.2, now + .08);
      source.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
      ufoSoundSource = source;
      ufoSoundGain = gain;
      return true;
    };
    const playBeat = () => {
      playClip(beatIndex % 2 === 0 ? 'beat1' : 'beat2', .25);
      beatIndex += 1;
    };
    const asteroid = (size: AsteroidSize = 'large', origin?: { x: number; y: number }, velocity?: { x: number; y: number }): Asteroid => {
      const specs = {
        large: { r: 62 * contentScale * asteroidScale, hits: 3, speed: 28, points: 100 },
        medium: { r: 38 * contentScale * asteroidScale, hits: 2, speed: 48, points: 200 },
        small: { r: 17 * contentScale * asteroidScale, hits: 1, speed: 74, points: 300 },
      }[size];
      const edge = Math.floor(Math.random() * 4);
      const r = specs.r * (.88 + Math.random() * .2);
      const speed = specs.speed * (1 + (levelValue - 1) * .13) * (.8 + Math.random() * .4);
      const x = origin?.x ?? (edge === 0 ? -r : edge === 1 ? width + r : Math.random() * width);
      const y = origin?.y ?? (edge === 2 ? -r : edge === 3 ? height + r : Math.random() * height);
      const angle = Math.atan2(height / 2 - y, width / 2 - x) + (Math.random() - .5) * 1.1;
      const direction = velocity ?? { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
      const points = Array.from({ length: 8 + Math.floor(Math.random() * 3) }, (_, i) =>
        r * (.74 + ((i * 31 + Math.floor(r)) % 23) / 65)
      );
      return {
        x, y, vx: direction.x, vy: direction.y, r, spin: (Math.random() - .5) * 1.2,
        angle: Math.random() * Math.PI * 2, size, hits: specs.hits, maxHits: specs.hits,
        points, hue: Math.floor(Math.random() * 4), sprite: Math.floor(Math.random() * 4), flashUntil: 0,
        blastRadius: levelValue >= 3 && size === 'small' ? 74 + levelValue * 4 : 0,
        destroyed: false, destroyedAt: 0,
      };
    };
    const spawnLevelWave = (currentLevel: number) => {
      const wave: Asteroid[] = [];
      const largeCount = Math.max(1, 3 - Math.floor((currentLevel - 1) / 2));
      const mediumCount = 1 + Math.floor(currentLevel / 2);
      const smallCount = 1 + Math.floor(currentLevel / 2);
      for (let count = 0; count < largeCount; count += 1) wave.push(asteroid('large'));
      for (let count = 0; count < mediumCount; count += 1) wave.push(asteroid('medium'));
      for (let count = 0; count < smallCount; count += 1) wave.push(asteroid('small'));
      return wave;
    };
    const asteroids = spawnLevelWave(levelValue);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      lowPower = Math.min(width, height) < 640;
      contentScale = lowPower ? mobileGameScale : 1;
      asteroidScale = lowPower ? mobileAsteroidScale : 1;
      const ratio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ship.x = Math.min(ship.x, width - 24);
      ship.y = Math.min(ship.y, height - 24);
    };

    const setControl = (key: string, value: boolean) => {
      if (key === 'ArrowLeft' || key.toLowerCase() === 'a') {
        controlsRef.current.left = value;
        controlsRef.current.turnPower = value ? 1 : 0;
      }
      if (key === 'ArrowRight' || key.toLowerCase() === 'd') {
        controlsRef.current.right = value;
        controlsRef.current.turnPower = value ? 1 : 0;
      }
      if (key === 'ArrowUp' || key.toLowerCase() === 'w') {
        controlsRef.current.thrust = value;
        controlsRef.current.thrustPower = value ? 1 : 0;
        if (value) {
          controlsRef.current.reverse = false;
          controlsRef.current.reversePower = 0;
        }
      }
      if (key === 'ArrowDown' || key.toLowerCase() === 's') {
        controlsRef.current.reverse = value;
        controlsRef.current.reversePower = value ? 1 : 0;
        if (value) {
          controlsRef.current.thrust = false;
          controlsRef.current.thrustPower = 0;
        }
      }
      if (key === ' ' || key === 'Enter') controlsRef.current.fire = value;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onExitRef.current(); return; }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S'].includes(event.key)) {
        event.preventDefault();
        setControl(event.key, true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => setControl(event.key, false);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const wrap = (value: number, max: number) => (value + max) % max;
    const drawAsteroid = (item: Asteroid) => {
      const now = performance.now();
      const dissolveProgress = item.destroyed ? Math.min(1, (now - item.destroyedAt) / 380) : 0;
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      if (item.flashUntil > now) {
        ctx.shadowColor = '#f6f5eb';
        ctx.shadowBlur = lowPower ? 0 : 18;
        ctx.globalAlpha = Math.min(1, .55 + (item.flashUntil - now) / 220);
      }
      if (dissolveProgress > 0) {
        ctx.scale(1 + dissolveProgress * .28, 1 + dissolveProgress * .28);
        ctx.globalAlpha = 1 - dissolveProgress;
        if (!lowPower) ctx.filter = `blur(${dissolveProgress * 4}px)`;
      }
      const sides = item.points.length;
      const image = asteroidImages[item.size][item.hue];
      const useSvg = image.complete && image.naturalWidth > 0;
      const path = () => {
        ctx.beginPath();
        item.points.forEach((radius, point) => {
          const a = (point / sides) * Math.PI * 2;
          const px = Math.cos(a) * radius;
          const py = Math.sin(a) * radius;
          if (point === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
      };
      if (useSvg) {
        ctx.globalAlpha *= .94;
        ctx.drawImage(image, -item.r, -item.r, item.r * 2, item.r * 2);
      } else {
        const colors = ['#4c531c', '#4a2025', '#111b45', '#252b2d'];
        path();
        ctx.fillStyle = colors[item.hue];
        ctx.fill();
        ctx.fillStyle = item.hue % 2 ? 'rgba(220,242,74,.3)' : 'rgba(246,245,235,.18)';
        const dotGap = item.size === 'large' ? 8 : item.size === 'medium' ? 6 : 4;
        for (let x = -item.r; x < item.r; x += dotGap) {
          for (let y = -item.r; y < item.r; y += dotGap) {
            ctx.beginPath();
            ctx.arc(x + (y / dotGap % 2) * 2, y, item.size === 'small' ? 1 : 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      if (item.hits < item.maxHits) {
        ctx.strokeStyle = 'rgba(246,245,235,.72)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-item.r * .35, -item.r * .6);
        ctx.lineTo(item.r * .05, 0);
        ctx.lineTo(-item.r * .1, item.r * .5);
        ctx.moveTo(item.r * .05, 0);
        ctx.lineTo(item.r * .55, item.r * .3);
        ctx.stroke();
      }
      if (item.blastRadius > 0 && !item.destroyed) {
        ctx.strokeStyle = 'rgba(255,92,103,.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, item.r + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    };
    const pointHitsAsteroid = (item: Asteroid, x: number, y: number) => {
      const dx = x - item.x;
      const dy = y - item.y;
      const cos = Math.cos(item.angle);
      const sin = Math.sin(item.angle);
      const localX = dx * cos + dy * sin;
      const localY = -dx * sin + dy * cos;
      if (Math.abs(localX) > item.r || Math.abs(localY) > item.r) return false;
      const mask = asteroidMasks[item.size][item.hue];
      if (!mask) return Math.hypot(dx, dy) < item.r + 5;
      const maskX = Math.max(0, Math.min(mask.size - 1, Math.floor((localX / (item.r * 2) + .5) * mask.size)));
      const maskY = Math.max(0, Math.min(mask.size - 1, Math.floor((localY / (item.r * 2) + .5) * mask.size)));
      return mask.alpha[(maskY * mask.size + maskX) * 4 + 3] > 32;
    };
    const burst = (item: Asteroid) => {
      const fragmentCount = lowPower
        ? (item.size === 'large' ? 6 : 4)
        : (item.size === 'large' ? 12 : 7);
      for (let i = 0; i < fragmentCount; i += 1) {
        const angle = (i / 7) * Math.PI * 2 + Math.random() * .4;
        fragments.push({
          x: item.x, y: item.y, vx: Math.cos(angle) * (35 + Math.random() * 65),
          vy: Math.sin(angle) * (35 + Math.random() * 65), life: .45 + Math.random() * .35,
          size: 2 + Math.random() * 4, angle,
        });
      }
    };
    const drawUfo = (item: { x: number; y: number; phase: number; sizeScale: number }) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.scale(contentScale * item.sizeScale, contentScale * item.sizeScale);
      ctx.shadowColor = '#dcf24a';
      ctx.shadowBlur = lowPower ? 0 : 20;
      if (ufoImageReady) {
        ctx.drawImage(ufoImage, -60, -24, 120, 48);
        ctx.restore();
        return;
      }
      ctx.strokeStyle = '#dcf24a';
      ctx.fillStyle = '#111b45';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-24, 2);
      ctx.quadraticCurveTo(-13, -12, 0, -12);
      ctx.quadraticCurveTo(13, -12, 24, 2);
      ctx.lineTo(15, 10);
      ctx.lineTo(-15, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f6f5eb';
      ctx.beginPath();
      ctx.ellipse(0, -12, 8, 5, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = item.phase % 2 ? '#dcf24a' : '#f6f5eb';
      [-12, 0, 12].forEach((x) => {
        ctx.beginPath();
        ctx.arc(x, 5, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };
    const render = (now: number) => {
      ctx.fillStyle = '#03050c';
      ctx.fillRect(0, 0, width, height);

      const isMobile = width < height;
      const backgroundWidth = isMobile ? height : width;
      const backgroundHeight = isMobile ? width : height;
      ctx.save();
      if (isMobile) {
        ctx.translate(width, 0);
        ctx.rotate(Math.PI / 2);
      }
      const elapsed = (now - startedAt) / 1000;
      const starCount = lowPower ? 96 : stars.length;
      for (let starIndex = 0; starIndex < starCount; starIndex += 1) {
        const star = stars[starIndex];
        const x = lowPower ? star.x : ((star.x + elapsed * star.drift) % 1 + 1) % 1;
        const y = lowPower ? star.y : ((star.y + Math.sin(elapsed * .12 + star.phase) * .0007) % 1 + 1) % 1;
        const shimmer = lowPower ? .9 : .78 + Math.sin(elapsed * star.twinkle + star.phase) * .22;
        ctx.globalAlpha = star.alpha * shimmer;
        ctx.fillStyle = star.tone === 'blue' ? '#a8c5ff' : star.tone === 'warm' ? '#ffe4b8' : '#f6f5eb';
        ctx.beginPath();
        ctx.arc(x * backgroundWidth, y * backgroundHeight, star.r * (1 + shimmer * .12), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      if (now < levelTransitionUntil) {
        const progress = (levelTransitionUntil - now) / 750;
        const warpProgress = 1 - progress;
        ctx.save();
        ctx.globalAlpha = Math.min(1, progress * 1.5);
        ctx.fillStyle = '#dcf24a';
        ctx.shadowColor = '#dcf24a';
        ctx.shadowBlur = lowPower ? 0 : 18;
        ctx.textAlign = 'center';
        ctx.font = '800 28px "Bricolage Grotesque", sans-serif';
        ctx.fillText(`LEVEL ${String(levelValue).padStart(2, '0')}`, width / 2, height * .44);
        ctx.font = '500 10px "DM Mono", monospace';
        ctx.fillText('WAVE CLEARED · INCOMING', width / 2, height * .44 + 24);
        ctx.restore();
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.globalAlpha = Math.min(.72, (1 - Math.abs(warpProgress - .5) * 2) * .72);
        ctx.strokeStyle = '#dcf24a';
        ctx.shadowColor = '#dcf24a';
        ctx.shadowBlur = lowPower ? 0 : 12;
        ctx.lineWidth = lowPower ? 1 : 2;
        const rayCount = lowPower ? 18 : 42;
        for (let ray = 0; ray < rayCount; ray += 1) {
          const angle = (ray / rayCount) * Math.PI * 2;
          const inner = Math.max(6, warpProgress * Math.min(width, height) * .06);
          const outer = inner + warpProgress * Math.max(width, height) * .52;
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
          ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
          ctx.stroke();
        }
        ctx.restore();
      }
      asteroids.forEach(drawAsteroid);
      if (ufo) drawUfo(ufo);
      blastWaves.forEach((wave) => {
        const progress = 1 - wave.life / .42;
        ctx.save();
        ctx.globalAlpha = Math.max(0, wave.life / .42);
        ctx.strokeStyle = '#ff5c67';
        ctx.shadowColor = '#ff5c67';
        ctx.shadowBlur = lowPower ? 0 : 12;
        ctx.lineWidth = 2 * contentScale;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, Math.max(2, wave.radius * progress), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
      fragments.forEach((fragment) => {
        ctx.save();
        ctx.translate(fragment.x, fragment.y);
        ctx.rotate(fragment.angle);
        ctx.scale(contentScale, contentScale);
        ctx.globalAlpha = Math.max(0, fragment.life * 1.5);
        ctx.fillStyle = fragment.life > .4 ? '#dcf24a' : '#f6f5eb';
        ctx.fillRect(-fragment.size, -fragment.size, fragment.size * 2, fragment.size * 2);
        ctx.restore();
      });
      enemyLasers.forEach((laser) => {
        ctx.save();
        ctx.globalAlpha = Math.min(1, laser.life * 2);
        ctx.strokeStyle = '#ff5c67';
        ctx.shadowColor = '#ff5c67';
        ctx.shadowBlur = lowPower ? 0 : 10;
        ctx.lineWidth = 2.5 * contentScale;
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x - laser.vx * .035, laser.y - laser.vy * .035);
        ctx.stroke();
        ctx.restore();
      });
      bullets.forEach((bullet) => {
        ctx.fillStyle = '#dcf24a';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3 * contentScale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle + Math.PI / 2);
      ctx.scale(contentScale, contentScale);
      if (now < shipDestroyedUntil && Math.floor(now / 90) % 2 === 0) {
        ctx.restore();
        return;
      }
      if (controlsRef.current.thrust) {
        ctx.fillStyle = '#dcf24a';
        ctx.beginPath();
        ctx.moveTo(-6, 13); ctx.lineTo(0, 25 + Math.random() * 8); ctx.lineTo(6, 13);
        ctx.fill();
      }
      if (controlsRef.current.reverse) {
        const fieldStrength = controlsRef.current.reversePower;
        ctx.strokeStyle = `rgba(220,242,74,${.42 + fieldStrength * .42})`;
        ctx.lineWidth = 2 + fieldStrength * 2;
        ctx.shadowColor = '#dcf24a';
        ctx.shadowBlur = lowPower ? 0 : 14;
        ctx.beginPath();
        ctx.arc(0, 19, 13 + fieldStrength * 7, Math.PI * .18, Math.PI * .82);
        ctx.stroke();
      }
      ctx.strokeStyle = '#dcf24a';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#dcf24a';
      ctx.shadowBlur = lowPower ? 0 : 8;
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(12, 14); ctx.lineTo(0, 8); ctx.lineTo(-12, 14); ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const awardScore = (points: number) => {
      scoreValue += points;
      setScore(scoreValue);
    };

    const beginNextLevel = (now: number) => {
      levelValue += 1;
      setLevel(levelValue);
      levelTransitionUntil = now + 750;
      ufoTimer = Math.max(3.5, 7 - levelValue * .55);
      ufoSpawned = false;
      asteroids.push(...spawnLevelWave(levelValue));
    };

    const tick = (now: number) => {
      if (!running) return;
      if (lowPower && now - lastFrameAt < 1000 / 30) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastFrameAt = now;
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      const dualLaserRounded = Math.ceil(Math.max(0, dualLaserUntil - now) / 1000);
      if (dualLaserRounded !== displayedDualLaserSecond) {
        displayedDualLaserSecond = dualLaserRounded;
        setDualLaserSeconds(dualLaserRounded);
      }
      const beatInterval = now < dualLaserUntil
        ? 320
        : Math.max(480, 760 - (levelValue - 1) * 42);
      if (now - lastBeatAt >= beatInterval) {
        lastBeatAt = now;
        playBeat();
      }
      ufoTimer -= dt;
      if (!ufo && !ufoSpawned && asteroids.length > 0 && ufoTimer <= 0 && asteroids.length <= Math.max(2, levelValue + 1)) {
        const baseY = height * (.2 + Math.random() * .6);
        const sizeScale = Math.max(.56, 1 - (levelValue - 1) * .1);
        ufo = {
          x: -64 * sizeScale,
          y: baseY,
          vx: 145 + Math.random() * 45 + (levelValue - 1) * 26,
          phase: Math.random() * Math.PI * 2,
          baseY,
          amplitude: Math.min(82, Math.max(34, height * .16)),
          frequency: 1.8 + Math.random() * 1.1 + (levelValue - 1) * .12,
          sizeScale,
          shotCooldown: 1.2 + Math.random() * .9,
          soundPlayed: false,
        };
      }
      if (ufo) {
        ufo.x += (ufo.vx + Math.sin(ufo.phase * .7) * 28) * dt;
        ufo.phase += dt * ufo.frequency;
        ufo.shotCooldown -= dt;
        ufo.y = ufo.baseY
          + Math.sin(ufo.phase) * ufo.amplitude
          + Math.sin(ufo.phase * .45 + 1.2) * 12;
        if (!ufo.soundPlayed && ufo.x > 0) {
          ufo.soundPlayed = startUfoSound(ufo.sizeScale < .82) || !desktopAudio;
        }
        if (levelValue > 1 && ufo.shotCooldown <= 0) {
          const shotAngle = Math.atan2(ship.y - ufo.y, ship.x - ufo.x);
          enemyLasers.push({
            x: ufo.x,
            y: ufo.y,
            vx: Math.cos(shotAngle) * (245 + levelValue * 12),
            vy: Math.sin(shotAngle) * (245 + levelValue * 12),
            life: 2.6,
          });
          ufo.shotCooldown = Math.max(.8, 2.2 - levelValue * .12) + Math.random() * .7;
          playClip('fire', .16, .72);
        }
        if (ufo.x > width + 64 * ufo.sizeScale) {
          stopUfoSound();
          ufo = null;
          ufoSpawned = true;
        }
      }
      enemyLasers.forEach((laser) => {
        laser.x = wrap(laser.x + laser.vx * dt, width);
        laser.y = wrap(laser.y + laser.vy * dt, height);
        laser.life -= dt;
      });
      for (let laserIndex = enemyLasers.length - 1; laserIndex >= 0; laserIndex -= 1) {
        if (enemyLasers[laserIndex].life <= 0) enemyLasers.splice(laserIndex, 1);
      }
      blastWaves.forEach((wave) => { wave.life -= dt; });
      for (let waveIndex = blastWaves.length - 1; waveIndex >= 0; waveIndex -= 1) {
        if (blastWaves[waveIndex].life <= 0) blastWaves.splice(waveIndex, 1);
      }

      if (controlsRef.current.left) ship.angle -= 3.8 * controlsRef.current.turnPower * dt;
      if (controlsRef.current.right) ship.angle += 3.8 * controlsRef.current.turnPower * dt;
      if (controlsRef.current.thrust) {
        ship.vx += Math.cos(ship.angle) * 210 * controlsRef.current.thrustPower * dt;
        ship.vy += Math.sin(ship.angle) * 210 * controlsRef.current.thrustPower * dt;
        if (now - lastThrustSound > 115) {
          lastThrustSound = now;
          playThrustSound();
        }
      }
      if (controlsRef.current.reverse) {
        ship.vx -= Math.cos(ship.angle) * 150 * controlsRef.current.reversePower * dt;
        ship.vy -= Math.sin(ship.angle) * 150 * controlsRef.current.reversePower * dt;
      }
      ship.vx *= .992;
      ship.vy *= .992;
      ship.x = wrap(ship.x + ship.vx * dt, width);
      ship.y = wrap(ship.y + ship.vy * dt, height);
      if (controlsRef.current.fire && now - lastFire > 210) {
        lastFire = now;
        const firingAngles = now < dualLaserUntil
          ? [ship.angle - .12, ship.angle, ship.angle + .12]
          : [ship.angle];
        firingAngles.forEach((angle) => {
          bullets.push({
            x: ship.x,
            y: ship.y,
            vx: Math.cos(angle) * 460,
            vy: Math.sin(angle) * 460,
            life: 1.05,
          });
        });
        playFireSound();
      }

      bullets.forEach((bullet) => {
        bullet.x = wrap(bullet.x + bullet.vx * dt, width);
        bullet.y = wrap(bullet.y + bullet.vy * dt, height);
        bullet.life -= dt;
      });
      fragments.forEach((fragment) => {
        fragment.x = wrap(fragment.x + fragment.vx * dt, width);
        fragment.y = wrap(fragment.y + fragment.vy * dt, height);
        fragment.vx *= .96;
        fragment.vy *= .96;
        fragment.life -= dt;
      });
      for (let i = fragments.length - 1; i >= 0; i -= 1) {
        if (fragments[i].life <= 0) fragments.splice(i, 1);
      }
      for (let i = bullets.length - 1; i >= 0; i -= 1) {
        if (bullets[i].life <= 0) bullets.splice(i, 1);
      }
      if (ufo) {
        for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
          const bullet = bullets[bulletIndex];
          if (Math.hypot(ufo.x - bullet.x, ufo.y - bullet.y) < 46 * contentScale * ufo.sizeScale) {
            const ufoFragments = lowPower ? 8 : 14;
            for (let fragment = 0; fragment < ufoFragments; fragment += 1) {
              const angle = (fragment / ufoFragments) * Math.PI * 2;
              fragments.push({
                x: ufo.x, y: ufo.y, vx: Math.cos(angle) * 90, vy: Math.sin(angle) * 90,
                life: .7, size: 3, angle,
              });
            }
            bullets.splice(bulletIndex, 1);
            playUfoHitSound();
            stopUfoSound(.04);
            ufo = null;
            ufoSpawned = true;
            dualLaserUntil = now + 10000;
            displayedDualLaserSecond = 10;
            setDualLaserSeconds(10);
            awardScore(750);
            break;
          }
        }
      }
      let enemyLaserHit = false;
      for (let laserIndex = enemyLasers.length - 1; laserIndex >= 0; laserIndex -= 1) {
        const laser = enemyLasers[laserIndex];
        if (Math.hypot(laser.x - ship.x, laser.y - ship.y) < 17 * Math.max(contentScale, .5)) {
          enemyLasers.splice(laserIndex, 1);
          enemyLaserHit = true;
          break;
        }
      }
      asteroids.forEach((item) => {
        if (!item.destroyed) {
          item.x = wrap(item.x + item.vx * dt, width);
          item.y = wrap(item.y + item.vy * dt, height);
        }
        item.angle += item.spin * dt;
      });
      for (let asteroidIndex = asteroids.length - 1; asteroidIndex >= 0; asteroidIndex -= 1) {
        if (asteroids[asteroidIndex].destroyed && now - asteroids[asteroidIndex].destroyedAt >= 380) {
          asteroids.splice(asteroidIndex, 1);
        }
      }
      const blastHitShip = blastWaves.some((wave) => {
        const progress = 1 - wave.life / .42;
        return Math.hypot(wave.x - ship.x, wave.y - ship.y) < wave.radius * progress;
      });
      if (now > invulnerableUntil) {
        const shipPoints = [
          [ship.x, ship.y],
          [ship.x + Math.cos(ship.angle) * 16 * contentScale, ship.y + Math.sin(ship.angle) * 16 * contentScale],
          [ship.x + Math.cos(ship.angle + 2.35) * 12 * contentScale, ship.y + Math.sin(ship.angle + 2.35) * 12 * contentScale],
          [ship.x + Math.cos(ship.angle - 2.35) * 12 * contentScale, ship.y + Math.sin(ship.angle - 2.35) * 12 * contentScale],
        ];
        const hitAsteroid = asteroids.some((item) => !item.destroyed && shipPoints.some(([x, y]) => pointHitsAsteroid(item, x, y)));
        const hitUfo = ufo !== null && Math.hypot(ufo.x - ship.x, ufo.y - ship.y) < 46 * contentScale * ufo.sizeScale;
        if (hitAsteroid || hitUfo || enemyLaserHit || blastHitShip) {
          const impactX = ship.x;
          const impactY = ship.y;
          const shipFragments = lowPower ? 10 : 18;
          for (let fragment = 0; fragment < shipFragments; fragment += 1) {
            const angle = (fragment / shipFragments) * Math.PI * 2;
            fragments.push({
              x: impactX, y: impactY, vx: Math.cos(angle) * (55 + Math.random() * 80),
              vy: Math.sin(angle) * (55 + Math.random() * 80), life: .5 + Math.random() * .35,
              size: 2 + Math.random() * 4, angle,
            });
          }
          livesValue -= 1;
          setLives(livesValue);
          playShipDeathSound();
          invulnerableUntil = now + 2200;
          shipDestroyedUntil = now + 480;
          ship.x = width / 2;
          ship.y = height / 2;
          ship.vx = 0;
          ship.vy = 0;
          if (livesValue <= 0) {
            running = false;
            gameOverTimer = window.setTimeout(() => onGameOverRef.current(scoreValue, levelValue), 500);
          }
        }
      }
      for (let asteroidIndex = asteroids.length - 1; asteroidIndex >= 0; asteroidIndex -= 1) {
        for (let bulletIndex = bullets.length - 1; bulletIndex >= 0; bulletIndex -= 1) {
          const item = asteroids[asteroidIndex];
          const bullet = bullets[bulletIndex];
          if (!item.destroyed && pointHitsAsteroid(item, bullet.x, bullet.y)) {
            item.hits -= 1;
            item.flashUntil = now + 120;
            item.vx *= .9;
            item.vy *= .9;
            burst(item);
            bullets.splice(bulletIndex, 1);
            playAsteroidHitSound(item.size, item.hits <= 0);
            if (item.hits <= 0) {
              item.destroyed = true;
              item.destroyedAt = now;
              awardScore(item.size === 'large' ? 100 : item.size === 'medium' ? 200 : 300);
              if (item.blastRadius > 0) {
                blastWaves.push({ x: item.x, y: item.y, radius: item.blastRadius, life: .42 });
                asteroids.forEach((nearby) => {
                  if (
                    nearby !== item
                    && !nearby.destroyed
                    && Math.hypot(nearby.x - item.x, nearby.y - item.y) < item.blastRadius
                  ) {
                    nearby.hits = Math.max(0, nearby.hits - 1);
                    nearby.flashUntil = now + 180;
                  }
                });
              }
              if (item.size !== 'small') {
                const childSize: AsteroidSize = item.size === 'large' ? 'medium' : 'small';
                const parentSpeed = Math.hypot(item.vx, item.vy);
                const childBaseSpeed = childSize === 'medium' ? 58 : 88;
                const childSpeed = Math.max(childBaseSpeed, parentSpeed * (childSize === 'medium' ? 1.12 : 1.16));
                for (let child = 0; child < 2; child += 1) {
                  const childAngle = Math.atan2(item.vy, item.vx) + (child ? .8 : -.8);
                  asteroids.push(asteroid(childSize, { x: item.x, y: item.y }, {
                    x: Math.cos(childAngle) * childSpeed,
                    y: Math.sin(childAngle) * childSpeed,
                  }));
                }
              }
            }
            break;
          }
        }
      }
      if (asteroids.length === 0 && !ufo && now >= levelTransitionUntil) {
        beginNextLevel(now);
      }
      render(now);
      if (running) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const hintTimer = window.setTimeout(() => setShowHint(false), 5200);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(gameOverTimer);
      window.clearTimeout(hintTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      stopUfoSound(.04);
      if (audioContext) void audioContext.close().catch(() => {});
    };
  }, []);

  const press = (control: GameControl, active: boolean) => {
    controlsRef.current[control] = active;
    setActiveControls((current) => current[control] === active ? current : { ...current, [control]: active });
  };
  const clearJoystick = () => {
    press('left', false);
    press('right', false);
    press('thrust', false);
    controlsRef.current.reverse = false;
    controlsRef.current.turnPower = 0;
    controlsRef.current.thrustPower = 0;
    controlsRef.current.reversePower = 0;
    setJoystickPosition({ x: 0, y: 0 });
  };
  const pressReverse = (active: boolean) => {
    controlsRef.current.reverse = active;
    controlsRef.current.reversePower = active ? 1 : 0;
    setReverseActive(active);
  };
  const updateJoystickFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const dpad = dpadRef.current;
    if (!dpad) return;
    const bounds = dpad.getBoundingClientRect();
    const radius = Math.min(bounds.width, bounds.height) * .5 - 18;
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    const distance = Math.hypot(dx, dy);
    const scale = distance > radius ? radius / distance : 1;
    const x = (dx * scale) / radius;
    const y = (dy * scale) / radius;
    const deadZone = .14;
    const horizontal = Math.abs(x) < deadZone ? 0 : x;
    const vertical = Math.abs(y) < deadZone ? 0 : y;
    const magnitude = Math.min(1, Math.hypot(horizontal, vertical));
    setJoystickPosition({ x, y });
    press('left', horizontal < -deadZone);
    press('right', horizontal > deadZone);
    press('thrust', vertical < -deadZone);
    controlsRef.current.reverse = vertical > deadZone;
    controlsRef.current.turnPower = Math.min(1, Math.abs(horizontal) * 1.25);
    controlsRef.current.thrustPower = vertical < -deadZone ? magnitude : 0;
    controlsRef.current.reversePower = vertical > deadZone ? magnitude : 0;
  };
  const controlButton = (
    label: string,
    control: GameControl,
    symbol: React.ReactNode,
    className = '',
  ) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={activeControls[control]}
      className={`game-control ${activeControls[control] ? 'is-active' : ''} ${className}`.trim()}
      draggable={false}
      onPointerDown={(event) => {
        event.preventDefault();
        press(control, true);
      }}
      onPointerUp={(event) => {
        event.preventDefault();
        press(control, false);
      }}
      onPointerLeave={() => {
        press(control, false);
      }}
      onClick={() => {
        if (control === 'left' || control === 'right') {
          press(control, true);
          window.setTimeout(() => press(control, false), 140);
        }
      }}
      onPointerCancel={() => {
        press(control, false);
      }}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onSelect={(event) => {
        event.preventDefault();
        window.getSelection()?.removeAllRanges();
      }}
    >
      {symbol}
    </button>
  );

  return (
    <div className="game-stage" role="dialog" aria-modal="true" aria-label="Asteroid game">
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="game-hud">
        <div className="game-score"><span>Score</span><strong>{score.toString().padStart(4, '0')}</strong></div>
        <div className="game-level"><span>Level</span><strong>{level.toString().padStart(2, '0')}</strong></div>
        <div className="game-lives"><span>Lives</span><LifeShips lives={lives} /></div>
        {dualLaserSeconds > 0 && (
          <div className="game-powerup" aria-label={`Triple laser active for ${dualLaserSeconds} seconds`}>
            <span>Power-up</span><strong>TRIPLE ×3</strong><small>{dualLaserSeconds}s</small>
          </div>
        )}
        <button type="button" className="game-close" onClick={onExit} aria-label="Close game">×<span>Exit</span></button>
      </div>
      {showHint && <div className="game-instructions label-mono">← / → rotate · ↑ / ↓ thrust · space fire</div>}
      <div className="game-controls" aria-label="Touch controls">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`game-desktop-back ${reverseActive ? 'is-active' : ''}`}
            aria-label="Reverse thrust"
            aria-pressed={reverseActive}
            onPointerDown={(event) => {
              event.preventDefault();
              if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.setPointerCapture(event.pointerId);
              }
              pressReverse(true);
            }}
            onPointerUp={(event) => {
              event.preventDefault();
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              pressReverse(false);
            }}
            onPointerCancel={() => pressReverse(false)}
            onLostPointerCapture={() => pressReverse(false)}
            onContextMenu={(event) => event.preventDefault()}
          >
            ↓ <span>Reverse</span>
          </button>
          {controlButton('Rotate left', 'left', <svg className="game-turn-symbol" viewBox="0 0 32 44" aria-hidden="true"><path d="M22 40V13c0-5-3-8-8-8S6 8 6 13v7m0 0-5-5m5 5 5-5" /></svg>)}
          {controlButton('Rotate right', 'right', <svg className="game-turn-symbol" viewBox="0 0 32 44" aria-hidden="true"><path d="M10 40V13c0-5 3-8 8-8s8 3 8 8v7m0 0 5-5m-5 5-5-5" /></svg>)}
        </div>
        <div className="flex gap-3">
          {controlButton('Thrust', 'thrust', '↑')}
          {controlButton('Fire', 'fire', '●')}
        </div>
      </div>
      <div className="game-controls-mobile" aria-label="Touch controls">
        <div
          ref={dpadRef}
          className={`game-dpad ${controlsRef.current.reverse ? 'is-reversing' : ''}`}
            role="slider"
            aria-label="Virtual joystick: move thumb to rotate and thrust"
            aria-roledescription="virtual joystick"
            aria-valuemin={-100}
            aria-valuemax={100}
            aria-valuenow={Math.round(-joystickPosition.y * 100)}
            onPointerDown={(event) => {
              event.preventDefault();
              dpadPointerIdRef.current = event.pointerId;
              event.currentTarget.setPointerCapture(event.pointerId);
              updateJoystickFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (dpadPointerIdRef.current === event.pointerId) {
                event.preventDefault();
                updateJoystickFromPointer(event);
              }
            }}
            onPointerUp={(event) => {
              event.preventDefault();
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              dpadPointerIdRef.current = null;
              clearJoystick();
            }}
            onPointerCancel={() => {
              dpadPointerIdRef.current = null;
              clearJoystick();
            }}
            onLostPointerCapture={() => {
              dpadPointerIdRef.current = null;
              clearJoystick();
            }}
            onContextMenu={(event) => event.preventDefault()}
            onSelect={(event) => {
              event.preventDefault();
              window.getSelection()?.removeAllRanges();
            }}
          >
            <span className="game-dpad-ring" aria-hidden="true" />
            <span
              className="game-joystick-knob"
              style={{
                transform: `translate(calc(-50% + ${joystickPosition.x * 2.55}rem), calc(-50% + ${joystickPosition.y * 2.55}rem))`,
              }}
              aria-hidden="true"
            >
              <span className="game-joystick-arrow">✦</span>
            </span>
            <span className="game-dpad-label game-dpad-label-top" aria-hidden="true">THRUST</span>
            <span className="game-dpad-label game-dpad-label-bottom" aria-hidden="true">BRAKE</span>
          </div>
        {controlButton('Fire', 'fire', '●', 'game-fire-control')}
      </div>
    </div>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [budget,  setBudget]  = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const fieldCls =
    'w-full rounded-xl border-2 border-paper/30 bg-card px-4 py-3 text-base outline-none ' +
    'placeholder:text-muted-foreground focus:border-lime transition-colors font-sans';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrMsg('');

    try {
      const res = await fetch('https://formspree.io/f/mppanezr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          budget,
          message,
        }),
      });

      if (res.ok) {
        setStatus('sent');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrMsg((data as { error?: string }).error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrMsg('Could not reach the server. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-card p-8 text-center border border-border">
        <p className="display-xl text-2xl text-lime">Sent. Talk soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-12 max-w-2xl rounded-2xl bg-card p-8 text-left border border-border">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="label-mono text-muted-foreground">Name</label>
          <input type="text" required placeholder="Jane Doe" className={fieldCls} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="label-mono text-muted-foreground">Email</label>
          <input type="email" required placeholder="jane@company.com" className={fieldCls} value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label className="label-mono text-muted-foreground">Budget / timing</label>
        <input type="text" placeholder="~$5K, need it by Friday" className={fieldCls} value={budget} onChange={e => setBudget(e.target.value)} />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label className="label-mono text-muted-foreground">What are you building?</label>
        <textarea rows={4} required placeholder="I have an idea that needs vibe coding…" className={`${fieldCls} resize-none`} value={message} onChange={e => setMessage(e.target.value)} />
      </div>
      {status === 'error' && (
        <p className="label-mono mt-4 text-red-400">{errMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="display-xl btn-primary mt-6 w-full rounded-xl text-xl"
      >
        {status === 'sending' ? 'Sending…' : 'Send it →'}
      </button>
    </form>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ index, items, onClose, onNav }: {
  index: number;
  items: typeof brandItems;
  onClose: () => void;
  onNav: (next: number) => void;
}) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && index > 0)               onNav(index - 1);
      if (e.key === 'ArrowRight' && index < items.length - 1) onNav(index + 1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onNav, index, items.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
      <div className="card-hard relative max-w-5xl w-full rounded-2xl bg-card overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} className="label-mono absolute right-4 top-4 z-10 rounded-full border-2 border-paper bg-ink px-3 py-1 hover:bg-lime hover:border-lime hover:text-ink transition-colors">
          ✕ close
        </button>

        {/* Image */}
        <div className="max-h-[70vh] overflow-hidden">
          <img src={item.img} alt={item.title} decoding="async" className="w-full h-full object-contain" />
        </div>

        {/* Footer: title + prev/next */}
        <div className="flex items-center justify-between gap-4 p-6">
          <div>
            <h3 className="display-xl text-2xl">{item.title}</h3>
            <p className="label-mono mt-2 text-muted-foreground">{item.desc}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onNav(index - 1)}
              disabled={!hasPrev}
              className="label-mono rounded-full border-2 border-paper/40 bg-ink px-4 py-2 text-sm hover:border-lime hover:text-lime transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Previous"
            >← prev</button>
            <span className="label-mono text-xs text-muted-foreground tabular-nums">{index + 1} / {items.length}</span>
            <button
              onClick={() => onNav(index + 1)}
              disabled={!hasNext}
              className="label-mono rounded-full border-2 border-paper/40 bg-ink px-4 py-2 text-sm hover:border-lime hover:text-lime transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              aria-label="Next"
            >next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [lightbox, setLightbox] = React.useState<number | null>(null);
  const [resumeExpanded, setResumeExpanded] = useState(false);
  const [gameStage, setGameStage] = useState<GameStage>('closed');
  const [finalScore, setFinalScore] = useState(0);
  const [finalLevel, setFinalLevel] = useState(1);
  const [scoreName, setScoreName] = useState('');
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [startLeaderboardOpen, setStartLeaderboardOpen] = useState(false);
  const [portraitFlipped, setPortraitFlipped] = useState(false);
  const scrollPositionRef = useRef(0);
  const portraitFlipTimerRef = useRef<number | undefined>(undefined);
  const coinDropTimerRef = useRef<number | undefined>(undefined);
  const loadingTimerRef = useRef<number | undefined>(undefined);
  const coinDropAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameStartAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameOverAudioContextRef = useRef<AudioContext | null>(null);
  const gameOverOscillatorsRef = useRef<OscillatorNode[]>([]);

  const rememberScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };
  const startLoadingSequence = () => {
    setGameStage('loading');
    window.clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = window.setTimeout(() => setGameStage('playing'), 3000);
  };
  const beginFromIntro = () => {
    if (gameStage !== 'intro') return;
    const coinDropAudio = canUseDesktopArcadeAudio() ? new Audio(`${BASE}arcade-coin-drop.mp3`) : null;
    if (coinDropAudio) {
      coinDropAudio.preload = 'auto';
      coinDropAudio.volume = .5;
      coinDropAudioRef.current = coinDropAudio;
      void coinDropAudio.play().catch(() => {});
    }
    const gameStartAudio = canUseDesktopArcadeAudio() ? new Audio(`${BASE}arcade-game-start.mp3`) : null;
    if (gameStartAudio) {
      gameStartAudio.preload = 'auto';
      gameStartAudio.volume = .5;
      gameStartAudio.muted = true;
      gameStartAudioRef.current = gameStartAudio;
      void gameStartAudio.play().catch(() => {});
    }
    if (canUseDesktopArcadeAudio() && !gameOverAudioContextRef.current) {
      try {
        gameOverAudioContextRef.current = new AudioContext();
        void gameOverAudioContextRef.current.resume().catch(() => {});
      } catch {
        gameOverAudioContextRef.current = null;
      }
    }
    setGameStage('coin-drop');
    window.clearTimeout(coinDropTimerRef.current);
    coinDropTimerRef.current = window.setTimeout(() => {
      if (gameStartAudio && gameStartAudioRef.current === gameStartAudio) {
        gameStartAudio.currentTime = 0;
        gameStartAudio.muted = false;
      }
      startLoadingSequence();
    }, 720);
  };
  const closeGameExperience = () => {
    window.clearTimeout(coinDropTimerRef.current);
    window.clearTimeout(loadingTimerRef.current);
    coinDropAudioRef.current?.pause();
    if (coinDropAudioRef.current) coinDropAudioRef.current.currentTime = 0;
    coinDropAudioRef.current = null;
    gameStartAudioRef.current?.pause();
    if (gameStartAudioRef.current) gameStartAudioRef.current.currentTime = 0;
    gameStartAudioRef.current = null;
    gameOverOscillatorsRef.current.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already stopped */ }
    });
    gameOverOscillatorsRef.current = [];
    if (gameOverAudioContextRef.current) {
      void gameOverAudioContextRef.current.close().catch(() => {});
    }
    gameOverAudioContextRef.current = null;
    setGameStage('closed');
    requestAnimationFrame(() => window.scrollTo(0, scrollPositionRef.current));
  };
  const handleGameOver = (score: number, level: number) => {
    setFinalScore(score);
    setFinalLevel(level);
    setScoreName('');
    setScoreSubmitted(false);
    setGameStage('over');
  };
  const playAgain = () => {
    if (gameStartAudioRef.current && canUseDesktopArcadeAudio()) {
      gameStartAudioRef.current.currentTime = 0;
      gameStartAudioRef.current.muted = false;
      void gameStartAudioRef.current.play().catch(() => {});
    }
    startLoadingSequence();
  };
  useEffect(() => {
    if (gameStage !== 'over' || !canUseDesktopArcadeAudio()) return;
    const audioContext = gameOverAudioContextRef.current;
    if (!audioContext) return;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    try {
      void audioContext.resume().catch(() => {});
      const start = audioContext.currentTime + .06;
      const notes = [196, 247, 294, 392, 294, 247, 147, 196];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext!.createOscillator();
        const gain = audioContext!.createGain();
        const at = start + index * .22;
        oscillator.type = index % 2 ? 'triangle' : 'square';
        oscillator.frequency.setValueAtTime(frequency, at);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * .72, at + .19);
        gain.gain.setValueAtTime(.0001, at);
        gain.gain.exponentialRampToValueAtTime(.11, at + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, at + .2);
        oscillator.connect(gain);
        gain.connect(audioContext!.destination);
        oscillator.start(at);
        oscillator.stop(at + .22);
        oscillators.push(oscillator);
        gains.push(gain);
      });
      gameOverOscillatorsRef.current = oscillators;
    } catch {
      gameOverOscillatorsRef.current = [];
    }
    return () => {
      oscillators.forEach((oscillator) => { try { oscillator.stop(); } catch { /* already stopped */ } });
      gains.forEach((gain) => gain.disconnect());
    };
  }, [gameStage]);
  useEffect(() => {
    if (gameStage !== 'over' && !(gameStage === 'intro' && startLeaderboardOpen)) return;
    let active = true;
    setLeaderboardLoading(true);
    setLeaderboardError('');
    void fetchLeaderboard()
      .then((scores) => { if (active) setLeaderboard(scores); })
      .catch(() => { if (active) setLeaderboardError('Leaderboard unavailable right now.'); })
      .finally(() => { if (active) setLeaderboardLoading(false); });
    return () => { active = false; };
  }, [gameStage, startLeaderboardOpen]);
  const submitScore = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = (scoreName.trim() || 'ACE').slice(0, 16);
    setLeaderboardLoading(true);
    setLeaderboardError('');
    try {
      const scores = await submitLeaderboardScore({ name, score: finalScore, level: finalLevel });
      setLeaderboard(scores);
      setScoreSubmitted(true);
    } catch {
      setLeaderboardError('Could not save your score. Try again.');
    } finally {
      setLeaderboardLoading(false);
    }
  };
  const triggerPortraitGame = () => {
    setPortraitFlipped(true);
    window.clearTimeout(portraitFlipTimerRef.current);
    portraitFlipTimerRef.current = window.setTimeout(() => {
      rememberScrollPosition();
      setPortraitFlipped(false);
      setGameStage('intro');
    }, 520);
  };

  useEffect(() => {
    return () => window.clearTimeout(portraitFlipTimerRef.current);
  }, []);
  useEffect(() => {
    return () => {
      window.clearTimeout(coinDropTimerRef.current);
      window.clearTimeout(loadingTimerRef.current);
      coinDropAudioRef.current?.pause();
      gameStartAudioRef.current?.pause();
      gameOverOscillatorsRef.current.forEach((oscillator) => {
        try { oscillator.stop(); } catch { /* already stopped */ }
      });
      if (gameOverAudioContextRef.current) {
        void gameOverAudioContextRef.current.close().catch(() => {});
      }
    };
  }, []);
  useEffect(() => {
    if (gameStage === 'closed') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGameExperience();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [gameStage]);

  // Stats animation trigger
  const statsRef  = useRef<HTMLDivElement>(null);
  const [statsOn, setStatsOn] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 12000);
    return () => window.clearInterval(timer);
  }, []);
  const activeTestimonial = testimonials[testimonialIndex];

  return (
    <main id="top" className="overflow-x-clip">

      {/* ── HERO ── */}
      <section className="relative">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img src={heroAbstract} alt="" width={1600} height={1200} fetchPriority="high" decoding="async" className="drift-slow h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>

        {/* Mobile nav */}
        <nav className="relative z-10 md:hidden px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="portrait-trigger group relative h-20 w-20 shrink-0 overflow-visible rounded-full text-left"
              data-flipped={portraitFlipped}
              onClick={triggerPortraitGame}
              aria-label="Open the hidden thirty-second game"
            >
              <span className="portrait-flip-inner">
                <span className="portrait-flip-face portrait-flip-front">
                  <img src={`${BASE}trey-photo.jpg`} alt="Trey Simmons" decoding="async" className="h-full w-full object-cover object-top" />
                </span>
                <span className="portrait-flip-face portrait-flip-back" aria-hidden="true">
                  <img src={`${BASE}arcade-coin-silver.png`} alt="" decoding="async" className="portrait-coin-image" />
                </span>
              </span>
              <span className="portrait-badge" aria-hidden="true">
                <MdiIcon path={mdiGamepadVariant} size={.72} />
              </span>
            </button>
            <div className="flex flex-col gap-0.5">
              <span className="label-mono text-sm font-bold tracking-widest">TREY SIMMONS</span>
              <span className="label-mono text-xs font-bold tracking-widest text-muted-foreground">SENIOR CREATIVE DIRECTOR</span>
              <span className="label-mono text-xs font-bold tracking-widest text-lime">VIBE CODER</span>
            </div>
          </div>
        </nav>

        {/* Nav */}
        <nav className="desktop-nav relative z-10 hidden md:flex flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-12">
          <a href="#top" className="label-mono font-bold text-lime">TREY SIMMONS</a>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#work"    className="label-mono hover:text-lime transition-colors">Build</a>
            <a href="#brand"   className="label-mono hover:text-lime transition-colors">Brand</a>
            <a href="#resume"  className="label-mono hover:text-lime transition-colors">Resume</a>
            <a href="#contact" className="nav-cta label-mono">Let's Vibe</a>
          </div>
        </nav>

        {/* Hero copy */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-6 md:px-12 md:pt-24">

          {/* Two-col: text left, portrait right */}
          <div className="grid items-start gap-8 md:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">

            {/* Text */}
            <div>
              <span className="rise label-mono hidden md:inline-block text-lime md:ml-1">
                SENIOR CREATIVE DIRECTOR · VIBE CODER&nbsp;
              </span>

              <h1 className="display-xl mt-6 text-[clamp(3.2rem,7.5vw,7rem)]" aria-label="Design it. Code it. Ship it.">
                <span className="rise hero-ideas block text-paper" style={{ animationDelay: '120ms' }}>
                  Design it.
                </span>
                <span className="rise block text-paper" style={{ animationDelay: '240ms' }}>
                  Code it.
                </span>
                <span className="rise block text-paper" style={{ animationDelay: '360ms' }}>
                  <span className="real-word">Ship it.</span>
                </span>
              </h1>

              <p className="rise mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl font-sans" style={{ animationDelay: '480ms' }}>
                I’m <strong className="hero-body-name">Trey Simmons</strong> — a Senior Creative Director with 30 years across brand, UX, digital product, and growth.
                Today I pair that experience with AI-native development tools to take ideas from strategy to working product — designing, prototyping, testing, and shipping experiences that drive real business outcomes.
              </p>

              <div className="rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '600ms' }}>
                <a href="#work" className="display-xl btn-primary">
                  See the work
                </a>
                <a href="./trey-simmons-resume.pdf" download="TreySimmons-Resume.pdf" className="display-xl btn-secondary">
                  Grab the resume ↓
                </a>
              </div>
            </div>

            {/* Portrait circle — desktop only, top-aligned with h1 */}
            <figure className="hidden md:flex md:flex-col md:items-center md:justify-center shrink-0 md:mt-[32px]">
              <button
                type="button"
                onClick={triggerPortraitGame}
                className="desktop-game-portrait group relative h-80 w-80 overflow-hidden rounded-full border-4 border-[var(--lime)] text-left xl:h-[360px] xl:w-[360px]"
                aria-label="Play the hidden thirty-second game"
              >
                <span className="portrait-flip-inner">
                  <span className="portrait-flip-face portrait-flip-front">
                    <img
                      src={`${BASE}trey-halftone-hero.jpg`}
                      alt="Trey Simmons"
                      fetchPriority="high"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  </span>
                  <span className="portrait-flip-face portrait-flip-back" aria-hidden="true">
                    <img src={`${BASE}arcade-coin-silver.png`} alt="" decoding="async" className="portrait-coin-image" />
                  </span>
                </span>
              </button>
              <figcaption className="hero-arcade-prompt label-mono" aria-label="Play Starbreaker">
                <svg className="hero-arcade-prompt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true"><path d="M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-306q0 61-43.5 103.5T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm2.66-60q24.34 0 45.01-12.97Q257.33-245.95 268-268l28-57q13-26 36.5-40.5T385-380h190q29 0 52.5 15t37.5 40l28 57q10.67 22.05 31.33 35.03Q745-220 769.26-220 805-220 831-244.5t27-60.5q0-4-3-24l-84-335q-8-33-34.4-54.5T675-740H285q-34.7 0-61.35 21T189-664l-84 335q-1 4-3 23 0 36.48 26.26 61.24Q154.52-220 191.66-220ZM561.5-538.68q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68Zm80-80q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68Zm0 160q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68Zm80-80q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68ZM358-472.08q7-7.09 7-17.92v-45h45q10.83 0 17.92-7.12 7.08-7.11 7.08-18 0-10.88-7.08-17.88-7.09-7-17.92-7h-45v-45q0-10.83-7.12-17.92-7.11-7.08-18-7.08-10.88 0-17.88 7.08-7 7.09-7 17.92v45h-45q-10.83 0-17.92 7.12-7.08 7.11-7.08 18 0 10.88 7.08 17.88 7.09 7 17.92 7h45v45q0 10.83 7.12 17.92 7.11 7.08 18 7.08 10.88 0 17.88-7.08ZM480-480Z" /></svg>
                <span className="hero-arcade-prompt-copy">
                  <span>Need a break?</span>
                  <strong>Play Starbreaker.</strong>
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Stats row — animated one column at a time */}
          <div
            ref={statsRef}
            className="mt-16 grid grid-cols-2 gap-6 pt-8 md:grid-cols-4"
          >
            {stats.map((s, i) => (
              <StatCol key={s.label} value={s.value} label={s.label} delay={i * 180} active={statsOn} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-12">
        <header className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-xl text-[clamp(3.2rem,8vw,6rem)]">
            Recent
            <span className="block text-lime">Builds</span>
          </h2>
          <p className="label-mono max-w-xs text-muted-foreground">
            Prototypes that made it to production. Built with Lovable, Claude, Replit and ChatGPT.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map(proj => (
            <ProjectCard key={proj.id} proj={proj} />
          ))}

          {/* 6th card — CTA */}
          <article className="group card-hard card-hard-hover relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-lime p-10 text-center text-ink">
            <p className="label-mono text-ink/70">Up next</p>
            <h3 className="display-xl mt-4 text-3xl md:text-4xl">Ready to start your vibe project?</h3>
            <p className="font-sans mt-4 text-sm leading-relaxed text-ink/70 max-w-xs">
              Bring your idea. I'll design it, vibe code it, and ship it — fast.
            </p>
            <a
              href="#contact"
              className="display-xl mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-lime hover:opacity-80 transition-opacity"
              style={{ lineHeight: 1 }}
            >
              Let's build →
            </a>
          </article>
        </div>
      </section>

      {/* ── BRAND ── */}
      <section id="brand" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-xl text-[clamp(3.2rem,8vw,6rem)]">
            Brand
            <span className="block text-lime">&amp; Identity</span>
          </h2>
          <p className="label-mono max-w-xs text-muted-foreground">
            Before the code, there's the brand. Decades of systems, logos, and guidelines that make the vibe-coded stuff look right.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brandItems.map((b, i) => (
            <button
              key={b.title}
              onClick={() => setLightbox(i)}
              className="group card-hard card-hard-hover relative aspect-square overflow-hidden rounded-2xl bg-muted text-left cursor-zoom-in"
            >
              <img src={b.img} alt={b.title} loading="lazy" decoding="async" className="h-full w-full object-cover object-left transition-all duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h4 className="display-xl text-2xl translate-y-4 transition-transform duration-300 group-hover:translate-y-0">{b.title}</h4>
                <p className="label-mono mt-2 text-lime translate-y-4 transition-transform duration-300 delay-75 group-hover:translate-y-0">{b.desc}</p>
                <p className="label-mono mt-1 text-muted-foreground translate-y-4 transition-transform duration-300 delay-100 group-hover:translate-y-0">click to enlarge ↗</p>
              </div>
            </button>
          ))}
        </div>

        {lightbox !== null && (
          <Lightbox index={lightbox} items={brandItems} onClose={() => setLightbox(null)} onNav={setLightbox} />
        )}
      </section>

      {/* ── RESUME (The Long Receipt) ── */}
      <section id="resume">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

          {/* Header */}
          <header className="mb-16 flex flex-wrap items-end justify-between gap-8">
            <div>
              <span className="label-mono text-lime">30+ Years, One Throughline</span>
              <h2 className="display-xl mt-3 text-[clamp(2.5rem,8vw,6rem)]">
                The long
                <span className="block text-lime">Receipt.</span>
              </h2>
            </div>
            <a
              href="./trey-simmons-resume.pdf"
              download="TreySimmons-Resume.pdf"
              className="display-xl btn-secondary"
            >
              ↓ Full PDF Resume
            </a>
          </header>

          {/* Timeline */}
          <div className="relative md:pl-12">
            {/* Vertical line */}
            <div className="absolute left-0 top-2 bottom-0 w-px bg-border md:left-1 hidden md:block" />

            {/* Accordion wrapper — renders exactly 3 entries when collapsed, all when expanded */}
            <div className="relative">
              <ol className="space-y-14">
                {(resumeExpanded ? resumeItems : resumeItems.slice(0, 3)).map((item, i) => (
                  <li key={item.org} className="group/row relative">
                    {/* Dot */}
                    <div className={`absolute -left-8 top-5 h-3.5 w-3.5 rounded-full border-2 md:-left-[3.1rem] hidden md:block ${i === 0 ? 'border-lime bg-lime' : 'border-border bg-ink'}`} />

                    {/* Bordered card — hover shifts border to lime tint */}
                    <div className={`rounded-xl border p-5 transition-colors duration-200 ${
                      i === 0
                        ? 'border-lime/25 bg-lime/[0.06]'
                        : 'border-border/50 group-hover/row:border-paper/30 group-hover/row:bg-paper/[0.03]'
                    }`}>
                      <div className="md:grid md:grid-cols-[1fr_2fr] md:gap-12">
                        {/* Left: org + date */}
                        <div className="mb-4 md:mb-0">
                          <div className="display-xl text-2xl md:text-3xl">{item.org}</div>
                          <div className="font-sans mt-1 text-sm text-muted-foreground">{item.role}</div>
                          <div className="label-mono mt-3 text-muted-foreground">{item.years}</div>
                        </div>

                        {/* Right: bullets */}
                        <ul className="space-y-2">
                          {item.notes.map(note => (
                            <li key={note} className="flex gap-3 font-sans text-xs leading-relaxed md:text-sm">
                              <span className="text-lime shrink-0 mt-0.5">·</span>
                              <span className="text-muted-foreground">{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Fade gradient — only visible when collapsed */}
              {!resumeExpanded && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-ink to-transparent" />
              )}
            </div>

            {/* Expand / collapse toggle */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setResumeExpanded(x => !x)}
                className="display-xl btn-secondary"
              >
                {resumeExpanded ? 'Collapse timeline ↑' : 'Show full timeline ↓'}
              </button>
            </div>
          </div>

          {/* Toolkit strip */}
          <div id="skills" className="mt-16 pt-10">
            <span className="label-mono text-lime">Skills</span>
            <div className="tools-grid mt-6">
              {toolGroups.map(group => (
                <div key={group.label} className="tool-group">
                  <div className="tool-group-heading">
                    <svg className="tool-group-icon shrink-0" viewBox="0 -960 960 960" aria-hidden="true">
                      <path d={group.iconPath} />
                    </svg>
                    <span className="label-mono">{group.label}</span>
                  </div>
                  <ul className="tool-group-list">
                    {group.tools.map(tool => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Also on the record */}
          <div className="mt-16 pt-10">
            <span className="label-mono text-lime">Also on the record</span>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: mdiBookOpenPageVariant, label: 'Published Author',       detail: 'Co-creator of "Magical Illusions" — European bestseller on stereoscopic illusions' },
                { icon: mdiFilmstrip,           label: 'Industry First',         detail: '1st lenticular 3D motion visuals ever generated for Eastman Kodak' },
                { icon: mdiPrinter,             label: 'Museum Printing First',  detail: '1st museum reproduction prints using Hexachrome + stochastic screening' },
                { icon: mdiDisc,                label: 'Kodak Photo CD',         detail: 'Beta developer on the original Kodak Photo CD program' },
                { icon: mdiRocketLaunch,        label: 'NASA / Adobe, 1995',     detail: 'Adobe Photoshop consultant to the NASA imaging lab' },
                { icon: mdiTrophy,              label: 'Award Winner',           detail: 'Addy Award + MITX Award winner' },
              ].map(item => (
                <div key={item.label} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <MdiIcon path={item.icon} size={1.1} className="shrink-0 mt-0.5 text-lime" color="currentColor" />
                  <div>
                    <div className="record-card-label label-mono text-lime text-xs">{item.label}</div>
                    <p className="font-sans mt-1 text-sm leading-snug text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section mx-auto max-w-7xl px-6 md:px-12" aria-label="Good company testimonials">
        <div className="testimonials-shell">
          <div className="testimonial-layout">
            <article className="testimonial-slide" key={activeTestimonial.name} aria-live="polite">
              <blockquote>
                <span className="testimonial-quote-text">{activeTestimonial.quote}</span>
                <footer>
                  <a href="https://www.linkedin.com/in/treysimmons" target="_blank" rel="noreferrer" className="testimonial-name">
                    {activeTestimonial.name} ↗
                  </a>
                  <span>{activeTestimonial.role}</span>
                </footer>
              </blockquote>
            </article>
            <div className="testimonial-control-cluster" aria-label="Testimonial controls">
              <a
                href="https://www.linkedin.com/in/treysimmons"
                target="_blank"
                rel="noreferrer"
                className="label-mono testimonials-link"
              >
                View on LinkedIn ↗
              </a>
              <div className="testimonial-control-row">
                <div className="testimonial-dots" role="tablist" aria-label="Testimonials">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.name}
                      type="button"
                      role="tab"
                      aria-selected={testimonialIndex === index}
                      aria-label={`Show testimonial from ${testimonial.name}`}
                      className={testimonialIndex === index ? 'is-active' : ''}
                      onClick={() => setTestimonialIndex(index)}
                    />
                  ))}
                </div>
                <div className="testimonial-arrows">
                  <button
                    type="button"
                    className="testimonial-arrow"
                    onClick={() => setTestimonialIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}
                    aria-label="Previous testimonial"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="testimonial-arrow"
                    onClick={() => setTestimonialIndex((current) => (current + 1) % testimonials.length)}
                    aria-label="Next testimonial"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact">
        <div className="mx-auto max-w-7xl px-6 py-28 md:px-12">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="display-xl text-[clamp(2.8rem,10vw,8rem)]">
              Got an idea
              <span className="block text-lime">worth vibing?</span>
            </h2>
            <p className="font-sans mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
              Interactive campaigns, product prototypes, internal tools, weird one-off
              experiences — if it should exist by next week, let's build it.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 py-8">
            <span className="label-mono">TREY SIMMONS — SENIOR CREATIVE DIRECTOR &amp; VIBE CODER</span>
            <span className="label-mono text-muted-foreground">Designed loud. Built fast.</span>
          </div>
        </div>
      </footer>

      {(gameStage === 'intro' || gameStage === 'coin-drop') && (
        <div className="portrait-intro-overlay" role="dialog" aria-modal="true" aria-label="Hidden game invitation">
          <button type="button" className="intro-dismiss" onClick={closeGameExperience} aria-label="Close game invitation">×</button>
          <div className="portrait-intro-card" data-coin-dropping={gameStage === 'coin-drop' || undefined}>
            <div className="portrait-intro-image portrait-coin-large">
              <img src={`${BASE}arcade-coin-silver.png`} alt="" decoding="async" className="portrait-coin-image" />
            </div>
            <div className="relative z-10 px-7 pb-7 pt-5 text-center">
              <p className="label-mono text-lime">A tiny portfolio detour</p>
              <h2 className="display-xl mt-3 text-4xl text-paper">Ready Player 1?</h2>
              <button type="button" onClick={beginFromIntro} disabled={gameStage === 'coin-drop'} className="display-xl btn-primary mt-6">
                {gameStage === 'coin-drop' ? 'Inserting…' : <>Play <span>→</span></>}
              </button>
              <button
                type="button"
                className="start-leaderboard-link label-mono"
                onClick={() => setStartLeaderboardOpen((open) => !open)}
                aria-expanded={startLeaderboardOpen}
              >
                {startLeaderboardOpen ? 'Hide leaderboard' : 'View leaderboard'} <span>↗</span>
              </button>
              {startLeaderboardOpen && (
                <div className="arcade-leaderboard arcade-leaderboard-start mt-4 w-full text-left">
                  <div className="arcade-leaderboard-heading">
                    <p className="label-mono arcade-leaderboard-title"><svg className="arcade-resume-icon" viewBox="0 0 24 24" aria-hidden="true"><g transform="rotate(-8 12 12)"><rect x="4" y="2" width="16" height="20" /><rect x="8" y="5" width="8" height="14" /><path d="M10 9h4M10 12h4M10 15h3" /></g></svg> Leaderboard</p>
                    <span className="label-mono arcade-leaderboard-mode">{supabaseUrl ? 'GLOBAL SCORES' : 'LOCAL SCORES'}</span>
                  </div>
                  {leaderboardLoading && leaderboard.length === 0 && <p className="label-mono mt-3 text-muted-foreground">Loading scores…</p>}
                  {!leaderboardLoading && leaderboard.length === 0 && <p className="label-mono mt-3 text-muted-foreground">No scores yet.</p>}
                  {leaderboard.length > 0 && (
                    <ol className="arcade-score-list">
                      {leaderboard.map((entry, index) => (
                        <li key={entry.id || `${entry.name}-${entry.score}-${index}`} className={`arcade-score-row ${index < 3 ? `arcade-rank-${index + 1}` : ''}`}>
                          <span className="arcade-rank">{String(index + 1).padStart(2, '0')}</span>
                          <span className="arcade-player">{entry.name}</span>
                          <span className="arcade-entry-level">L{entry.level}</span>
                          <span className="arcade-score">{entry.score.toString().padStart(4, '0')}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
              <p className="start-key-instructions label-mono mt-4 text-xs text-muted-foreground">Keys: ← → rotate · ↑ ↓ thrust · SPACE fire</p>
            </div>
          </div>
        </div>
      )}

      {gameStage === 'loading' && (
        <div className="arcade-loading-screen" role="status" aria-live="polite" aria-label="Loading Starbreaker">
          <img className="arcade-loading-art" src={starbreakerLogo} alt="Starbreaker" decoding="async" />
          <div className="arcade-loading-caption">
            <p className="label-mono text-lime">STARBREAKER SYSTEMS</p>
            <p className="display-xl arcade-loading-title">Loading mission</p>
            <p className="label-mono arcade-loading-copy">Calibrating thrusters · Stand by</p>
          </div>
        </div>
      )}

      {(gameStage === 'loading' || gameStage === 'playing') && (
        <AsteroidsGame
          onExit={closeGameExperience}
          onGameOver={handleGameOver}
        />
      )}

      {gameStage === 'over' && (
        <div className="game-over-screen" role="dialog" aria-modal="true" aria-label="Game over">
          <button type="button" className="intro-dismiss" onClick={closeGameExperience} aria-label="Close game">×</button>
          <div className="game-over-card score-card halftone">
            <div className="relative z-10 bg-ink/90 p-8 text-center">
              <p className="display-xl text-5xl text-paper">Game over.</p>
              <p className="label-mono mt-3 text-lime">Ship lost in the field</p>
              <p className="label-mono mt-6 text-lime">Final score</p>
              <p className="display-xl game-over-score mt-1 leading-none text-paper">
                {finalScore.toString().padStart(4, '0')}
              </p>
              <p className="label-mono mt-3 text-muted-foreground">Level {String(finalLevel).padStart(2, '0')} reached</p>
              {!scoreSubmitted && (
                <form onSubmit={submitScore} className="mt-6 flex w-full flex-col gap-2">
                  <label htmlFor="arcade-score-name" className="label-mono text-left text-muted-foreground">Enter your initials</label>
                  <div className="flex gap-2">
                    <input
                      id="arcade-score-name"
                      value={scoreName}
                      onChange={(event) => setScoreName(event.target.value.toUpperCase().replace(/[^A-Z0-9 _-]/g, '').slice(0, 16))}
                      placeholder="ACE"
                      maxLength={16}
                      autoComplete="nickname"
                      className="min-w-0 flex-1 border border-border bg-card px-3 py-2 font-mono text-paper outline-none focus:border-lime"
                    />
                    <button type="submit" disabled={leaderboardLoading} className="game-back-button display-xl px-4">
                      {leaderboardLoading ? 'Saving…' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
              {scoreSubmitted && <p className="label-mono mt-4 text-lime">Score logged.</p>}
              {leaderboardError && <p className="label-mono mt-3 text-red-400">{leaderboardError}</p>}
              <div className="arcade-leaderboard mt-6 w-full text-left">
                <div className="arcade-leaderboard-heading">
                  <p className="label-mono arcade-leaderboard-title"><svg className="arcade-medal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-hidden="true"><path d="M621.5-198.26q58.5-58.27 58.5-141.5 0-83.24-58.26-141.74-58.27-58.5-141.5-58.5-83.24 0-141.74 58.26-58.5 58.27-58.5 141.5 0 83.24 58.26 141.74 58.27 58.5 141.5 58.5 83.24 0 141.74-58.26ZM346-563q28-17 60-26.5t67-10.5L363-820H217l129 257Zm268 0 129-257H597l-83 167 30 60q19 5 36.5 12.5T614-563ZM273-183q-25-33-39-72.5T220-340q0-45 14-84.5t39-72.5q-57 10-95 53.5T140-340q0 60 38 103.5t95 53.5Zm414 0q57-10 95-53.5T820-340q0-60-38-103.5T687-497q25 33 39 72.5t14 84.5q0 45-14 84.5T687-183ZM403.5-91.5Q367-103 336-123q-9 2-18 2.5t-19 .5q-91 0-155-64T80-339q0-87 58-149t143-69L120-880h280l80 160 80-160h280L680-559q85 8 142.5 70T880-340q0 92-64 156t-156 64q-9 0-18.5-.5T623-123q-31 20-67 31.5T480-80q-40 0-76.5-11.5ZM480-340ZM346-563 217-820l129 257Zm268 0 129-257-129 257ZM406-230l28-91-74-53h91l29-96 29 96h91l-74 53 28 91-74-56-74 56Z" /></svg> Leaderboard</p>
                  <span className="label-mono arcade-leaderboard-mode">{supabaseUrl ? 'GLOBAL SCORES' : 'LOCAL SCORES'}</span>
                </div>
                {leaderboardLoading && leaderboard.length === 0 && <p className="label-mono mt-3 text-muted-foreground">Loading scores…</p>}
                {!leaderboardLoading && leaderboard.length === 0 && <p className="label-mono mt-3 text-muted-foreground">No scores yet.</p>}
                {leaderboard.length > 0 && (
                  <ol className="arcade-score-list">
                    {leaderboard.map((entry, index) => (
                      <li key={entry.id || `${entry.name}-${entry.score}-${index}`} className={`arcade-score-row ${index < 3 ? `arcade-rank-${index + 1}` : ''}`}>
                        <span className="arcade-rank">{String(index + 1).padStart(2, '0')}</span>
                        <span className="arcade-player">{entry.name}</span>
                        <span className="arcade-entry-level">L{entry.level}</span>
                        <span className="arcade-score">{entry.score.toString().padStart(4, '0')}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="mt-8 flex w-full flex-col gap-3">
                <button type="button" onClick={playAgain} className="portrait-play-button display-xl w-full justify-center">
                  Play again
                </button>
                <button type="button" onClick={closeGameExperience} className="game-back-button display-xl w-full justify-center">
                  Back to work <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
