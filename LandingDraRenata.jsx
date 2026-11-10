import React, { useState } from "react";
import {
  MessageCircle, ArrowRight, ArrowUpRight, ShieldCheck, BadgeCheck, Award, Eye, ScanEye,
  Crosshair, ChevronDown, MapPin, Phone, Clock, Stethoscope, HeartHandshake, ClipboardCheck,
  CalendarDays, Menu, X, AtSign,
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

const NAVY = "#0B1E36";

const TREATMENTS = [
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
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? "text-[#D9C59A]" : "text-[#9A7B45]"}`}>
      <span className={`h-px w-8 ${light ? "bg-[#D9C59A]" : "bg-[#B8975A]"}`} />
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
      className={`group inline-flex min-h-[56px] items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#0B1E36] px-6 text-[16px] font-semibold text-white shadow-[0_18px_40px_-18px_rgba(11,30,54,0.75)] ring-1 ring-[#0B1E36] transition hover:bg-[#13304F] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B8975A]/60 ${className}`}
    >
      <MessageCircle className="h-5 w-5 text-[#D9C59A]" strokeWidth={2} />
      {children}
      <ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-0.5 min-[400px]:block" />
    </a>
  );
}

/* ---------- header ---------- */
function Header() {
  const [open, setOpen] = useState(false);
  const links = [["#tratamentos", "Tratamentos"], ["#rotina", "Rotina"], ["#sobre", "A médica"], ["#atendimento", "Onde atendo"]];
  return (
    <header className="sticky top-0 z-40 border-b border-[#0B1E36]/10 bg-[#F8FAFC]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 lg:px-8">
        <a href="#inicio" className="flex items-center" aria-label="Dra. Renata Bertazzi, Oftalmologia, Retina e Catarata. Início">
          <img src={LOGO} alt="Dra. Renata Bertazzi · Oftalmologia | Retina e Catarata" className="h-[34px] w-auto sm:h-[40px]" />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map(([h, t]) => (
            <a key={h} href={h} className="text-[15px] font-medium text-[#0B1E36]/75 transition hover:text-[#0B1E36]">{t}</a>
          ))}
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0B1E36] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#13304F]">Agendar</a>
        </nav>
        <button
          className="grid h-11 w-11 place-items-center rounded-full border border-[#0B1E36]/15 md:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-5 w-5 text-[#0B1E36]" /> : <Menu className="h-5 w-5 text-[#0B1E36]" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[#0B1E36]/10 bg-white px-5 pb-5 md:hidden" aria-label="Menu">
          {links.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-[#0B1E36]/10 py-4 text-[17px] font-medium text-[#0B1E36]">
              {t}<ArrowRight className="h-4 w-4 text-[#B8975A]" />
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
    <section id="inicio" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(70%_60%_at_80%_10%,rgba(184,151,90,0.10),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-24 lg:pt-16">
        {/* imagem */}
        <div className="relative mx-auto w-full max-w-[440px] lg:order-2 lg:max-w-none">
          <div className="absolute -right-3 -top-3 bottom-10 left-10 border border-[#B8975A]/45" aria-hidden="true" />
          <figure className="relative overflow-hidden rounded-[6px] bg-[#E9ECF1] shadow-[0_40px_80px_-40px_rgba(11,30,54,0.55)]">
            <img
              src={HERO_PHOTO}
              alt="Dra. Renata Bertazzi, médica oftalmologista em Palmas, em seu consultório"
              className="aspect-[4/5] w-full object-cover object-[50%_15%] [filter:contrast(1.03)_saturate(0.94)]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1E36]/35 via-transparent to-transparent" />
          </figure>
          <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-[4px] border border-[#0B1E36]/10 bg-white/95 px-5 py-4 shadow-[0_24px_50px_-24px_rgba(11,30,54,0.6)] backdrop-blur sm:left-[-18px]">
            <span className="font-serif text-[40px] leading-none text-[#0B1E36]">+500</span>
            <span className="border-l border-[#B8975A]/50 pl-4 text-[13px] font-medium leading-snug text-[#0B1E36]/75">
              cirurgias<br />realizadas
            </span>
          </div>
        </div>

        {/* texto */}
        <div className="pt-4 lg:order-1 lg:pt-0">
          <Eyebrow>Oftalmologia · Palmas, TO</Eyebrow>
          <h1 className="mt-5 font-serif text-[40px] leading-[1.06] tracking-[-0.01em] text-[#0B1E36] sm:text-[52px] lg:text-[60px]">
            Cuidado especializado e precisão cirúrgica para a saúde da sua visão.
          </h1>
          <p className="mt-6 max-w-[34rem] text-[18px] leading-[1.65] text-[#24364F]">
            Catarata e doenças da retina tratadas com técnica, calma e explicação clara. Da primeira consulta ao último retorno, você é acompanhado pela mesma médica.
          </p>

          {/* credenciais */}
          <dl className="mt-8 grid grid-cols-3 divide-x divide-[#0B1E36]/12 border-y border-[#0B1E36]/12 py-4">
            {[
              ["CRM-TO", "7132", BadgeCheck],
              ["RQE", "3562", ShieldCheck],
              ["SBRV", "Membro titular", Award],
            ].map(([k, v, Icon]) => (
              <div key={k} className="px-3 first:pl-0">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A7B45]">
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />{k}
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-[#0B1E36]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA />
            <a
              href="#tratamentos"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#0B1E36]/25 bg-white px-7 text-[16px] font-semibold text-[#0B1E36] transition hover:border-[#0B1E36]"
            >
              Conhecer Tratamentos
            </a>
          </div>
          <p className="mt-4 text-[14px] text-[#24364F]/80">Atendimento em Palmas, Paraíso do Tocantins e Porto Nacional.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- tratamentos ---------- */
function TreatmentCard({ t, open, onToggle }) {
  const Icon = t.icon;
  return (
    <article className={`flex flex-col rounded-[6px] border bg-white transition ${open ? "border-[#0B1E36]/30 shadow-[0_30px_60px_-36px_rgba(11,30,54,0.5)]" : "border-[#0B1E36]/10 hover:border-[#0B1E36]/25"}`}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full flex-col gap-5 p-6 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[#B8975A]/50 sm:p-7">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0B1E36] text-[#D9C59A]">
            <Icon className="h-[22px] w-[22px]" strokeWidth={1.6} />
          </span>
          <span className={`grid h-9 w-9 place-items-center rounded-full border border-[#0B1E36]/15 transition ${open ? "rotate-180 bg-[#0B1E36] text-white" : "text-[#0B1E36]"}`}>
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A7B45]">{t.tag}</p>
          <h3 className="mt-2 font-serif text-[27px] leading-tight text-[#0B1E36]">{t.title}</h3>
          <p className="mt-3 text-[16.5px] leading-relaxed text-[#24364F]">{t.summary}</p>
        </div>
        {!open && (
          <span className="text-[14px] font-semibold text-[#0B1E36] underline decoration-[#B8975A] decoration-2 underline-offset-4">Ver sinais e tratamento</span>
        )}
      </button>
      {open && (
        <div className="grid gap-6 border-t border-[#0B1E36]/10 px-6 pb-7 pt-6 sm:px-7">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0B1E36]">Sinais de alerta</p>
            <ul className="mt-3 grid gap-2.5">
              {t.signs.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] leading-snug text-[#24364F]">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-[#B8975A]" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0B1E36]">Como tratamos</p>
            <ul className="mt-3 grid gap-2.5">
              {t.care.map((s) => (
                <li key={s} className="flex gap-3 text-[16px] leading-snug text-[#24364F]">
                  <BadgeCheck className="mt-0.5 h-[18px] w-[18px] flex-none text-[#0B1E36]" strokeWidth={1.8} />{s}
                </li>
              ))}
            </ul>
          </div>
          {t.urgent && (
            <p className="rounded-[4px] border-l-4 border-[#9B3D2E] bg-[#FBF1EE] px-4 py-3 text-[15px] font-semibold leading-snug text-[#6E2A1F]">{t.urgent}</p>
          )}
        </div>
      )}
    </article>
  );
}

function Treatments() {
  const [open, setOpen] = useState("catarata");
  return (
    <section id="tratamentos" className="border-t border-[#0B1E36]/10 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Áreas de tratamento</Eyebrow>
          <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0B1E36] sm:text-[44px]">Do diagnóstico à cirurgia, com a mesma atenção.</h2>
          <p className="mt-4 text-[18px] leading-relaxed text-[#24364F]">Toque em cada área para ver os sinais que pedem avaliação e como é o tratamento.</p>
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
            <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0B1E36] sm:text-[44px]">Cada etapa conferida, para você operar tranquilo.</h2>
          </div>
          <p className="max-w-sm text-[16px] leading-relaxed text-[#24364F] lg:text-right">Do consultório ao centro cirúrgico, a mesma médica cuida de cada detalhe.</p>
        </div>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-4 lg:overflow-visible lg:px-8">
        {GALLERY.map((g) => (
          <figure key={g.step} className="w-[78%] flex-none snap-start sm:w-[44%] lg:w-auto">
            <div className="relative overflow-hidden rounded-[6px] bg-[#E9ECF1] shadow-[0_30px_60px_-40px_rgba(11,30,54,0.6)]">
              {g.video ? (
                <video src={g.video} poster={g.poster} autoPlay muted loop playsInline preload="metadata" aria-label={g.alt} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <img src={g.src} alt={g.alt} loading="lazy" className="aspect-[3/4] w-full object-cover [filter:saturate(0.9)_contrast(1.03)]" />
              )}
              <span className="absolute left-3 top-3 rounded-[3px] bg-white/90 px-2.5 py-1 font-serif text-[15px] text-[#0B1E36]">{g.step}</span>
            </div>
            <figcaption className="mt-4 border-l-2 border-[#B8975A] pl-4">
              <span className="block text-[17px] font-semibold text-[#0B1E36]">{g.title}</span>
              <span className="mt-1 block text-[15.5px] leading-relaxed text-[#24364F]">{g.text}</span>
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
    <section id="sobre" className="relative overflow-hidden bg-[#0B1E36] py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full border border-[#D9C59A]/15" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[480px] w-[480px] rounded-full border border-[#D9C59A]/10" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="lg:hidden">
            <Eyebrow light>Sobre a médica</Eyebrow>
            <h2 className="mt-5 font-serif text-[36px] leading-[1.1] sm:text-[44px]">Experiência no centro cirúrgico. Escuta no consultório.</h2>
          </div>
          <figure className="mt-10 lg:mt-0">
            <div className="relative">
            <div className="absolute -bottom-3 -left-3 right-10 top-10 border border-[#D9C59A]/40" aria-hidden="true" />
            <img src={ABOUT_PHOTO} alt="Retrato da Dra. Renata Bertazzi" loading="lazy" className="relative aspect-[4/5] w-full rounded-[6px] object-cover object-[50%_20%] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] [filter:saturate(0.92)_contrast(1.03)]" />
            </div>
            <figcaption className="mt-6 text-[14px] tracking-wide text-white/60">Dra. Renata Carneiro Bertazzi · CRM-TO 7132</figcaption>
          </figure>
        </div>
        <div>
          <div className="hidden lg:block">
            <Eyebrow light>Sobre a médica</Eyebrow>
            <h2 className="mt-5 font-serif text-[44px] leading-[1.1]">Experiência no centro cirúrgico. Escuta no consultório.</h2>
          </div>
          <div className="mt-6 grid gap-4 text-[18px] leading-[1.7] text-white/85">
            <p>A Dra. Renata Carneiro Bertazzi é médica oftalmologista com atuação dedicada à catarata e às doenças da retina. Formou-se em Medicina pela PUC Goiás e fez residência em Oftalmologia e fellowship no IPEPO, em São Paulo.</p>
            <p>Trabalhou seis anos no SUS em São Paulo, cuidando de pacientes de todas as idades e realidades. Desde 2024 atende em Palmas e na região, onde já soma mais de 500 cirurgias.</p>
          </div>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#D9C59A]/40 px-5 py-3">
            <Award className="h-5 w-5 text-[#D9C59A]" strokeWidth={1.7} />
            <span className="text-[15px] font-medium">Membro titular da Sociedade Brasileira de Retina e Vítreo</span>
          </div>
        <ul className="mt-10 grid content-start gap-4">
          {pillars.map(([Icon, title, text]) => (
            <li key={title} className="flex gap-5 rounded-[6px] border border-white/12 bg-white/[0.04] p-6">
              <Icon className="mt-1 h-6 w-6 flex-none text-[#D9C59A]" strokeWidth={1.6} />
              <div>
                <h3 className="text-[18px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-white/75">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- atendimento ---------- */
function Location() {
  return (
    <section id="atendimento" className="border-t border-[#0B1E36]/10 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>Localização e atendimento</Eyebrow>
          <h2 className="mt-5 font-serif text-[36px] leading-[1.1] text-[#0B1E36] sm:text-[44px]">Escolha o dia e a cidade que ficam melhor para você.</h2>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* agenda + marcação */}
          <div className="rounded-[6px] border border-[#0B1E36]/10 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[#9A7B45]" strokeWidth={1.8} />
              <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#0B1E36]">Agenda semanal</h3>
            </div>
            <ul className="mt-5 divide-y divide-[#0B1E36]/10">
              {AGENDA.map(([d, lugar, cidade]) => (
                <li key={d} className="grid grid-cols-[52px_1fr] gap-3 py-3.5">
                  <span className="font-serif text-[20px] text-[#0B1E36]">{d}</span>
                  <span>
                    <span className="block text-[16px] font-semibold leading-snug text-[#0B1E36]">{lugar}</span>
                    <span className="block text-[15px] text-[#24364F]/80">{cidade}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3 rounded-[4px] bg-[#F3F5F8] p-4">
              <Clock className="mt-0.5 h-5 w-5 flex-none text-[#0B1E36]" strokeWidth={1.8} />
              <p className="text-[15.5px] leading-relaxed text-[#24364F]">
                <b className="text-[#0B1E36]">Marcação pelo WhatsApp</b>. Informe a cidade de preferência e a equipe encontra o melhor horário. Agenda sujeita a alterações.
              </p>
            </div>
            <PrimaryCTA className="mt-6 w-full" />
          </div>

          {/* clínicas */}
          <div className="grid gap-4">
            {CLINICS.map((c) => (
              <div key={c.name} className="rounded-[6px] border border-[#0B1E36]/10 bg-white p-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 flex-none text-[#9A7B45]" strokeWidth={1.8} />
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold text-[#0B1E36]">{c.name}</h3>
                    <p className="mt-1 text-[15.5px] leading-relaxed text-[#24364F]">{c.addr} · Palmas (TO)</p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                      <a href={`tel:${c.tel}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0B1E36] underline decoration-[#B8975A] underline-offset-4">
                        <Phone className="h-4 w-4" />{c.phone}
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${c.q}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#0B1E36] underline decoration-[#B8975A] underline-offset-4">
                        Ver no mapa<ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p className="px-1 text-[14.5px] leading-relaxed text-[#24364F]/85">Em Paraíso do Tocantins e Porto Nacional, o endereço é informado pela equipe no agendamento.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- rodapé ---------- */
function Footer() {
  return (
    <footer className="border-t border-[#0B1E36]/10 bg-white pb-28 pt-14 md:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <img src={LOGO} alt="Dra. Renata Bertazzi · Oftalmologia | Retina e Catarata" loading="lazy" className="h-[40px] w-auto" />
          <p className="mt-5 text-[17px] font-semibold text-[#0B1E36]">Dra. Renata Carneiro Bertazzi</p>
          <p className="mt-1 text-[15.5px] leading-relaxed text-[#24364F]">
            Médica Oftalmologista · CRM-TO 7132 · RQE 3562<br />
            Membro titular da Sociedade Brasileira de Retina e Vítreo (SBRV)
          </p>
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-[#0B1E36] underline decoration-[#B8975A] underline-offset-4">
            <AtSign className="h-4 w-4" />@dra.renatabertazzi
          </a>
        </div>
        <div className="text-[13.5px] leading-relaxed text-[#24364F]/85">
          <p><b className="text-[#0B1E36]">Responsável técnica:</b> Dra. Renata Carneiro Bertazzi · CRM-TO 7132 · RQE 3562 (Oftalmologia).</p>
          <p className="mt-3">Conteúdo de caráter exclusivamente informativo e educativo, em conformidade com as normas de publicidade médica do Conselho Federal de Medicina. Não substitui a consulta: diagnóstico e tratamento dependem de avaliação individual, e os resultados variam de pessoa para pessoa.</p>
          <p className="mt-3">© {new Date().getFullYear()} Dra. Renata Bertazzi · Palmas, Tocantins.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- barra fixa (celular) ---------- */
function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0B1E36]/10 bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <PrimaryCTA className="w-full" />
    </div>
  );
}

export default function LandingDraRenata() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1E36] antialiased [font-family:'Inter',system-ui,-apple-system,'Segoe_UI',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif; font-weight: 600; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
        ::selection { background: ${NAVY}; color: #fff; }
      `}</style>
      <Header />
      <main>
        <Hero />
        <Treatments />
        <Routine />
        <About />
        <Location />
      </main>
      <Footer />
      <MobileBar />
    </div>
  );
}
