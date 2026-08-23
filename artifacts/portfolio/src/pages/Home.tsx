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
} from '@mdi/js';

// ── Assets ───────────────────────────────────────────────────────────────────
// Hero images live in /public so the browser can preload them before JS runs
const BASE = import.meta.env.BASE_URL;
const heroAbstract = `${BASE}hero-abstract.jpg`;

import projectMasterData  from '@assets/images/projects/master-data-quest.jpg';
import projectMasterDataVideo from '@assets/images/projects/master-data-quest.mp4';
import projectWorldCup    from '@assets/images/projects/world-cup.jpg';
import projectWorldCupVideo from '@assets/images/projects/world-cup.mp4';
import projectRoi         from '@assets/images/projects/roi-calculator-bg.jpg';
import projectRoiVideo    from '@assets/images/projects/roi-calculator.mp4';
import projectQuiz        from '@assets/images/projects/quiz.jpg';
import projectQuizVideo   from '@assets/images/projects/quiz.mp4';
import projectShipFaster  from '@assets/images/projects/ship-faster.png';
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
  { value: '30+',  label: 'Years Directing Creative' },
  { value: '2M',   label: 'Monthly Uniques Grown from 0' },
  { value: '$10M', label: 'Pipeline from ABM Design' },
  { value: '22%',  label: 'Trial Lift from UX Testing' },
];

const toolkit = [
  // Design & build
  'Adobe Creative Suite', 'Figma', 'Framer', 'Webflow', 'Lottie',
  // AI-assisted dev
  'Replit', 'Cursor', 'v0', 'Lovable',
  // AI models
  'Claude', 'ChatGPT', 'Gemini', 'Midjourney', 'Runway',
  // Dev & measurement
  'GitHub', 'Google Analytics 4', 'VWO / Optimizely', 'Website Optimization', 'Miro',
];

const projects = [
  {
    id: 'master-data-quest',
    num: '01',
    category: 'Booth Game · Gartner Engagement Zone',
    title: 'Master Data Quest',
    desc: 'One of six original arcade games designed and built for the Gartner Data & Analytics conference. Players race a robot down a starlit track, dodging duplicate records.',
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
    desc: 'Turns "trust me" into a number leadership believes. An interactive value calculator that quantifies the cost of bad data.',
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
    <div style={{ animation: active ? `count-up 0.6s ${delay}ms cubic-bezier(.2,.8,.2,1) both` : 'none' }}>
      <div className="display-xl text-4xl text-lime md:text-5xl">{active ? displayed : '–'}</div>
      <div className="label-mono mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}

// ── 30-second portrait Easter egg ────────────────────────────────────────────
type GameStage = 'closed' | 'intro' | 'playing' | 'over';

function AsteroidsGame({
  onExit,
  onGameOver,
}: {
  onExit: () => void;
  onGameOver: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef({ left: false, right: false, thrust: false, fire: false });
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [lives, setLives] = useState(3);
  const [showHint, setShowHint] = useState(true);
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
      flashUntil: number; destroyed: boolean; destroyedAt: number;
    };
    type AlphaMask = { size: number; alpha: Uint8ClampedArray };
    type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
    type Fragment = { x: number; y: number; vx: number; vy: number; life: number; size: number; angle: number };

    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let last = performance.now();
    let lastFire = 0;
    let running = true;
    let scoreValue = 0;
    let displayedSecond = 30;
    let spawnTimer = 2.4;
    let ufoTimer = 8;
    let ufo: { x: number; y: number; vx: number; phase: number; soundPlayed: boolean } | null = null;
    let livesValue = 3;
    let invulnerableUntil = 0;
    let shipDestroyedUntil = 0;
    let gameOverTimer: number | undefined;
    let audioContext: AudioContext | null = null;
    const startedAt = performance.now();
    const ship = { x: width / 2, y: height / 2, vx: 0, vy: 0, angle: -Math.PI / 2 };
    const bullets: Bullet[] = [];
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
    ufoImage.src = `${BASE}arcade-ufo.png`;
    const stars = Array.from({ length: 72 }, (_, i) => ({
      x: ((i * 127) % 1000) / 1000,
      y: ((i * 283) % 1000) / 1000,
      r: i % 7 === 0 ? 1.5 : 0.8,
    }));
    const wakeAudio = () => {
      if (!audioContext) audioContext = new AudioContext();
      if (audioContext.state === 'suspended') void audioContext.resume();
    };
    const playSound = (frequency: number, duration: number, type: OscillatorType = 'square', volume = .035) => {
      wakeAudio();
      if (!audioContext) return;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    };
    const playUfoArrivalSound = () => {
      wakeAudio();
      if (!audioContext) return;
      const start = audioContext.currentTime;
      [0, .19, .38].forEach((offset, index) => {
        const oscillator = audioContext!.createOscillator();
        const gain = audioContext!.createGain();
        const noteStart = start + offset;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(index === 1 ? 135 : 180, noteStart);
        oscillator.frequency.linearRampToValueAtTime(index === 1 ? 105 : 145, noteStart + .14);
        gain.gain.setValueAtTime(.001, noteStart);
        gain.gain.linearRampToValueAtTime(.05, noteStart + .035);
        gain.gain.exponentialRampToValueAtTime(.001, noteStart + .17);
        oscillator.connect(gain);
        gain.connect(audioContext!.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + .19);
      });
    };
    const asteroid = (size: AsteroidSize = 'large', origin?: { x: number; y: number }, velocity?: { x: number; y: number }): Asteroid => {
      const specs = {
        large: { r: 62, hits: 3, speed: 28, points: 100 },
        medium: { r: 38, hits: 2, speed: 48, points: 200 },
        small: { r: 17, hits: 1, speed: 74, points: 300 },
      }[size];
      const edge = Math.floor(Math.random() * 4);
      const r = specs.r * (.88 + Math.random() * .2);
      const speed = specs.speed * (.8 + Math.random() * .4);
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
        destroyed: false, destroyedAt: 0,
      };
    };
    const asteroids = [
      asteroid('large'), asteroid('large'), asteroid('medium'), asteroid('medium'), asteroid('small'),
    ];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ship.x = Math.min(ship.x, width - 24);
      ship.y = Math.min(ship.y, height - 24);
    };

    const setControl = (key: string, value: boolean) => {
      if (key === 'ArrowLeft' || key.toLowerCase() === 'a') controlsRef.current.left = value;
      if (key === 'ArrowRight' || key.toLowerCase() === 'd') controlsRef.current.right = value;
      if (key === 'ArrowUp' || key.toLowerCase() === 'w') controlsRef.current.thrust = value;
      if (key === ' ' || key === 'Enter') controlsRef.current.fire = value;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      wakeAudio();
      if (event.key === 'Escape') { onExitRef.current(); return; }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'Enter', 'a', 'A', 'd', 'D', 'w', 'W'].includes(event.key)) {
        event.preventDefault();
        setControl(event.key, true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => setControl(event.key, false);

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerdown', wakeAudio);

    const wrap = (value: number, max: number) => (value + max) % max;
    const drawAsteroid = (item: Asteroid) => {
      const now = performance.now();
      const dissolveProgress = item.destroyed ? Math.min(1, (now - item.destroyedAt) / 380) : 0;
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.angle);
      if (dissolveProgress > 0) {
        ctx.scale(1 + dissolveProgress * .28, 1 + dissolveProgress * .28);
        ctx.globalAlpha = 1 - dissolveProgress;
        ctx.filter = `blur(${dissolveProgress * 4}px)`;
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
      for (let i = 0; i < (item.size === 'large' ? 12 : 7); i += 1) {
        const angle = (i / 7) * Math.PI * 2 + Math.random() * .4;
        fragments.push({
          x: item.x, y: item.y, vx: Math.cos(angle) * (35 + Math.random() * 65),
          vy: Math.sin(angle) * (35 + Math.random() * 65), life: .45 + Math.random() * .35,
          size: 2 + Math.random() * 4, angle,
        });
      }
    };
    const drawUfo = (item: { x: number; y: number; phase: number }) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.shadowColor = '#dcf24a';
      ctx.shadowBlur = 20;
      if (ufoImageReady) {
        ctx.drawImage(ufoImage, -74, -43, 148, 86);
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
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#080a12';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(246,245,235,.45)';
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      asteroids.forEach(drawAsteroid);
      if (ufo) drawUfo(ufo);
      fragments.forEach((fragment) => {
        ctx.save();
        ctx.translate(fragment.x, fragment.y);
        ctx.rotate(fragment.angle);
        ctx.globalAlpha = Math.max(0, fragment.life * 1.5);
        ctx.fillStyle = fragment.life > .4 ? '#dcf24a' : '#f6f5eb';
        ctx.fillRect(-fragment.size, -fragment.size, fragment.size * 2, fragment.size * 2);
        ctx.restore();
      });
      bullets.forEach((bullet) => {
        ctx.fillStyle = '#dcf24a';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle + Math.PI / 2);
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
      ctx.strokeStyle = '#f6f5eb';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#dcf24a';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(12, 14); ctx.lineTo(0, 8); ctx.lineTo(-12, 14); ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, .05);
      last = now;
      const remaining = Math.max(0, 30 - (now - startedAt) / 1000);
      const rounded = Math.ceil(remaining);
      if (rounded !== displayedSecond) {
        displayedSecond = rounded;
        setSeconds(rounded);
      }
      if (remaining <= 0) {
        running = false;
        onGameOverRef.current(scoreValue);
        return;
      }
      spawnTimer -= dt;
      const chaos = remaining <= 10;
      if (spawnTimer <= 0 && asteroids.length < (chaos ? 13 : 8)) {
        asteroids.push(asteroid(chaos && Math.random() > .45 ? 'medium' : 'small'));
        spawnTimer = chaos ? .85 : 2.2;
      }
      ufoTimer -= dt;
      if (!ufo && remaining < 25 && ufoTimer <= 0) {
        ufo = { x: -76, y: height * (.25 + Math.random() * .45), vx: 110, phase: 0, soundPlayed: false };
      }
      if (ufo) {
        ufo.x += ufo.vx * dt;
        ufo.y += Math.sin(now / 280) * 18 * dt;
        ufo.phase += dt * 8;
        if (!ufo.soundPlayed && ufo.x > 0) {
          ufo.soundPlayed = true;
          playUfoArrivalSound();
        }
        if (ufo.x > width + 76) {
          ufo = null;
          ufoTimer = 99;
        }
      }

      if (controlsRef.current.left) ship.angle -= 3.8 * dt;
      if (controlsRef.current.right) ship.angle += 3.8 * dt;
      if (controlsRef.current.thrust) {
        ship.vx += Math.cos(ship.angle) * 210 * dt;
        ship.vy += Math.sin(ship.angle) * 210 * dt;
      }
      ship.vx *= .992;
      ship.vy *= .992;
      ship.x = wrap(ship.x + ship.vx * dt, width);
      ship.y = wrap(ship.y + ship.vy * dt, height);
      if (controlsRef.current.fire && now - lastFire > 210) {
        lastFire = now;
        bullets.push({ x: ship.x, y: ship.y, vx: Math.cos(ship.angle) * 460, vy: Math.sin(ship.angle) * 460, life: 1.05 });
        playSound(420, .045, 'square', .018);
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
          if (Math.hypot(ufo.x - bullet.x, ufo.y - bullet.y) < 58) {
            for (let fragment = 0; fragment < 14; fragment += 1) {
              const angle = (fragment / 14) * Math.PI * 2;
              fragments.push({
                x: ufo.x, y: ufo.y, vx: Math.cos(angle) * 90, vy: Math.sin(angle) * 90,
                life: .7, size: 3, angle,
              });
            }
            bullets.splice(bulletIndex, 1);
            playSound(880, .12, 'triangle', .045);
            ufo = null;
            ufoTimer = 99;
            scoreValue += 750;
            setScore(scoreValue);
            break;
          }
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
      if (now > invulnerableUntil) {
        const shipPoints = [
          [ship.x, ship.y],
          [ship.x + Math.cos(ship.angle) * 16, ship.y + Math.sin(ship.angle) * 16],
          [ship.x + Math.cos(ship.angle + 2.35) * 12, ship.y + Math.sin(ship.angle + 2.35) * 12],
          [ship.x + Math.cos(ship.angle - 2.35) * 12, ship.y + Math.sin(ship.angle - 2.35) * 12],
        ];
        const hitAsteroid = asteroids.some((item) => !item.destroyed && shipPoints.some(([x, y]) => pointHitsAsteroid(item, x, y)));
        const hitUfo = ufo !== null && Math.hypot(ufo.x - ship.x, ufo.y - ship.y) < 58;
        if (hitAsteroid || hitUfo) {
          const impactX = ship.x;
          const impactY = ship.y;
          for (let fragment = 0; fragment < 18; fragment += 1) {
            const angle = (fragment / 18) * Math.PI * 2;
            fragments.push({
              x: impactX, y: impactY, vx: Math.cos(angle) * (55 + Math.random() * 80),
              vy: Math.sin(angle) * (55 + Math.random() * 80), life: .5 + Math.random() * .35,
              size: 2 + Math.random() * 4, angle,
            });
          }
          livesValue -= 1;
          setLives(livesValue);
          playSound(105, .24, 'sawtooth', .055);
          invulnerableUntil = now + 2200;
          shipDestroyedUntil = now + 480;
          ship.x = width / 2;
          ship.y = height / 2;
          ship.vx = 0;
          ship.vy = 0;
          if (livesValue <= 0) {
            running = false;
            gameOverTimer = window.setTimeout(() => onGameOverRef.current(scoreValue), 500);
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
            playSound(item.hits <= 0 ? 190 : 320, .09, 'triangle', .03);
            if (item.hits <= 0) {
              item.destroyed = true;
              item.destroyedAt = now;
              scoreValue += item.size === 'large' ? 100 : item.size === 'medium' ? 200 : 300;
              setScore(scoreValue);
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
      window.removeEventListener('pointerdown', wakeAudio);
      void audioContext?.close();
    };
  }, []);

  const press = (control: keyof typeof controlsRef.current, active: boolean) => {
    controlsRef.current[control] = active;
  };
  const controlButton = (label: string, control: keyof typeof controlsRef.current, symbol: string) => (
    <button
      type="button"
      aria-label={label}
      className="game-control"
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        press(control, true);
      }}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        press(control, false);
      }}
      onPointerLeave={() => press(control, false)}
      onPointerCancel={() => press(control, false)}
    >
      {symbol}
    </button>
  );

  return (
    <div className="game-stage" role="dialog" aria-modal="true" aria-label="Thirty-second asteroid game">
      <canvas ref={canvasRef} className="game-canvas" />
      <div className="game-hud">
        <div className="game-score"><span>Score</span><strong>{score.toString().padStart(4, '0')}</strong></div>
        <div className={seconds <= 5 ? 'game-timer is-urgent' : 'game-timer'}><span>Time</span><strong>{seconds}s</strong></div>
        <div className="game-lives"><span>Lives</span><strong>{'●'.repeat(lives)}</strong></div>
        <button type="button" className="game-close" onClick={onExit} aria-label="Close game">×<span>Exit</span></button>
      </div>
      {showHint && <div className="game-instructions label-mono">← / → rotate · ↑ thrust · space fire</div>}
      <div className="game-controls" aria-label="Touch controls">
        <div className="flex gap-3">
          {controlButton('Rotate left', 'left', '↶')}
          {controlButton('Rotate right', 'right', '↷')}
        </div>
        <div className="flex gap-3">
          {controlButton('Thrust', 'thrust', '↑')}
          {controlButton('Fire', 'fire', '●')}
        </div>
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
        <div className="flex items-center justify-between gap-4 p-6 border-t-2 border-border">
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
  const [portraitFlipped, setPortraitFlipped] = useState(false);
  const scrollPositionRef = useRef(0);
  const portraitFlipTimerRef = useRef<number | undefined>(undefined);

  const rememberScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
  };
  const beginFromIntro = () => setGameStage('playing');
  const closeGameExperience = () => {
    setGameStage('closed');
    requestAnimationFrame(() => window.scrollTo(0, scrollPositionRef.current));
  };
  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setGameStage('over');
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

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative border-b-2 border-paper">

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
                  <img src={`${BASE}arcade-coin.png`} alt="" decoding="async" className="portrait-coin-image" />
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
        <nav className="relative z-10 hidden md:flex flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-12">
          <span className="label-mono bg-lime px-3 py-2 text-ink">TREY SIMMONS</span>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#work"    className="label-mono hover:text-lime transition-colors">Work</a>
            <a href="#resume"  className="label-mono hover:text-lime transition-colors">Resume</a>
            <a href="#contact" className="label-mono hover:text-lime transition-colors">Let's Build</a>
          </div>
        </nav>

        {/* Hero copy */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-6 md:px-12 md:pt-12">

          {/* Two-col: text left, portrait right */}
          <div className="grid items-start gap-8 md:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">

            {/* Text */}
            <div>
              <span className="rise label-mono hidden md:inline-block text-lime md:ml-1">
                SENIOR CREATIVE DIRECTOR · VIBE CODER&nbsp;
              </span>

              <h1 className="display-xl mt-6 text-[clamp(3.2rem,7.5vw,7rem)]">
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
                I'm Trey Simmons — a Senior Creative Director with 30 years across art direction, brand and UX,
                now pointed at AI-powered building. With Replit, v0, ChatGPT, Gemini and more, I take ideas
                from concept to working, tested, beautiful products — quizzes, calculators, games, leaderboards,
                admin consoles and the brand systems that wrap them.
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
            <figure className="hidden md:flex md:justify-center shrink-0 md:mt-[12px]">
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
                    <img src={`${BASE}arcade-coin.png`} alt="" decoding="async" className="portrait-coin-image" />
                  </span>
                </span>
              </button>
            </figure>
          </div>

          {/* Stats row — animated one column at a time */}
          <div
            ref={statsRef}
            className="mt-16 grid grid-cols-2 gap-6 border-t-2 border-dashed border-border pt-8 md:grid-cols-4"
          >
            {stats.map((s, i) => (
              <StatCol key={s.label} value={s.value} label={s.label} delay={i * 180} active={statsOn} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
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
      <section id="resume" className="border-t-2 border-paper">
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
          <div className="mt-16 border-t border-border pt-10">
            <span className="label-mono text-muted-foreground">Tools &amp; AI</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {toolkit.map(tool => (
                <span key={tool} className="label-mono rounded-full border border-border px-4 py-1.5 text-muted-foreground hover:border-lime hover:text-lime transition-colors cursor-default">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Also on the record */}
          <div className="mt-16 border-t border-border pt-10">
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
                    <div className="label-mono text-lime text-xs">{item.label}</div>
                    <p className="font-sans mt-1 text-sm leading-snug text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="border-t-2 border-paper">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center md:px-12">
          <h2 className="display-xl text-[clamp(2.8rem,10vw,8rem)]">
            Got an idea
            <span className="block text-lime">worth vibing on?</span>
          </h2>
          <p className="font-sans mx-auto mt-8 max-w-2xl text-lg text-muted-foreground">
            Interactive campaigns, product prototypes, internal tools, weird one-off
            experiences — if it should exist by next week, let's build it.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-2 border-paper px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <span className="label-mono">TREY SIMMONS — SENIOR CREATIVE DIRECTOR &amp; VIBE CODER</span>
          <span className="label-mono text-muted-foreground">Designed loud. Built fast.</span>
        </div>
      </footer>

      {gameStage === 'intro' && (
        <div className="portrait-intro-overlay" role="dialog" aria-modal="true" aria-label="Hidden game invitation">
          <button type="button" className="intro-dismiss" onClick={closeGameExperience} aria-label="Close game invitation">×</button>
          <div className="portrait-intro-card">
            <div className="portrait-intro-image portrait-coin-large">
              <img src={`${BASE}arcade-coin.png`} alt="" decoding="async" className="portrait-coin-image" />
            </div>
            <div className="relative z-10 px-7 pb-7 pt-5 text-center">
              <p className="label-mono text-lime">A tiny portfolio detour</p>
              <h2 className="display-xl mt-3 text-4xl text-paper">Ready?</h2>
              <button type="button" onClick={beginFromIntro} className="portrait-play-button display-xl mt-6">
                Play <span>→</span>
              </button>
              <p className="label-mono mt-4 text-xs text-muted-foreground">Keys: ← → rotate · ↑ thrust · SPACE fire</p>
            </div>
          </div>
        </div>
      )}

      {gameStage === 'playing' && (
        <AsteroidsGame onExit={closeGameExperience} onGameOver={handleGameOver} />
      )}

      {gameStage === 'over' && (
        <div className="game-over-screen" role="dialog" aria-modal="true" aria-label="Game over">
          <button type="button" className="intro-dismiss" onClick={closeGameExperience} aria-label="Close game">×</button>
          <div className="game-over-card score-card halftone">
            <div className="relative z-10 bg-ink/90 p-8 text-center">
              <p className="display-xl text-5xl text-paper">Time.</p>
              <p className="label-mono mt-6 text-lime">Final score</p>
              <p className="display-xl mt-1 text-[clamp(4.5rem,18vw,8rem)] leading-none text-paper">
                {finalScore.toString().padStart(4, '0')}
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button type="button" onClick={() => setGameStage('playing')} className="portrait-play-button display-xl w-full justify-center">
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
