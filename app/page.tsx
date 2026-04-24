"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  Instagram,
  Phone,
  Menu,
  X,
  Radio,
  Sparkles,
  Navigation,
  Music4,
  Youtube,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────
   DESIGN TOKENS
────────────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AMBER        = "#C9892A";
const AMBER_GLOW   = "rgba(201,137,42,0.22)";
const AMBER_BORDER = "rgba(201,137,42,0.35)";
const IG_GRADIENT  = "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)";

/* ──────────────────────────────────────────────────────────
   DATA
────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Início",   href: "#hero"     },
  { label: "Sobre",    href: "#bio"      },
  { label: "Serviços", href: "#services" },
  { label: "Contato",  href: "#contact"  },
] as const;

const BIO_PARAGRAPHS = [
  "Anderson Lima descobriu sua paixão pela música aos 14 anos, cruzando o caminho do Professor Gilmar, mentor que enxergou seu brilho inato. Sob sua orientação, mergulhou no violão, iniciando uma carreira meteórica.",
  "Com um talento que cativa plateias, brilhou em palcos icônicos como a FICAR Assis e o Rodeio de Tarumã, hipnotizando multidões com melodias que tocam a alma.",
  "Hoje, Anderson Lima é sinônimo de superação e genialidade — um artista que transforma sonhos em realidade com o violão em mãos.",
] as const;

const SERVICES = [
  {
    icon: Radio,
    title: "Shows & Eventos",
    description: "Apresentações ao vivo para festas particulares, casamentos, formaturas e eventos corporativos. Experiência em palcos de grande porte.",
  },
  {
    icon: Sparkles,
    title: "Rodeios & Festas",
    description: "Presença marcante em rodeios, festas juninas e eventos rurais. Repertório sertanejo raiz e universitário.",
  },
  {
    icon: Navigation,
    title: "Região & Interior",
    description: "Atendimento em toda a região de Assis e interior de São Paulo. Estrutura própria, sem complicações.",
  },
  {
    icon: Music4,
    title: "Repertório Exclusivo",
    description: "Músicas autorais e os maiores hits do sertanejo, adaptados ao estilo e pedido do seu evento.",
  },
] as const;

/* ──────────────────────────────────────────────────────────
   ANIMATION VARIANTS — TypeScript-safe
────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: (delay: number = 0) => ({
    y: 0, opacity: 1,
    transition: { duration: 0.85, delay, ease: EASE_OUT },
  }),
};

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
};

const titleWord: Variants = {
  hidden: { y: 110, rotateX: 40, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

const cardVariant: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0, opacity: 1,
    transition: { duration: 0.7, delay: i * 0.12, ease: EASE_OUT },
  }),
};

/* ──────────────────────────────────────────────────────────
   PARTICLES HOOK
────────────────────────────────────────────────────────── */

function useParticles(canvasId: string) {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.25,
      vx: (Math.random() - 0.5) * 0.17, vy: -Math.random() * 0.2 - 0.04,
      a: Math.random() * 0.32 + 0.04,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,155,70,${p.a})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [canvasId]);
}

/* ──────────────────────────────────────────────────────────
   SHARED: SECTION EYEBROW
────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-body text-[9px] tracking-[0.38em] uppercase text-white/28 flex items-center gap-3 mb-4">
      <span className="inline-block w-6 h-px bg-white/14" />
      {children}
    </p>
  );
}

/* ──────────────────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/75 backdrop-blur-2xl border-b border-white/[0.05] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between gap-6">

          {/* Logo */}
          <a href="#hero" aria-label="Anderson Lima" className="flex items-center gap-3 group flex-shrink-0">
            <span className="relative w-12 h-12 rounded-full bg-white overflow-hidden flex-shrink-0 ring-1 ring-white/20 group-hover:ring-white/50 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Image src="/logo-anderson.png" alt="Anderson Lima" fill className="object-cover" sizes="48px" />
            </span>
            <span className="font-display text-[11px] tracking-[0.22em] uppercase text-white/70 group-hover:text-white transition-colors hidden sm:block">
              Anderson Lima
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href} href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: EASE_OUT }}
                className="relative font-body text-[10px] tracking-[0.2em] uppercase text-white/38 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="hidden md:flex items-center gap-3"
          >
            {/* YouTube — red accent */}
            <a
              href="https://youtube.com/@andersonlima2026cantor?si=isGLS2bBTczdFczA"
              target="_blank" rel="noopener noreferrer"
              aria-label="YouTube Anderson Lima"
              className="group relative inline-flex items-center gap-2 px-4 py-2 overflow-hidden transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg,#ff0000,#cc0000)" }} />
              <Youtube size={13} strokeWidth={1.5} className="relative z-10 text-red-400/80 group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10 font-body text-[9px] tracking-[0.18em] uppercase text-white/40 group-hover:text-white transition-colors duration-300">
                YouTube
              </span>
            </a>

            {/* Instagram — gradient accent */}
            <a
              href="https://www.instagram.com/andersonlima_oficial/"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram @andersonlima_oficial"
              className="group relative inline-flex items-center gap-2 px-4 py-2 overflow-hidden transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: IG_GRADIENT }} />
              <Instagram size={13} strokeWidth={1.5} className="relative z-10 text-pink-400/80 group-hover:text-white transition-colors duration-300" />
              <span className="relative z-10 font-body text-[9px] tracking-[0.18em] uppercase text-white/40 group-hover:text-white transition-colors duration-300">
                Instagram
              </span>
            </a>

            {/* WhatsApp — amber accent */}
            <a
              href="https://wa.me/5518997619075"
              target="_blank" rel="noopener noreferrer"
              aria-label="Solicitar orçamento via WhatsApp"
              className="group relative inline-flex items-center gap-2 px-5 py-2 overflow-hidden transition-all duration-400"
              style={{ background: `rgba(201,137,42,0.1)`, border: `1px solid ${AMBER_BORDER}` }}
            >
              <span aria-hidden
                className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12 pointer-events-none"
                style={{ background: `linear-gradient(90deg,transparent,rgba(201,137,42,0.18),transparent)` }}
              />
              <Phone size={12} strokeWidth={1.5} className="relative z-10 transition-colors duration-300" style={{ color: AMBER }} />
              <span className="relative z-10 font-body text-[9px] tracking-[0.18em] uppercase group-hover:brightness-125 transition-all duration-300" style={{ color: AMBER }}>
                Orçamento
              </span>
            </a>
          </motion.div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white/55 hover:text-white transition-colors ml-auto" onClick={() => setOpen(v => !v)} aria-label="Menu">
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-8 px-6 bg-black/88 backdrop-blur-2xl border-b border-white/[0.05] md:hidden flex flex-col gap-5"
          >
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="font-display italic text-2xl text-white/65 hover:text-white transition-colors border-b border-white/[0.05] pb-4">
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a href="https://www.instagram.com/andersonlima_oficial/" target="_blank" rel="noopener noreferrer"
                className="group relative flex items-center gap-2 px-4 py-2.5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: IG_GRADIENT }} />
                <Instagram size={14} strokeWidth={1.5} className="relative z-10 text-pink-400/70 group-hover:text-white transition-colors" />
                <span className="relative z-10 font-body text-[9px] tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">Instagram</span>
              </a>
              <a href="https://youtube.com/@andersonlima2026cantor?si=isGLS2bBTczdFczA" target="_blank" rel="noopener noreferrer"
                className="group relative flex items-center gap-2 px-4 py-2.5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg,#ff0000,#cc0000)" }} />
                <Youtube size={14} strokeWidth={1.5} className="relative z-10 text-red-400/70 group-hover:text-white transition-colors" />
                <span className="relative z-10 font-body text-[9px] tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">YouTube</span>
              </a>
              <a href="https://wa.me/5518997619075" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5"
                style={{ background: `rgba(201,137,42,0.1)`, border: `1px solid ${AMBER_BORDER}` }}>
                <Phone size={13} strokeWidth={1.5} style={{ color: AMBER }} />
                <span className="font-body text-[9px] tracking-widest uppercase" style={{ color: AMBER }}>Orçamento</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────────────── */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  useParticles("hero-particles");

  return (
    <section id="hero" ref={ref} className="relative min-h-screen w-full overflow-hidden flex flex-col" aria-label="Hero">

      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg,#0a0704 0%,#080808 45%,#0d0a06 100%)" }} />
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 55% 80% at 82% 38%,rgba(180,110,40,.14) 0%,transparent 65%),radial-gradient(ellipse 40% 60% at 64% 62%,rgba(120,70,20,.09) 0%,transparent 55%)" }} />
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 50% 100% at 0% 50%,rgba(0,0,0,.62) 0%,transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%,transparent 38%,rgba(0,0,0,.74) 100%)" }} />
      <canvas id="hero-particles" aria-hidden className="absolute inset-0 z-0 pointer-events-none opacity-40 w-full h-full" style={{ mixBlendMode: "screen" }} />
      <div aria-hidden className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden lg:block" />

      {/* Content grid */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 pt-36 pb-0 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-0 items-stretch">

        {/* LEFT */}
        <div className="flex flex-col justify-end pb-16">

          <motion.div custom={0.2} initial="hidden" animate="visible" variants={fadeUp}>
            <Eyebrow>Artista Sertanejo</Eyebrow>
          </motion.div>

          {/*
            EDITORIAL TITLE PATTERN:
            Line 1 — first name in Playfair italic, small, muted (signature feel)
            Line 2 — surname ALL-CAPS, massive, full white (brand mark)
            This contrast is the technique used by luxury fashion brands.
          */}
          <div style={{ perspective: "900px" }}>
            <motion.h1
              variants={titleContainer} initial="hidden" animate="visible"
              className="font-display leading-[0.86]" aria-label="Anderson Lima"
            >
              <div className="overflow-hidden block">
                <motion.span variants={titleWord} className="block" style={{ transformStyle: "preserve-3d" }}>
                  <span className="text-[clamp(2.6rem,7.5vw,7.5rem)] font-hand font-semibold italic uppercase text-white/55 tracking-[0.05em]">
                    Anderson
                  </span>
                </motion.span>
              </div>
              <div className="overflow-hidden block">
                <motion.span variants={titleWord} className="block" style={{ transformStyle: "preserve-3d" }}>
                  <span className="text-[clamp(5rem,17.5vw,17rem)] font-display font-black text-white tracking-[-0.025em]">
                    LIMA
                  </span>
                </motion.span>
              </div>
            </motion.h1>
          </div>

          {/* Divider */}
          <motion.hr custom={1.05} initial="hidden" animate="visible" variants={fadeUp}
            className="border-none h-px my-7 w-3/5"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.11),transparent)" }}
          />

          {/* Bio paragraphs */}
          <motion.div custom={1.25} initial="hidden" animate="visible" variants={fadeUp} className="space-y-3 max-w-md">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i} className="font-body font-light text-[12.5px] text-white/37 leading-relaxed">{p}</p>
            ))}
          </motion.div>

          {/* Social CTAs — WA + IG + YT */}
          <motion.div custom={1.5} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 mt-9 w-full max-w-lg"
          >
            {/* WhatsApp */}
            <a
              href="https://wa.me/5518997619075" target="_blank" rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-5 py-4 overflow-hidden transition-all duration-400 flex-1"
              style={{ background: `rgba(201,137,42,0.08)`, border: `1px solid ${AMBER_BORDER}` }}
            >
              <span aria-hidden className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 skew-x-12 pointer-events-none"
                style={{ background: `linear-gradient(90deg,transparent,rgba(201,137,42,0.14),transparent)` }} />
              <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ boxShadow: `inset 0 0 32px ${AMBER_GLOW}` }} />
              <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${AMBER_BORDER}`, background: "rgba(201,137,42,0.08)" }}>
                <Phone size={13} strokeWidth={1.5} style={{ color: AMBER }} />
              </span>
              <div className="relative z-10">
                <p className="font-body text-[8px] tracking-[0.22em] uppercase text-white/28 group-hover:text-white/48 transition-colors">Solicite um Orçamento</p>
                <p className="font-hand italic text-xl font-semibold group-hover:brightness-125 transition-all" style={{ color: AMBER }}>WhatsApp</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/andersonlima_oficial/" target="_blank" rel="noopener noreferrer"
              className="group relative flex items-center gap-3 border border-white/[0.06] hover:border-white/18 px-5 py-4 overflow-hidden transition-all duration-300 flex-1"
              style={{ background: "rgba(255,255,255,0.018)" }}
            >
              <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-400 pointer-events-none" style={{ background: IG_GRADIENT }} />
              <span className="relative z-10 w-8 h-8 rounded-full border border-white/10 group-hover:border-transparent flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300">
                <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: IG_GRADIENT }} />
                <Instagram size={13} strokeWidth={1.5} className="relative z-10 text-pink-400/70 group-hover:text-white transition-colors duration-300" />
              </span>
              <div className="relative z-10">
                <p className="font-body text-[8px] tracking-[0.22em] uppercase text-white/28 group-hover:text-white/48 transition-colors">Acompanhe</p>
                <p className="font-hand italic text-xl font-semibold text-white/62 group-hover:text-white transition-colors">@andersonlima</p>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@andersonlima2026cantor?si=isGLS2bBTczdFczA" target="_blank" rel="noopener noreferrer"
              className="group relative flex items-center gap-3 border border-white/[0.06] hover:border-red-500/30 px-5 py-4 overflow-hidden transition-all duration-300 flex-1"
              style={{ background: "rgba(255,255,255,0.018)" }}
            >
              <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-400 pointer-events-none" style={{ background: "linear-gradient(135deg,#ff0000,#cc0000)" }} />
              <span className="relative z-10 w-8 h-8 rounded-full border border-white/10 group-hover:border-transparent flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300">
                <span aria-hidden className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg,#ff0000,#cc0000)" }} />
                <Youtube size={13} strokeWidth={1.5} className="relative z-10 text-red-400/70 group-hover:text-white transition-colors duration-300" />
              </span>
              <div className="relative z-10">
                <p className="font-body text-[8px] tracking-[0.22em] uppercase text-white/28 group-hover:text-white/48 transition-colors">Assista</p>
                <p className="font-hand italic text-xl font-semibold text-white/62 group-hover:text-white transition-colors">YouTube</p>
              </div>
            </a>
          </motion.div>
        </div>

        {/* RIGHT — Artist image: full-bleed, seamless blend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.1, ease: EASE_OUT }}
          className="relative flex-shrink-0 self-stretch flex items-end lg:items-stretch"
          style={{ y: imageY }}
        >
          <div
            className="relative w-full h-full"
            style={{ width: "clamp(280px,38vw,520px)", minHeight: "clamp(420px,70vh,800px)" }}
          >
            <Image
              src="/artista.png"
              alt="Anderson Lima"
              fill
              className="object-cover object-top"
              style={{ zIndex: 1 }}
              sizes="(max-width:768px) 80vw, (max-width:1280px) 38vw, 520px"
              priority
            />

            {/* LEFT — strong dissolve into bg */}
            <div aria-hidden className="absolute inset-y-0 left-0 z-[2]" style={{ width: "45%", background: "linear-gradient(to right,#080808 0%,rgba(8,8,4,0.7) 40%,transparent 100%)" }} />
            {/* RIGHT — dissolve right edge */}
            <div aria-hidden className="absolute inset-y-0 right-0 z-[2]" style={{ width: "20%", background: "linear-gradient(to left,#080808 0%,transparent 100%)" }} />
            {/* BOTTOM — fade into page */}
            <div aria-hidden className="absolute bottom-0 inset-x-0 z-[2]" style={{ height: "32%", background: "linear-gradient(to top,#080808 0%,rgba(8,8,4,0.5) 55%,transparent 100%)" }} />
            {/* TOP — fade into nav */}
            <div aria-hidden className="absolute top-0 inset-x-0 z-[2]" style={{ height: "18%", background: "linear-gradient(to bottom,#080808 0%,transparent 100%)" }} />

            {/* Warm glow overlay to match hero bg light */}
            <div aria-hidden className="absolute inset-0 z-[3] pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 75% 20%,rgba(180,100,20,.08) 0%,transparent 70%)" }} />
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 pb-7 flex items-center"
      >
        <div className="flex items-center gap-2.5 text-white/18">
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-xs">↓</motion.span>
          <span className="font-body text-[9px] tracking-[0.26em] uppercase">Scroll</span>
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   SERVICES
────────────────────────────────────────────────────────── */

function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-36 overflow-hidden bg-[#080808]" aria-label="Serviços">
      <div aria-hidden className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent)" }} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT }} viewport={{ once: true, margin: "-80px" }}
          className="mb-16 sm:mb-20"
        >
          <Eyebrow>O que ofereço</Eyebrow>
          {/* Editorial heading: italic qualifier + uppercase noun */}
          <h2 className="font-display leading-[0.88]" aria-label="Serviços">
            <span className="block text-[clamp(1.4rem,3.5vw,3.2rem)] font-hand italic font-semibold text-white/32">
              O que faço
            </span>
            <span className="block text-[clamp(3.5rem,9vw,9rem)] font-black text-white tracking-[-0.025em]">
              SERVIÇOS
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title} custom={i} initial="hidden" whileInView="visible"
              variants={cardVariant} viewport={{ once: true, margin: "-60px" }}
              className="group relative flex flex-col gap-5 p-7 overflow-hidden transition-all duration-400"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span aria-hidden className="absolute top-0 right-0 w-10 h-px bg-gradient-to-l from-white/16 to-transparent group-hover:from-white/35 transition-all duration-400" />
              <span aria-hidden className="absolute top-0 right-0 h-10 w-px bg-gradient-to-b from-white/16 to-transparent group-hover:from-white/35 transition-all duration-400" />

              <span className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-white/22"
                style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                <s.icon size={15} strokeWidth={1.3} className="text-white/40 group-hover:text-white transition-colors duration-300" />
              </span>

              <div>
                <h3 className="font-body text-[13px] font-medium tracking-wide text-white/75 group-hover:text-white transition-colors mb-2.5">{s.title}</h3>
                <p className="font-body font-light text-[11.5px] text-white/33 leading-relaxed">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }} viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p className="font-display leading-tight">
              <span className="block text-[clamp(1.1rem,2.5vw,1.8rem)] font-hand italic font-semibold text-white/30">Pronto para</span>
              <span className="block text-2xl sm:text-3xl font-black text-white tracking-tight">CONTRATAR?</span>
            </p>
            <p className="font-body font-light text-sm text-white/32 mt-1.5">Entre em contato e monte o show perfeito para o seu evento.</p>
          </div>

          {/* High-conversion amber CTA */}
          <a
            href="https://wa.me/5518997619075" target="_blank" rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden transition-all duration-300 flex-shrink-0 hover:shadow-[0_0_40px_rgba(201,137,42,0.3)]"
            style={{ background: AMBER, color: "#0a0704" }}
          >
            {/* Dark fill on hover */}
            <span aria-hidden className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400" style={{ background: "#0a0704" }} />
            <Phone size={13} strokeWidth={1.8} className="relative z-10 group-hover:text-white transition-colors duration-400" />
            <span className="relative z-10 font-body font-medium text-[10.5px] tracking-[0.18em] uppercase group-hover:text-white transition-colors duration-400">
              Solicitar Orçamento
            </span>
          </a>
        </motion.div>
      </div>

      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)" }} />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer id="contact" className="relative bg-[#060504]" aria-label="Rodapé" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative w-8 h-8 rounded-full bg-white overflow-hidden flex-shrink-0 ring-1 ring-white/14">
              <Image src="/logo-anderson.png" alt="Anderson Lima" fill className="object-contain p-0.5" sizes="32px" />
            </span>
            <span className="font-display text-[10.5px] tracking-[0.2em] uppercase text-white/58">Anderson Lima</span>
          </div>
          <p className="font-body font-light text-[11.5px] text-white/26 leading-relaxed max-w-[220px]">
            Do coração do sertão para o seu evento — viola, emoção e tradição.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-body text-[8px] tracking-[0.32em] uppercase text-white/20 mb-1">Navegação</p>
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="font-body text-xs text-white/32 hover:text-white transition-colors w-fit">{link.label}</a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-body text-[8px] tracking-[0.32em] uppercase text-white/20 mb-1">Contato</p>
          <a href="https://wa.me/5518997619075" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-xs text-white/32 hover:text-white transition-colors">
            <Phone size={12} strokeWidth={1.5} style={{ color: AMBER }} />
            (18) 99761-9075
          </a>
          <a href="https://www.instagram.com/andersonlima_oficial/" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-xs text-white/32 hover:text-white transition-colors">
            <Instagram size={12} strokeWidth={1.5} className="text-pink-400/70" />
            @andersonlima_oficial
          </a>
          <a href="https://youtube.com/@andersonlima2026cantor?si=isGLS2bBTczdFczA" target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-xs text-white/32 hover:text-white transition-colors">
            <Youtube size={12} strokeWidth={1.5} className="text-red-400/70" />
            @andersonlima2026cantor
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="font-body text-[10px] text-white/14">© {new Date().getFullYear()} Anderson Lima. Todos os direitos reservados.</p>
        <p className="font-body text-[10px] text-white/10">Assis — São Paulo, Brasil</p>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   ROOT
────────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Footer />
    </>
  );
}
