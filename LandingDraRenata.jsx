import React, { useState } from "react";
import {
  MessageCircle, ArrowRight, ArrowUpRight, ShieldCheck, BadgeCheck, Award, Eye, ScanEye,
  Crosshair, ChevronDown, MapPin, Phone, Clock, Stethoscope, HeartHandshake, ClipboardCheck,
  CalendarDays, Menu, X, AtSign, MessageSquareHeart, Send, AlertTriangle,
} from "lucide-react";

/* ============================================================
   Dra. Renata Bertazzi · Oftalmologia | Catarata e Retina
   Landing page mobile-first · React + Tailwind + lucide-react
   ============================================================ */

const IMG = "https://drarenatabertazzi.com.br/img/";
const LOGO = IMG + "logo-dra-renata-bertazzi-web.png";
const HERO_PHOTO = IMG + "dra-renata-consultorio.webp";
const ABOUT_PHOTO = IMG + "dra-renata-bertazzi-oftalmologista-palmas.webp";

const GALLERY = [
  { src: IMG + "rotina-consulta-lampada-de-fenda.webp", alt: "Dra. Renata examinando uma paciente na lâmpada de fenda", step: "01", title: "Consulta sem pressa", text: "Exame completo na lâmpada de fenda, com tempo para ouvir e explicar." },
  { video: IMG + "rotina-preparo-sala.mp4", poster: IMG + "rotina-preparo-sala-capa.webp", alt: "Vídeo da Dra. Renata preparando o material da cirurgia", step: "02", title: "Sala preparada", text: "Instrumental, equipamento e medicações conferidos antes de cada paciente." },
  { src: IMG + "rotina-preparo-paciente-cirurgia.webp", alt: "Dra. Renata preparando o paciente para a cirurgia de catarata", step: "03", title: "Preparo do paciente", text: "Você é monitorado e acompanhado de perto do começo ao fim." },
  { src: IMG + "rotina-microscopio-cirurgico.webp", alt: "Dra. Renata operando ao microscópio cirúrgico", step: "04", title: "Precisão cirúrgica", text: "Cirurgia ao microscópio, com técnica moderna e segura." },
];
const WHATSAPP = "5511978806444";
const WA_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Olá! Vim pelo site da Dra. Renata Bertazzi e gostaria de agendar uma consulta."
)}`;
const INSTAGRAM = "https://www.instagram.com/dra.renatabertazzi/";

/* Recados e dúvidas: chegam ao portal /controle (Supabase). A chave publicável só permite ENVIAR. */
const SUPABASE_URL = "https://avbmtrvxieetoptmzere.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ohqe8a6rhGEwOImU302jjw_69V8kcJ7";

const BLUE = "#004AAD";

const TREATMENTS = [
  {
    id: "retina",
    icon: ScanEye,
    tag: "Retina e Vítreo",
    title: "Doenças da Retina e Vítreo",
    summary: "Diagnóstico e tratamento de retinopatia diabética, degeneração macular (DMRI) e descolamento de retina.",
    signs: [
      "Distorção de linhas retas ou mancha no centro da visão",
      "Clarões, muitas “moscas” novas ou sombra na visão",
      "Diabetes, mesmo enxergando bem",
      "Perda de visão súbita em um dos olhos",
    ],
    care: [
      "Injeções intravítreas (anti-VEGF) para DMRI e edema macular",
      "Vitrectomia para descolamento de retina, membranas e buraco macular",
      "Acompanhamento contínuo com a mesma médica",
    ],
    urgent: "Clarões, moscas novas ou sombra na visão pedem avaliação no mesmo dia.",
  },
  {
    id: "catarata",
    icon: Eye,
    tag: "Cirurgia",
    title: "Catarata",
    summary: "Cirurgia moderna por facoemulsificação, com implante de lente intraocular escolhida junto com você.",
    signs: [
      "Visão embaçada que os óculos não corrigem",
      "Cores apagadas ou amareladas",
      "Ofuscamento com faróis e luzes à noite",
      "Troca frequente do grau dos óculos",
    ],
    care: [
      "Anestesia com colírio, às vezes com sedação leve",
      "Procedimento de cerca de 15 a 30 minutos por olho",
      "Lentes monofocais, de foco estendido ou multifocais",
      "Alta no mesmo dia e retornos programados",
    ],
  },
  {
    id: "exames",
    icon: Crosshair,
    tag: "Diagnóstico e Laser",
    title: "Exames Diagnósticos e Laser",
    summary: "Exames que mapeiam cada detalhe do olho e tratamentos a laser feitos no próprio consultório.",
    signs: [
      "Avaliação antes da cirurgia de catarata",
      "Controle anual de quem tem diabetes",
      "Acompanhamento de doenças da retina",
    ],
    care: [
      "Tomografia de coerência óptica (OCT)",
      "Mapeamento de retina e biometria",
      "Fotocoagulação a laser da retina",
    ],
  },
];

const AGENDA = [
  ["Seg", "Oftalmologia Avançada", "Palmas"],
  ["Ter", "Oftalmologia Avançada", "Paraíso do Tocantins"],
  ["Qua", "ICOG (manhã) · OPUS (tarde)", "Palmas"],
  ["Qui", "ICOG", "Porto Nacional"],
  ["Sex", "OPUS (manhã) · Oftalmologia Avançada (tarde)", "Palmas"],
];

const CLINICS = [
  { name: "Oftalmologia Avançada", addr: "Quadra 104 Norte, Rua NE 5, nº 11", phone: "(63) 3215-3335", tel: "+556332153335", q: "Oftalmologia+Avançada+104+Norte+Palmas+TO" },
  { name: "ICOG · Instituto de Catarata e Oftalmologia", addr: "ACSU SO 50, Av. LO 13 (antiga 501 Sul), ao lado do Hospital Cristo Rei", phone: "(63) 3322-2061", tel: "+556333222061", q: "ICOG+Instituto+de+Catarata+e+Oftalmologia+Palmas+TO" },
  { name: "OPUS", addr: "Quadra 702 Sul, Av. Joaquim Teotônio Segurado, 15, Sala 02", phone: "(63) 3028-1483", tel: "+556330281483", q: "OPUS+702+Sul+Palmas+TO" },
];

/* ---------- primitives ---------- */
function Eyebrow({ children, light = false }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? "text-[#CFE0F3]" : "text-[#004AAD]"}`}>
      <span className={`h-px w-8 ${light ? "bg-[#CFE0F3]" : "bg-[#79A9D2]"}`} />
      {children}
    </p>
  );
}

function PrimaryCTA({ className = "", children = "Agendar Consulta via WhatsApp" }) {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex min-h-[56px] items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#004AAD] px-6 text-[16px] font-semibold text-white shadow-[0_16px_34px_-16px_rgba(0,74,173,0.6)] transition hover:bg-[#003C8F] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#79A9D2] ${className}`}
    >
      <MessageCircle className="h-5 w-5 text-[#CFE0F3]" strokeWidth={2} />
      {children}
      <ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-0.5 min-[400px]:block" />
    </a>
  );
}

/* ---------- header ---------- */
function Header() {
  const [open, setOpen] = useState(false);
  const links = [["#tratamentos", "Tratamentos"], ["#sobre", "A médica"], ["#fale", "Recados e dúvidas"], ["#atendimento", "Onde atendo"]];
  return (
    <header className="sticky top-0 z-40 border-b border-[#0E2A57]/10 bg-[#F6F9FD]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 lg:px-8">
        <a href="#inicio" className="flex items-center" aria-label="Dra. Renata Bertazzi, Oftalmologia, Retina e Catarata. Início">
          <img src={LOGO} alt="Dra. Renata Bertazzi · Oftalmologia | Retina e Catarata" className="h-[34px] w-auto sm:h-[40px]" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map(([h, t]) => (
            <a key={h} href={h} className="text-[15px] font-medium text-[#0E2A57]/75 transition hover:text-[#0E2A57]">{t}</a>
          ))}
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#004AAD] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#003C8F]">Agendar</a>
        </nav>
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-[#0E2A57]/15 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5 text-[#0E2A57]" /> : <Menu className="h-5 w-5 text-[#0E2A57]" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[#0E2A57]/10 bg-white px-5 pb-5 md:hidden" aria-label="Menu">
          {links.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-[#0E2A57]/10 py-4 text-[17px] font-medium text-[#0E2A57]">
              {t}<ArrowRight className="h-4 w-4 text-[#2F7FDC]" />
            </a>
          ))}
          <PrimaryCTA className="mt-5 w-full" />
        </nav>
      )}
    </header>
  );
}

/* ---------- hero ---------- */
function Hero() {
  return (
    <section id="inicio" className="relative overflow-clip bg-gradient-to-br from-[#FFFFFF] via-[#EEF5FD] to-[#E2F3EF]">
      <div className="pointer-events-none absolute -right-32 -top-24 h-[460px] w-[460px] rounded-full bg-[#79A9D2]/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-[40%] h-[420px] w-[420px] rounded-full bg-[#7CCBB8]/25 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
        {/* imagem */}
        <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[340px] lg:order-2 lg:max-w-[420px]">
          <div className="absolute -right-3 -top-3 bottom-10 left-10 rounded-2xl border border-[#79A9D2]" aria-hidden="true" />
          <figure className="relative overflow-clip rounded-2xl bg-[#E9EFF7] shadow-[0_30px_60px_-34px_rgba(0,74,173,0.45)]">
            <img
              src={HERO_PHOTO}
              alt="Dra. Renata Bertazzi, médica oftalmologista em Palmas, em seu consultório"
              className="aspect-[4/5] w-full object-cover object-[50%_15%] [filter:contrast(1.03)_saturate(0.94)]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#004AAD]/15 via-transparent to-transparent" />
          </figure>
          <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-[0_18px_40px_-20px_rgba(0,74,173,0.5)] ring-1 ring-[#79A9D2]/40 sm:-left-5">
            <span className="font-serif text-[32px] leading-none text-[#004AAD]">+500</span>
            <span className="border-l border-[#79A9D2] pl-3 text-[12.5px] font-medium leading-snug text-[#5F5F7C]">
              cirurgias<br />realizadas
            </span>
          </div>
        </div>

        {/* texto */}
        <div className="pt-4 lg:order-1 lg:pt-0">
          <Eyebrow>Oftalmologia · Palmas, TO</Eyebrow>
          <h1 className="mt-5 font-serif text-[40px] leading-[1.08] tracking-[-0.01em] text-[#0E2A57] sm:text-[54px] lg:text-[64px]">
            Cuidar da sua visão começa por ouvir você.
          </h1>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.65] text-[#33415C]">
            Retina e catarata tratadas com precisão cirúrgica e acolhimento. Da primeira consulta ao último retorno, você e sua família têm a mesma médica ao lado, com tempo para cada dúvida.
          </p>

          {/* credenciais */}
          <dl className="mt-8 grid grid-cols-3 divide-x divide-[#79A9D2]/45 rounded-2xl bg-white/85 py-4 shadow-[0_14px_34px_-24px_rgba(0,74,173,0.5)] ring-1 ring-[#79A9D2]/40 backdrop-blur">
            {[
              ["CRM-TO", "7132"],
              ["RQE", "3562"],
              ["SBRV", "Titular"],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col items-center justify-center px-2 text-center">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F7FDC]">{k}</dt>
                <dd className="mt-1 font-serif text-[24px] leading-none text-[#0E2A57]">{v}</dd>
              </div>
            ))}
          </dl>

          <div id="hero-cta" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA />
            <a
              href="#tratamentos"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#0E2A57]/25 bg-white px-7 text-[16px] font-semibold text-[#0E2A57] transition hover:border-[#0E2A57]"
            >
              Conhecer Tratamentos
            </a>
          </div>
          <a href="#fale" className="mt-5 inline-flex items-center gap-2 text-[16px] font-semibold text-[#004AAD] underline decoration-[#79A9D2] decoration-2 underline-offset-[6px] transition hover:decoration-[#004AAD]">
            <MessageSquareHeart className="h-5 w-5" strokeWidth={1.8} />
            Envie sua dúvida ou recado
          </a>
          <p className="mt-4 text-[14px] text-[#33415C]/80">Atendimento em Palmas, Paraíso do Tocantins e Porto Nacional.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- tratamentos ---------- */
function TreatmentCard({ t, open, onToggle }) {
  const Icon = t.icon;
  return (
    <article className={`flex flex-col rounded-2xl border bg-white transition ${open ? "border-[#0E2A57]/30 shadow-[0_30px_60px_-36px_rgba(11,30,54,0.5)]" : "border-[#0E2A57]/10 hover:border-[#0E2A57]/25"}`}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full flex-col gap-5 p-6 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#79A9D2] sm:p-7">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#EAF2FB] text-[#004AAD]">
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
          </span>
          <span className={`grid h-9 w-9 place-items-center rounded-full border border-[#0E2A57]/15 transition ${open ? "rotate-180 bg-[#004AAD] text-white border-[#004AAD]" : "text-[#004AAD]"}`}>
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#004AAD]">{t.tag}</p>
          <h3 className="mt-2 font-serif text-[27px] leading-tight text-[#0E2A57]">{t.title}</h3>
          <p className="mt-3 text-[16.5px] leading-relaxed text-[#33415C]">{t.summary}</p>
        </div>
        {!open && (
          <span className="text-[14px] font-semibold text-[#0E2A57] underline decoration-[#79A9D2] decoration-2 underline-offset-4">Ver sinais e tratamento</span>
        )}
      </button>
      {open && (
        <div className="grid gap-6 border-t border-[#0E2A57]/10 px-6 pb-7 pt-6 sm:px-7">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0E2A57]">Sinais de alerta</p>
            <ul className="mt-3 grid gap-2.5">
              {t.signs.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] leading-snug text-[#33415C]">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-[#2F7FDC]" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0E2A57]">Como tratamos</p>
            <ul className="mt-3 grid gap-2.5">
              {t.care.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] leading-snug text-[#33415C]">
                  <BadgeCheck className="mt-0.5 h-[18px] w-[18px] flex-none text-[#004AAD]" strokeWidth={1.8} />{s}
                </li>
              ))}
            </ul>
          </div>
          {t.urgent && (
            <p className="rounded-xl border-l-4 border-[#9B3D2E] bg-[#FBF1EE] px-4 py-3 text-[15px] font-semibold leading-snug text-[#6E2A1F]">{t.urgent}</p>
          )}
        </div>
      )}
    </article>
  );
}

function Treatments() {
  const [open, setOpen] = useState("retina");
  return (
    <section id="tratamentos" className="bg-gradient-to-b from-[#E6F2F2] via-[#F8FBFE] to-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Áreas de tratamento</Eyebrow>
          <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0E2A57] sm:text-[44px]">Do diagnóstico à cirurgia, com a mesma atenção.</h2>
          <p className="mt-4 text-[18px] leading-relaxed text-[#33415C]">Toque em cada área para ver os sinais que pedem avaliação e como é o tratamento.</p>
        </div>
        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {TREATMENTS.map((t) => (
            <TreatmentCard key={t.id} t={t} open={open === t.id} onToggle={() => setOpen(open === t.id ? null : t.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- rotina (galeria) ---------- */
function Routine() {
  return (
    <section id="rotina" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Por dentro da rotina</Eyebrow>
            <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0E2A57] sm:text-[44px]">Cada etapa conferida, para você operar tranquilo.</h2>
          </div>
          <p className="max-w-sm text-[16px] leading-relaxed text-[#33415C] lg:text-right">Do consultório ao centro cirúrgico, a mesma médica cuida de cada detalhe.</p>
        </div>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-4 lg:overflow-visible lg:px-8">
        {GALLERY.map((g) => (
          <figure key={g.step} className="w-[78%] flex-none snap-start sm:w-[44%] lg:w-auto">
            <div className="relative overflow-clip rounded-2xl bg-[#E9EFF7] shadow-[0_30px_60px_-40px_rgba(11,30,54,0.6)]">
              {g.video ? (
                <video src={g.video} poster={g.poster} autoPlay muted loop playsInline preload="metadata" aria-label={g.alt} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[3/4] w-full object-cover [filter:saturate(0.9)_contrast(1.03)]" />
              )}
              <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 font-serif text-[15px] text-[#0E2A57]">{g.step}</span>
            </div>
            <figcaption className="mt-4 border-l-2 border-[#79A9D2] pl-4">
              <span className="block text-[17px] font-semibold text-[#0E2A57]">{g.title}</span>
              <span className="mt-1 block text-[15.5px] leading-relaxed text-[#33415C]">{g.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- sobre ---------- */
function About() {
  const pillars = [
    [ClipboardCheck, "Cirurgia segura", "Avaliação completa antes de operar e checklist de cirurgia segura recomendado pela OMS."],
    [HeartHandshake, "Atendimento humanizado", "Consulta sem pressa, explicações claras e espaço para as dúvidas da família."],
    [Stethoscope, "Acompanhamento próximo", "A mesma médica do primeiro exame ao último retorno do pós-operatório."],
  ];
  return (
    <section id="sobre" className="relative overflow-clip bg-gradient-to-br from-[#E6F0FB] via-[#F1F7FB] to-[#DDF1EC] py-20 lg:py-28">
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#7CCBB8]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border border-[#79A9D2]/40" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[480px] w-[480px] rounded-full border border-[#79A9D2]/25" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="lg:hidden">
            <Eyebrow>Sobre a médica</Eyebrow>
            <h2 className="mt-5 font-serif text-[34px] leading-[1.12] text-[#0E2A57] sm:text-[42px]">Experiência no centro cirúrgico. Escuta no consultório.</h2>
          </div>
          <figure className="mx-auto mt-10 max-w-[340px] lg:mt-0 lg:max-w-none">
            <div className="relative">
              <div className="absolute -bottom-3 -left-3 right-10 top-10 rounded-2xl border border-[#79A9D2]" aria-hidden="true" />
              <img src={ABOUT_PHOTO} alt="Retrato da Dra. Renata Bertazzi" loading="lazy" className="relative aspect-[4/5] w-full rounded-2xl object-cover object-[50%_20%] shadow-[0_30px_60px_-36px_rgba(0,74,173,0.45)]" />
            </div>
            <figcaption className="mt-6 text-[14px] text-[#5F5F7C]">Dra. Renata Carneiro Bertazzi · CRM-TO 7132</figcaption>
          </figure>
        </div>
        <div>
          <div className="hidden lg:block">
            <Eyebrow>Sobre a médica</Eyebrow>
            <h2 className="mt-5 font-serif text-[42px] leading-[1.12] text-[#0E2A57]">Experiência no centro cirúrgico. Escuta no consultório.</h2>
          </div>
          <div className="mt-6 grid gap-4 text-[18px] leading-[1.7] text-[#33415C]">
            <p>A Dra. Renata Carneiro Bertazzi é médica oftalmologista com atuação dedicada às doenças da retina e à catarata. Formou-se em Medicina pela PUC Goiás e fez residência em Oftalmologia e fellowship no IPEPO, em São Paulo.</p>
            <p>Trabalhou seis anos no SUS em São Paulo, cuidando de pacientes de todas as idades e realidades. Desde 2024 atende em Palmas e na região, onde já soma mais de 500 cirurgias.</p>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-[#79A9D2]/50">
            <Award className="h-5 w-5 text-[#004AAD]" strokeWidth={1.7} />
            <span className="text-[15px] font-medium text-[#0E2A57]">Membro titular da Sociedade Brasileira de Retina e Vítreo</span>
          </div>
          <ul className="mt-10 grid content-start gap-4">
            {pillars.map(([Icon, title, text]) => (
              <li key={title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-[0_16px_40px_-30px_rgba(0,74,173,0.5)]">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#EAF2FB]">
                  <Icon className="h-5 w-5 text-[#004AAD]" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#0E2A57]">{title}</h3>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-[#33415C]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- recados e dúvidas ---------- */
function Field({ label, hint, children }) {
  return (
    <label className="grid gap-1.5 text-[15px] font-semibold text-[#0E2A57]">
      <span>{label}{hint && <span className="ml-1 font-normal text-[#5F5F7C]">{hint}</span>}</span>
      {children}
    </label>
  );
}
const inputCls = "min-h-[52px] w-full rounded-xl border border-[#79A9D2]/60 bg-[#F6F9FD] px-4 text-[17px] font-normal text-[#0E2A57] outline-none transition focus:border-[#004AAD] focus:bg-white focus:ring-4 focus:ring-[#79A9D2]/30";

function Messages() {
  const [tipo, setTipo] = useState("duvida");
  const [f, setF] = useState({ nome: "", cidade: "", contato: "", mensagem: "", publicar: false, consentimento: false, site: "" });
  const [st, setSt] = useState({ state: "idle", msg: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const waText = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${tipo === "duvida" ? "Dúvida" : "Recado"} pelo site, de ${f.nome}${f.cidade ? " (" + f.cidade + ")" : ""}: ${f.mensagem}`)}`;

  async function enviar(e) {
    e.preventDefault();
    if (f.site) return;
    if (f.nome.trim().length < 2) return setSt({ state: "erro", msg: "Escreva o seu nome." });
    if (f.mensagem.trim().length < 5) return setSt({ state: "erro", msg: "Escreva a sua mensagem." });
    if (!f.consentimento) return setSt({ state: "erro", msg: "Para enviar, marque a autorização de uso dos dados." });
    setSt({ state: "enviando", msg: "" });
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/recados_site`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ tipo, nome: f.nome.trim(), cidade: f.cidade.trim() || null, contato: f.contato.trim() || null, mensagem: f.mensagem.trim(), autoriza_publicar: f.publicar, consentimento: true }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setF({ nome: "", cidade: "", contato: "", mensagem: "", publicar: false, consentimento: false, site: "" });
      setSt({ state: "ok", msg: tipo === "duvida" ? "Obrigada! Sua dúvida chegou para a Dra. Renata." : "Obrigada pelo carinho! Seu recado chegou para a Dra. Renata." });
    } catch {
      setSt({ state: "falha", msg: "" });
    }
  }

  return (
    <section id="fale" className="relative overflow-clip bg-gradient-to-br from-white via-[#F1F7FB] to-[#E2F3EF] py-20 lg:py-28">
      <div className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-[#79A9D2]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <Eyebrow>Fale com a Dra. Renata</Eyebrow>
          <h2 className="mt-5 font-serif text-[34px] leading-[1.12] text-[#0E2A57] sm:text-[42px]">Envie sua dúvida ou deixe um recado.</h2>
          <p className="mt-5 text-[18px] leading-[1.7] text-[#33415C]">Ficou com alguma pergunta sobre retina, catarata ou cirurgia? Foi paciente e quer contar como foi? A mensagem chega direto para a Dra. Renata e a equipe, e ninguém mais vê.</p>
          <p className="mt-4 text-[16px] leading-relaxed text-[#33415C]">As dúvidas que mais aparecem viram vídeos e orientações, sempre sem o nome de quem perguntou.</p>
          <div className="mt-7 flex gap-3 rounded-2xl bg-[#FBF1EE] p-5 ring-1 ring-[#E9C7BE]">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-[#9B3D2E]" strokeWidth={2} />
            <p className="text-[15.5px] leading-relaxed text-[#6E2A1F]"><b>Não use este espaço para urgências.</b> Dor forte, perda súbita de visão, clarões ou sombra na visão pedem atendimento no mesmo dia: <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">fale com a equipe pelo WhatsApp</a>.</p>
          </div>
        </div>

        <form onSubmit={enviar} noValidate className="grid gap-5 rounded-2xl bg-white p-6 shadow-[0_30px_60px_-40px_rgba(0,74,173,0.55)] ring-1 ring-[#79A9D2]/40 sm:p-8">
          <div role="radiogroup" aria-label="O que você quer enviar?" className="grid grid-cols-2 gap-1.5 rounded-full bg-[#EEF4FB] p-1.5">
            {[["duvida", "Enviar dúvida"], ["recado", "Deixar recado"]].map(([k, t]) => (
              <button key={k} type="button" role="radio" aria-checked={tipo === k} onClick={() => setTipo(k)}
                className={`min-h-[46px] rounded-full px-3 text-[15px] font-semibold transition ${tipo === k ? "bg-[#004AAD] text-white shadow" : "text-[#33415C] hover:text-[#004AAD]"}`}>{t}</button>
            ))}
          </div>
          <Field label="Seu nome"><input className={inputCls} value={f.nome} onChange={set("nome")} maxLength={80} autoComplete="name" required /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Cidade"><input className={inputCls} value={f.cidade} onChange={set("cidade")} maxLength={60} autoComplete="address-level2" /></Field>
            <Field label="WhatsApp" hint="(opcional)"><input className={inputCls} value={f.contato} onChange={set("contato")} maxLength={30} inputMode="tel" autoComplete="tel" /></Field>
          </div>
          <Field label={tipo === "duvida" ? "Sua dúvida" : "Seu recado"}>
            <textarea className={`${inputCls} min-h-[140px] resize-y py-3`} value={f.mensagem} onChange={set("mensagem")} maxLength={1500} required />
          </Field>
          <p className="-mt-2 text-[14px] text-[#5F5F7C]">Não envie exames, documentos ou dados de saúde que não sejam necessários.</p>
          <input tabIndex={-1} aria-hidden="true" autoComplete="off" value={f.site} onChange={set("site")} className="hidden" />
          <label className="flex gap-3 text-[15px] leading-snug text-[#33415C]">
            <input type="checkbox" checked={f.publicar} onChange={set("publicar")} className="mt-0.5 h-5 w-5 flex-none accent-[#004AAD]" />
            {tipo === "duvida" ? "Autorizo que minha dúvida seja respondida em vídeos ou textos, sem o meu nome." : "Autorizo que meu recado seja publicado no site, só com o meu primeiro nome."}
          </label>
          <label className="flex gap-3 text-[15px] leading-snug text-[#33415C]">
            <input type="checkbox" checked={f.consentimento} onChange={set("consentimento")} className="mt-0.5 h-5 w-5 flex-none accent-[#004AAD]" />
            Concordo que a equipe da Dra. Renata use estes dados apenas para ler e responder a minha mensagem.
          </label>
          <button type="submit" disabled={st.state === "enviando"} className="inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-full bg-[#004AAD] px-6 text-[16px] font-semibold text-white shadow-[0_16px_34px_-16px_rgba(0,74,173,0.6)] transition hover:bg-[#003C8F] disabled:opacity-60">
            <Send className="h-5 w-5" strokeWidth={1.9} />{st.state === "enviando" ? "Enviando…" : "Enviar mensagem"}
          </button>
          <div role="status" aria-live="polite" className="text-[15.5px] font-semibold">
            {st.state === "ok" && <p className="text-[#1F7A55]">{st.msg}</p>}
            {st.state === "erro" && <p className="text-[#9B3D2E]">{st.msg}</p>}
            {st.state === "falha" && (
              <p className="text-[#9B3D2E]">Não conseguimos enviar agora. <a href={waText()} target="_blank" rel="noopener noreferrer" className="text-[#004AAD] underline underline-offset-2">Envie pelo WhatsApp</a>, a mensagem já vai escrita.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------- atendimento ---------- */
function Location() {
  return (
    <section id="atendimento" className="bg-gradient-to-b from-white to-[#EEF4FB] py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Localização e atendimento</Eyebrow>
          <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0E2A57] sm:text-[44px]">Escolha o dia e a cidade que ficam melhor para você.</h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
          {/* agenda + marcação */}
          <div className="rounded-2xl border border-[#0E2A57]/10 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[#004AAD]" strokeWidth={1.8} />
              <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#0E2A57]">Agenda semanal</h3>
            </div>
            <ul className="mt-5 divide-y divide-[#0E2A57]/10">
              {AGENDA.map(([d, lugar, cidade]) => (
                <li key={d} className="grid grid-cols-[52px_1fr] gap-3 py-3.5">
                  <span className="font-serif text-[20px] text-[#0E2A57]">{d}</span>
                  <span>
                    <span className="block text-[16px] font-semibold leading-snug text-[#0E2A57]">{lugar}</span>
                    <span className="block text-[15px] text-[#33415C]/80">{cidade}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3 rounded-xl bg-[#EEF4FB] p-4">
              <Clock className="mt-0.5 h-5 w-5 flex-none text-[#0E2A57]" strokeWidth={1.8} />
              <p className="text-[15.5px] leading-relaxed text-[#33415C]">
                <b className="text-[#0E2A57]">Marcação pelo WhatsApp</b>. Informe a cidade de preferência e a equipe encontra o melhor horário. Agenda sujeita a alterações.
              </p>
            </div>
            <PrimaryCTA className="mt-6 w-full">Agendar pelo WhatsApp</PrimaryCTA>
          </div>

          {/* clínicas */}
          <div className="grid gap-4">
            {CLINICS.map((c) => (
              <div key={c.name} className="rounded-2xl border border-[#0E2A57]/10 bg-white p-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 flex-none text-[#004AAD]" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold text-[#0E2A57]">{c.name}</h3>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-[#33415C]">{c.addr} · Palmas (TO)</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      <a href={`tel:${c.tel}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0E2A57] underline decoration-[#79A9D2] underline-offset-4">
                        <Phone className="h-4 w-4" />{c.phone}
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${c.q}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0E2A57] underline decoration-[#79A9D2] underline-offset-4">
                        Ver no mapa<ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p className="px-1 text-[14.5px] leading-relaxed text-[#33415C]/85">Em Paraíso do Tocantins e Porto Nacional, o endereço é informado pela equipe no agendamento.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- rodapé ---------- */
function Footer() {
  return (
    <footer className="border-t border-[#79A9D2]/40 bg-gradient-to-br from-[#EEF4FB] to-[#DDF1EC] pb-28 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <img src={LOGO} alt="Dra. Renata Bertazzi · Oftalmologia | Retina e Catarata" loading="lazy" className="h-[40px] w-auto" />
          <p className="mt-5 text-[17px] font-semibold text-[#0E2A57]">Dra. Renata Carneiro Bertazzi</p>
          <p className="mt-1 text-[15.5px] leading-relaxed text-[#33415C]">
            Médica Oftalmologista · CRM-TO 7132 · RQE 3562<br />
            Membro titular da Sociedade Brasileira de Retina e Vítreo (SBRV)
          </p>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-[#0E2A57] underline decoration-[#79A9D2] underline-offset-4">
            <AtSign className="h-4 w-4" />@dra.renatabertazzi
          </a>
        </div>
        <div className="text-[13.5px] leading-relaxed text-[#33415C]/85">
          <p><b className="text-[#0E2A57]">Responsável técnica:</b> Dra. Renata Carneiro Bertazzi · CRM-TO 7132 · RQE 3562 (Oftalmologia).</p>
          <p className="mt-3">Conteúdo de caráter exclusivamente informativo e educativo, em conformidade com as normas de publicidade médica do Conselho Federal de Medicina. Não substitui a consulta: diagnóstico e tratamento dependem de avaliação individual, e os resultados variam de pessoa para pessoa.</p>
          <p className="mt-3">© {new Date().getFullYear()} Dra. Renata Bertazzi · Palmas, Tocantins.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- barra fixa (celular) ---------- */
function MobileBar() {
  const [past, setPast] = React.useState(false);
  const [inForm, setInForm] = React.useState(false);
  React.useEffect(() => {
    const cta = document.getElementById("hero-cta"), form = document.getElementById("fale");
    if (!("IntersectionObserver" in window)) { setPast(true); return; }
    const a = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    const b = new IntersectionObserver(([e]) => setInForm(e.isIntersecting), { threshold: 0.15 });
    if (cta) a.observe(cta);
    if (form) b.observe(form);
    return () => { a.disconnect(); b.disconnect(); };
  }, []);
  const show = past && !inForm;
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"} border-t border-[#0E2A57]/10 bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden`}>
      <PrimaryCTA className="w-full" />
    </div>
  );
}

export default function LandingDraRenata() {
  return (
    <div className="min-h-screen bg-[#F6F9FD] text-[#0E2A57] antialiased [font-family:'Inter',system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif; font-weight: 600; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
        ::selection { background: ${BLUE}; color: #fff; }
      `}</style>
      <Header />
      <main>
        <Hero />
        <Treatments />
        <Routine />
        <About />
        <Messages />
        <Location />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
