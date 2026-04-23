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
import { Instagram, MessageCircle, Menu, X, Music2, Mic2, Star, MapPin } from "lucide-react";

/* ──────────────────────────────────────────────────────────
   CONSTANTS
────────────────────────────────────────────────────────── */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#bio" },
  { label: "Serviços", href: "#services" },
  { label: "Contato", href: "#contact" },
] as const;

const BIO_PARAGRAPHS = [
  "Anderson Lima descobriu sua paixão pela música aos 14 anos, cruzando o caminho do Professor Gilmar, mentor que enxergou seu brilho inato. Sob sua orientação, mergulhou no violão, iniciando uma carreira meteórica.",
  "Com um talento que cativa plateias, brilhou em palcos icônicos como a FICAR Assis e o Rodeio de Tarumã, hipnotizando multidões com melodias que tocam a alma.",
  "Hoje, Anderson Lima é sinônimo de superação e genialidade — um artista que transforma sonhos em realidade com o violão em mãos.",
] as const;

const SERVICES = [
  {
    icon: Mic2,
    title: "Shows & Eventos",
    description:
      "Apresentações ao vivo para festas particulares, casamentos, formaturas e eventos corporativos. Experiência em palcos de grande porte.",
  },
  {
    icon: Star,
    title: "Rodeios & Festas",
    description:
      "Presença marcante em rodeios, festas juninas e eventos rurais. Repertório sertanejo raiz e universitário.",
  },
  {
    icon: MapPin,
    title: "Região & Interior",
    description:
      "Atendimento em toda a região de Assis e interior de São Paulo. Estrutura própria, sem complicações.",
  },
  {
    icon: Music2,
    title: "Repertório Exclusivo",
    description:
      "Músicas autorais e os maiores hits do sertanejo, adaptados ao estilo e pedido do seu evento.",
  },
] as const;

/* ──────────────────────────────────────────────────────────
   ANIMATION VARIANTS — TypeScript-safe with `as const`
────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { y: 32, opacity: 0 },
  visible: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.85, delay, ease: EASE_OUT },
  }),
};

const titleContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.35 },
  },
};

const titleWord: Variants = {
  hidden: { y: 110, rotateX: 40, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    rotateX: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_OUT },
  },
};

const cardVariant: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.25,
      vx: (Math.random() - 0.5) * 0.17,
      vy: -Math.random() * 0.2 - 0.04,
      a: Math.random() * 0.32 + 0.04,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,155,70,${p.a})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasId]);
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
            ? "bg-black/70 backdrop-blur-xl border-b border-white/[0.06] py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between">

          {/* Logo */}
          <a href="#hero" aria-label="Anderson Lima — Início" className="flex items-center gap-2.5 group">
            <span className="relative w-9 h-9 rounded-full border border-white/20 overflow-hidden flex items-center justify-center group-hover:border-white/50 transition-all duration-300 group-hover:shadow-[0_0_14px_rgba(255,255,255,0.15)]">
              <Image
                src="/logo-anderson.png"
                alt="Anderson Lima"
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            <span className="font-display text-[11px] tracking-[0.22em] uppercase text-white/75 group-hover:text-white transition-colors hidden sm:block">
              Anderson Lima
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Navegação principal">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: EASE_OUT }}
                className="relative font-body text-[10px] tracking-[0.2em] uppercase text-white/45 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Desktop actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="hidden md:flex items-center gap-4"
          >
            <a
              href="https://www.instagram.com/andersonlima_oficial/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/35 hover:text-white transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <span className="w-px h-4 bg-white/10" />
            <a
              href="https://wa.me/5518997619075"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="group relative inline-flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 px-4 py-2.5 overflow-hidden transition-all duration-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.07)]"
            >
              <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
              <MessageCircle size={12} strokeWidth={1.5} className="text-white/55 group-hover:text-white transition-colors" />
              <span className="font-body text-[9px] tracking-[0.18em] uppercase text-white/55 group-hover:text-white transition-colors">
                Orçamento
              </span>
            </a>
          </motion.div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mob"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-8 px-6 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] md:hidden flex flex-col gap-5"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display italic text-2xl text-white/75 hover:text-white transition-colors border-b border-white/[0.06] pb-4"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/andersonlima_oficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-all hover:scale-110 hover:drop-shadow-[0_0_7px_rgba(255,255,255,0.5)]"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://wa.me/5518997619075"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-2.5"
              >
                <MessageCircle size={13} strokeWidth={1.5} className="text-white/55" />
                <span className="font-body text-[10px] tracking-widest uppercase text-white/55">WhatsApp</span>
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

      {/* ── Background layers ── */}
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg,#0a0704 0%,#080808 45%,#0d0a06 100%)" }} />
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 55% 80% at 82% 38%,rgba(180,110,40,.14) 0%,transparent 65%),radial-gradient(ellipse 40% 60% at 64% 62%,rgba(120,70,20,.09) 0%,transparent 55%)" }} />
      <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 50% 100% at 0% 50%,rgba(0,0,0,.62) 0%,transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%,transparent 38%,rgba(0,0,0,.74) 100%)" }} />
      <canvas id="hero-particles" aria-hidden className="absolute inset-0 z-0 pointer-events-none opacity-40 w-full h-full" style={{ mixBlendMode: "screen" }} />

      {/* Left vertical rule */}
      <div aria-hidden className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent hidden lg:block" />

      {/* ── Content grid ── */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 pt-36 pb-16 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end">

        {/* LEFT */}
        <div className="flex flex-col justify-end">
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="font-body text-[9.5px] tracking-[0.36em] uppercase text-white/35 mb-7 flex items-center gap-3"
          >
            <span className="inline-block w-7 h-px bg-white/18" />
            Artista Sertanejo
          </motion.p>

          {/* 3D Title */}
          <div style={{ perspective: "900px" }}>
            <motion.h1
              variants={titleContainer} initial="hidden" animate="visible"
              className="font-display font-black leading-[0.86] tracking-tight"
              aria-label="Anderson Lima"
            >
              {(["Anderson", "Lima"] as const).map((word) => (
                <div key={word} className="overflow-hidden block">
                  <motion.span variants={titleWord} className="block" style={{ transformStyle: "preserve-3d" }}>
                    <span className={word === "Anderson"
                      ? "text-[clamp(3rem,8.5vw,8.5rem)] text-white/88"
                      : "text-[clamp(4.5rem,17vw,16rem)] text-white"
                    }>
                      {word}
                    </span>
                    {word === "Anderson" && (
                      <span className="text-[clamp(3rem,8.5vw,8.5rem)] font-display italic text-white/20 ml-3"> —</span>
                    )}
                  </motion.span>
                </div>
              ))}
            </motion.h1>
          </div>

          {/* Divider */}
          <motion.hr custom={1.05} initial="hidden" animate="visible" variants={fadeUp}
            className="border-none h-px my-7 w-3/5"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent)" }}
          />

          {/* Bio */}
          <motion.div custom={1.25} initial="hidden" animate="visible" variants={fadeUp} className="space-y-3 max-w-md">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i} className="font-body font-light text-[12.5px] text-white/40 leading-relaxed tracking-wide">{p}</p>
            ))}
          </motion.div>

          {/* Social CTAs */}
          <motion.div custom={1.5} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 mt-9 w-full max-w-md"
          >
            {/* WhatsApp — primary */}
            <a
              href="https://wa.me/5518997619075"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 bg-black/65 backdrop-blur-md border border-white/10 hover:border-white/32 px-5 py-4 overflow-hidden transition-all duration-400 hover:shadow-[0_0_28px_rgba(255,255,255,0.06)] flex-1"
            >
              <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
              <span className="w-8 h-8 rounded-full border border-white/14 group-hover:border-white/38 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] flex-shrink-0">
                <MessageCircle size={14} strokeWidth={1.5} className="text-white/55 group-hover:text-white transition-colors" />
              </span>
              <div>
                <p className="font-body text-[8.5px] tracking-[0.22em] uppercase text-white/30 group-hover:text-white/52 transition-colors">Solicite um Orçamento</p>
                <p className="font-display italic text-white/78 group-hover:text-white text-[13px] transition-colors">WhatsApp</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/andersonlima_oficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 border border-white/9 hover:border-white/28 hover:bg-white/[0.025] px-5 py-4 transition-all duration-300 flex-1"
            >
              <span className="w-8 h-8 rounded-full border border-white/12 group-hover:border-white/34 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.09)] flex-shrink-0">
                <Instagram size={14} strokeWidth={1.5} className="text-white/48 group-hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]" />
              </span>
              <div>
                <p className="font-body text-[8.5px] tracking-[0.22em] uppercase text-white/30 group-hover:text-white/52 transition-colors">Acompanhe</p>
                <p className="font-display italic text-white/68 group-hover:text-white text-[13px] transition-colors">@andersonlima_oficial</p>
              </div>
            </a>
          </motion.div>
        </div>

        {/* RIGHT — Artist image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.15, ease: EASE_OUT }}
          className="relative flex-shrink-0 self-end hidden lg:block"
          style={{ y: imageY }}
        >
          <div aria-hidden className="absolute -top-3 -right-3 w-full h-full border border-white/7 pointer-events-none" />

          <div className="relative overflow-hidden" style={{ width: "clamp(220px,26vw,420px)", height: "clamp(320px,50vh,660px)" }}>
            {/* Warm glow behind */}
            <div aria-hidden className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 62% at 50% 30%,rgba(190,120,45,.2) 0%,transparent 68%)" }} />
            {/* Ground shadow */}
            <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2]" style={{ width: "80%", height: "56px", background: "radial-gradient(ellipse 100% 100% at 50% 100%,rgba(0,0,0,.75) 0%,transparent 100%)", filter: "blur(11px)" }} />

            <Image
              src="/artista.png"
              alt="Anderson Lima"
              fill
              className="object-cover object-top"
              style={{ zIndex: 1 }}
              sizes="(max-width:1280px) 26vw, 420px"
              priority
            />

            {/* Bottom fade */}
            <div aria-hidden className="absolute bottom-0 inset-x-0 z-[3]" style={{ height: "40%", background: "linear-gradient(to top,#080808 0%,rgba(8,8,4,.55) 58%,transparent 100%)" }} />

            {/* Glass badge */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.7, ease: EASE_OUT }}
              className="absolute bottom-5 left-3 right-3 z-[4] bg-black/68 backdrop-blur-md border border-white/[0.07] px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="font-body text-[8px] tracking-[0.22em] uppercase text-white/32 mb-0.5">Novo Single</p>
                <p className="font-display italic text-white text-sm">"Poeira do Sertão"</p>
              </div>
              <button aria-label="Reproduzir" className="w-9 h-9 rounded-full border border-white/18 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group">
                <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" className="ml-0.5"><polygon points="2,1 9,5 2,9" /></svg>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-8 pb-7 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 text-white/22">
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="text-xs">↓</motion.span>
          <span className="font-body text-[9px] tracking-[0.26em] uppercase">Scroll</span>
        </div>
        <div className="flex items-center gap-5">
          {[{ num: "12+", label: "Shows em 2025" }, { num: "3M", label: "Streams" }].map(({ num, label }) => (
            <div key={label} className="text-right">
              <p className="font-display text-xl text-white/72">{num}</p>
              <p className="font-body text-[8px] tracking-[0.2em] uppercase text-white/25">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   SERVICES
────────────────────────────────────────────────────────── */

function Services() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section id="services" ref={ref} className="relative py-28 sm:py-36 overflow-hidden bg-[#080808]" aria-label="Serviços">
      {/* Subtle top edge */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)" }} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: EASE_OUT }} viewport={{ once: true, margin: "-80px" }}
          className="mb-16 sm:mb-20"
        >
          <p className="font-body text-[9.5px] tracking-[0.36em] uppercase text-white/30 flex items-center gap-3 mb-5">
            <span className="inline-block w-7 h-px bg-white/16" />
            O que ofereço
          </p>
          <h2 className="font-display font-black text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.9] text-white">
            Serviços
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={cardVariant}
              viewport={{ once: true, margin: "-60px" }}
              className="group relative flex flex-col gap-5 bg-white/[0.025] border border-white/[0.07] hover:border-white/18 p-7 transition-all duration-400 hover:bg-white/[0.04] hover:shadow-[0_0_32px_rgba(255,255,255,0.04)] overflow-hidden"
            >
              {/* Corner accent */}
              <span aria-hidden className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-white/20 to-transparent group-hover:from-white/40 transition-all duration-400" />
              <span aria-hidden className="absolute top-0 right-0 h-12 w-px bg-gradient-to-b from-white/20 to-transparent group-hover:from-white/40 transition-all duration-400" />

              <span className="w-10 h-10 rounded-full border border-white/12 group-hover:border-white/28 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.09)]">
                <s.icon size={16} strokeWidth={1.4} className="text-white/55 group-hover:text-white/85 transition-colors" />
              </span>

              <div>
                <h3 className="font-display font-bold text-base text-white/85 group-hover:text-white transition-colors mb-2">{s.title}</h3>
                <p className="font-body font-light text-xs text-white/38 leading-relaxed">{s.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA — high conversion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }} viewport={{ once: true }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/[0.07] pt-10"
        >
          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white mb-1">Pronto para contratar?</p>
            <p className="font-body font-light text-sm text-white/40">Entre em contato e monte o show perfeito para o seu evento.</p>
          </div>
          <a
            href="https://wa.me/5518997619075"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-white text-black font-body font-medium text-[10.5px] tracking-[0.18em] uppercase px-8 py-4 overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(255,255,255,0.22)] flex-shrink-0"
          >
            {/* Ripple hover fill */}
            <span aria-hidden className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
            <MessageCircle size={13} className="relative z-10 group-hover:text-white transition-colors duration-400" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-400">Solicitar Orçamento</span>
          </a>
        </motion.div>
      </div>

      {/* Subtle bottom edge */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)" }} />
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer id="contact" className="relative bg-[#060504] border-t border-white/[0.06]" aria-label="Rodapé">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative w-8 h-8 rounded-full border border-white/18 overflow-hidden flex-shrink-0">
              <Image src="/logo-anderson.png" alt="Anderson Lima" fill className="object-cover" sizes="32px" />
            </span>
            <span className="font-display text-[11px] tracking-[0.2em] uppercase text-white/65">Anderson Lima</span>
          </div>
          <p className="font-body font-light text-[11.5px] text-white/32 leading-relaxed max-w-[220px]">
            Artista Sertanejo da região de Assis — SP. Música que toca a alma.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="font-body text-[8.5px] tracking-[0.3em] uppercase text-white/25 mb-1">Navegação</p>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}
              className="font-body text-xs text-white/40 hover:text-white transition-colors w-fit">
              {link.label}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="font-body text-[8.5px] tracking-[0.3em] uppercase text-white/25 mb-1">Contato</p>
          <a
            href="https://wa.me/5518997619075"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors"
          >
            <MessageCircle size={13} strokeWidth={1.5} className="text-white/25 group-hover:text-white transition-colors" />
            (18) 99761-9075
          </a>
          <a
            href="https://www.instagram.com/andersonlima_oficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-body text-xs text-white/40 hover:text-white transition-colors"
          >
            <Instagram size={13} strokeWidth={1.5} className="text-white/25 group-hover:text-white transition-colors" />
            @andersonlima_oficial
          </a>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/[0.05] py-5 mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-body text-[10px] text-white/18">
          © {new Date().getFullYear()} Anderson Lima. Todos os direitos reservados.
        </p>
        <p className="font-body text-[10px] text-white/14">
          Assis — São Paulo, Brasil
        </p>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGE ROOT
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
