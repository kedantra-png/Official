"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft, ChevronRight, ImagePlus, Loader2,
  MessageSquareQuote, Plus, UserCircle2, X,
} from "lucide-react";
import type { CustomerExperienceCard } from "@/lib/types/customer-experience";
import {
  Dialog, DialogClose, DialogContent,
  DialogDescription, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

type FormStatus = "idle" | "submitting" | "success" | "error";

const inputCls =
  "w-full rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-[0.85rem] text-white outline-none placeholder:text-white/30 focus:border-white/35 focus:bg-white/8 transition-colors duration-150 disabled:opacity-50";

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.8rem] font-semibold text-white/80">
        {label}{optional && <span className="ml-1 font-normal text-white/35">(optional)</span>}
      </span>
      {children}
    </div>
  );
}

function AvatarUpload({ disabled, onValue }: { disabled: boolean; onValue: (v: string) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlVal, setUrlVal] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const r = ev.target?.result as string; setPreview(r); onValue(r); };
    reader.readAsDataURL(file);
  }
  function commitUrl() {
    if (!urlVal.trim()) return;
    setPreview(urlVal.trim()); onValue(urlVal.trim()); setUrlMode(false);
  }
  function clear() { setPreview(null); setUrlVal(""); onValue(""); if (fileRef.current) fileRef.current.value = ""; }

  return (
    <Field label="Profile picture" optional>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0 size-12">
          <div className="relative w-full h-full rounded-full overflow-hidden border border-white/15 bg-white/5 flex items-center justify-center">
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="48px" unoptimized />
            ) : (
              <UserCircle2 className="size-5.5 text-white/25" strokeWidth={1.25} />
            )}
          </div>
          {preview && (
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              aria-label="Remove photo"
              className="absolute -top-0.5 -right-0.5 z-20 flex size-4.5 items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white border border-black shadow-lg transition-colors active:scale-90"
            >
              <X className="size-2.5" strokeWidth={3} />
            </button>
          )}
        </div>
        {!urlMode ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={disabled} onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[0.78rem] font-medium text-white/75 hover:border-white/30 hover:text-white transition-colors disabled:opacity-50">
              <ImagePlus className="size-3.5" /> Upload photo
            </button>
            <button type="button" disabled={disabled} onClick={() => setUrlMode(true)}
              className="inline-flex items-center rounded-lg border border-white/10 px-3 py-1.5 text-[0.78rem] text-white/40 hover:text-white/70 transition-colors disabled:opacity-50">
              Use URL instead
            </button>
          </div>
        ) : (
          <div className="flex flex-1 gap-2">
            <input type="url" value={urlVal} onChange={e => setUrlVal(e.target.value)} disabled={disabled}
              placeholder="https://…" className={`${inputCls} flex-1 min-w-0 py-2`} />
            <button type="button" disabled={disabled || !urlVal.trim()} onClick={commitUrl}
              className="shrink-0 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-[0.78rem] text-white/70 hover:border-white/40 hover:text-white transition-colors disabled:opacity-40">
              Set
            </button>
            <button type="button" onClick={() => setUrlMode(false)}
              className="shrink-0 rounded-full p-1.5 text-white/30 hover:text-white/60 transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      <p className="text-[0.75rem] text-white/30 mt-0.5">Shown as a small avatar alongside your review.</p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={disabled} />
    </Field>
  );
}

/* ── shared panel styles ─────────────────────────────────────────── */
const panelStyle: React.CSSProperties = {
  background: "color-mix(in srgb, white 4%, #0a0a0a)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.06) inset",
};

function SafeAvatar({ src, alt }: { src?: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/default.jfif");

  useEffect(() => {
    setImgSrc(src || "/default.jfif");
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      sizes="48px"
      unoptimized
      onError={() => {
        setImgSrc("/default.jfif");
      }}
    />
  );
}

/* ── Form fields — shared between both layouts ───────────────────── */
function FormFields({ status, error, imageVal, setImageVal }: {
  status: FormStatus; error: string | null;
  imageVal: string; setImageVal: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {error && (
        <p role="alert" className="rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-2 text-[0.8rem] text-secondary">
          {error}
        </p>
      )}
      <Field label="Your experience">
        <textarea required name="quote" rows={3} minLength={10} maxLength={2000}
          disabled={status === "submitting"} placeholder="What was it like working with OORDHWA?"
          className={`${inputCls} resize-none`} />
      </Field>
      <Field label="Your name">
        <input required type="text" name="author" minLength={2} maxLength={120}
          disabled={status === "submitting"} placeholder="Sarah Chen" className={inputCls} />
      </Field>
      <Field label="Role" optional>
        <input type="text" name="role" maxLength={120}
          disabled={status === "submitting"} placeholder="Creative Director" className={inputCls} />
      </Field>
      <Field label="Company" optional>
        <input type="text" name="company" maxLength={120}
          disabled={status === "submitting"} placeholder="Studio Forma" className={inputCls} />
      </Field>
      <AvatarUpload disabled={status === "submitting"} onValue={setImageVal} />
    </div>
  );
}

export function CustomerExperiencesSection() {
  const [experiences, setExperiences] = useState<CustomerExperienceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [isTransitioning, setTrans] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [imageValue, setImageValue] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* fetch */
  const fetchExperiences = useCallback(async () => {
    setLoading(true); setLoadError(null);
    try {
      const res = await fetch("/api/customer-experiences");
      const json = (await res.json()) as { experiences?: CustomerExperienceCard[]; error?: string };
      if (!res.ok) { setLoadError(json.error ?? "Could not load."); setExperiences([]); return; }
      setExperiences(json.experiences ?? []); setActive(0);
    } catch { setLoadError("Network error."); setExperiences([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchExperiences(); }, [fetchExperiences]);
  useEffect(() => {
    if (experiences.length > 0 && active >= experiences.length) setActive(experiences.length - 1);
  }, [experiences.length, active]);

  useEffect(() => {
    if (experiences.length <= 1 || isPaused || dialogOpen || formStatus === "submitting") {
      if (autoSlideRef.current) { clearInterval(autoSlideRef.current); autoSlideRef.current = null; }
      return;
    }
    autoSlideRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % experiences.length);
    }, 5000);
    return () => { if (autoSlideRef.current) { clearInterval(autoSlideRef.current); autoSlideRef.current = null; } };
  }, [experiences.length, isPaused, dialogOpen, formStatus]);

  /* carousel */
  const go = (i: number) => {
    if (i === active || isTransitioning || !experiences.length) return;
    setTrans(true);
    window.setTimeout(() => { setActive(i); window.setTimeout(() => setTrans(false), 50); }, 300);
  };
  const prev = () => go(active === 0 ? experiences.length - 1 : active - 1);
  const next = () => go(active === experiences.length - 1 ? 0 : active + 1);

  function openDialog() { setDialogOpen(true); setFormStatus("idle"); setFormError(null); setImageValue(""); }
  function onOpenChange(open: boolean) {
    if (!open && formStatus === "submitting") return;
    setDialogOpen(open);
    if (open) { setFormStatus("idle"); setFormError(null); setImageValue(""); }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setFormStatus("submitting"); setFormError(null);
    const fd = new FormData(e.currentTarget);
    const quote = String(fd.get("quote") ?? "").trim();
    const author = String(fd.get("author") ?? "").trim();
    const role = String(fd.get("role") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();

    if (quote.length < 10 || quote.length > 2000) {
      setFormError("Experience must be between 10 and 2000 characters.");
      setFormStatus("error");
      return;
    }
    if (author.length < 2 || author.length > 120) {
      setFormError("Name must be between 2 and 120 characters.");
      setFormStatus("error");
      return;
    }
    if (role.length > 120) {
      setFormError("Role must be 120 characters or fewer.");
      setFormStatus("error");
      return;
    }
    if (company.length > 120) {
      setFormError("Company must be 120 characters or fewer.");
      setFormStatus("error");
      return;
    }

    const payload = {
      quote, author, role, company,
      image_url: imageValue,
    };
    try {
      const res = await fetch("/api/customer-experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as { ok?: boolean; experience?: CustomerExperienceCard; error?: string };
      if (!res.ok) { setFormError(json.error ?? "Something went wrong."); setFormStatus("error"); return; }
      if (json.experience) { setExperiences(p => [json.experience!, ...p]); setActive(0); } else { await fetchExperiences(); }
      (e.target as HTMLFormElement).reset(); setImageValue("");
      setFormStatus("success");
      window.setTimeout(() => { setDialogOpen(false); setFormStatus("idle"); }, 1400);
    } catch { setFormError("Network error."); setFormStatus("error"); }
  }

  const current = experiences[active];
  const total = experiences.length;
  const indexLabel = total > 0 ? String(active + 1).padStart(2, "0") : "00";

  /* ── success panel ────────────────────────────────────────────── */
  const SuccessPanel = (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-hover/30 bg-hover/10">
        <svg className="size-6 text-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-[0.95rem] font-medium text-hover">Your experience has been published.</p>
      <p className="text-[0.82rem] text-white/40">Closing in a moment…</p>
    </div>
  );

  return (
    <section id="reviews" className="section-full relative flex flex-col justify-center bg-transparent pad-section">
      <div className="relative z-10 mx-auto w-full max-w-[clamp(20rem,92vw,48rem)] py-[clamp(0.5rem,2vh,2rem)]">

        {/* section header */}
        <header className="mb-[clamp(2rem,4vh,3rem)]">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-clamp-small mb-2 font-semibold tracking-[0.25em] text-ternary uppercase">Customer Experiences</p>
            <h2 className="font-heading text-clamp-h2 font-bold text-white">What partners say</h2>
            <p className="text-clamp-body mt-3 max-w-xl text-white/65">
              Real stories from teams we work with. Add yours to share how OORDHWA helped your project.
            </p>

            <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
              <DialogTrigger asChild>
                <button type="button" onClick={openDialog}
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white/70 transition-all duration-300 hover:border-white/25 hover:text-white active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                  aria-label="Add customer experience">
                  <Plus className="size-3.5" strokeWidth={2} /> Add experience
                </button>
              </DialogTrigger>

              {/*
              ╔══════════════════════════════════════════════════════╗
              ║  DialogContent owns NO built-in X — we render our   ║
              ║  own single close control (pill on mobile, X on      ║
              ║  desktop).                                           ║
              ╚══════════════════════════════════════════════════════╝

              MOBILE  (<sm): portrait sheet — pill top, header, scroll body, stacked CTA
              DESKTOP (≥sm): landscape two-column — left info panel + right form column
            */}
              <DialogContent className="w-full overflow-hidden" style={panelStyle}>

                {/* ════ SHEET layout (visible below lg) ════ */}
                <div className="lg:hidden flex flex-col max-h-[calc(100dvh-4rem)]">

                  {/* pill — closes dialog */}
                  <DialogClose asChild>
                    <button type="button" aria-label="Close" className="w-full flex justify-center pt-2 pb-0.5 group shrink-0">
                      <span className="h-1 w-9 rounded-full bg-white/25 group-hover:bg-white/50 transition-colors" />
                    </button>
                  </DialogClose>

                  {/* header — compact */}
                  <div className="relative flex items-start gap-2.5 px-4 pt-2 pb-3 border-b border-white/8 shrink-0">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8">
                      <UserCircle2 className="size-4 text-white/55" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <DialogTitle className="text-[1rem]">Share your experience</DialogTitle>
                      <DialogDescription className="text-[0.78rem]">Your story appears for everyone to see.</DialogDescription>
                    </div>
                    <DialogClose asChild>
                      <button type="button" aria-label="Close"
                        className="absolute right-3 top-2 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="size-3.5" />
                      </button>
                    </DialogClose>
                  </div>

                  {/* scrollable form — no scrollbar visible */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 scrollbar-none">
                    {formStatus === "success" ? SuccessPanel : (
                      <form id="exp-form-mobile" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <FormFields status={formStatus} error={formError} imageVal={imageValue} setImageVal={setImageValue} />
                        
                        <div className="flex flex-col gap-2 pt-3 border-t border-white/8">
                          <button type="submit" disabled={formStatus === "submitting"}
                            className="w-full rounded-xl bg-secondary py-3 text-[0.9rem] font-semibold text-white hover:bg-[#9a0000] active:bg-[#700000] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
                            {formStatus === "submitting" ? <><Loader2 className="size-4 animate-spin" />Saving&hellip;</> : "Publish experience"}
                          </button>
                          <DialogClose asChild>
                            <button type="button" disabled={formStatus === "submitting"}
                              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-[0.85rem] font-medium text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors">
                              Cancel
                            </button>
                          </DialogClose>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* ════ DESKTOP centered layout (visible at lg+) ════ */}
                <div className="hidden lg:flex flex-col max-h-[85dvh]">

                  {/* header — compact */}
                  <div className="relative flex items-start gap-3 px-6 pt-5 pb-3 border-b border-white/8 shrink-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8">
                      <UserCircle2 className="size-5 text-white/55" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <DialogTitle className="text-[1.15rem]">Share your experience</DialogTitle>
                      <DialogDescription className="text-[0.82rem]">Your story appears for everyone to see.</DialogDescription>
                    </div>
                    <DialogClose asChild>
                      <button type="button" aria-label="Close"
                        className="absolute right-4 top-4 rounded-full p-1.5 text-white/35 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="size-4" />
                      </button>
                    </DialogClose>
                  </div>

                  {/* scrollable form area — no scrollbar visible */}
                  <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 scrollbar-none">
                    {formStatus === "success" ? SuccessPanel : (
                      <form id="exp-form-desktop" onSubmit={handleSubmit} noValidate>
                        <FormFields status={formStatus} error={formError} imageVal={imageValue} setImageVal={setImageValue} />
                      </form>
                    )}
                  </div>

                  {/* footer — side-by-side */}
                  {formStatus !== "success" && (
                    <div className="shrink-0 flex gap-3 px-6 pb-5 pt-3 border-t border-white/8">
                      <DialogClose asChild>
                        <button type="button" disabled={formStatus === "submitting"}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[0.85rem] font-medium text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors">
                          Cancel
                        </button>
                      </DialogClose>
                      <button type="submit" form="exp-form-desktop" disabled={formStatus === "submitting"}
                        className="flex-[2] rounded-xl bg-secondary py-2.5 text-[0.88rem] font-semibold text-white hover:bg-[#9a0000] active:bg-[#700000] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
                        {formStatus === "submitting" ? <><Loader2 className="size-4 animate-spin" />Saving&hellip;</> : "Publish experience"}
                      </button>
                    </div>
                  )}

                </div>

              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* carousel body */}
        {loading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="size-8 animate-spin" aria-hidden /><p className="text-clamp-small">Loading experiences…</p>
          </div>
        ) : loadError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
            <MessageSquareQuote className="size-12 text-white/25" strokeWidth={1.25} />
            <p className="text-clamp-body max-w-sm text-white/55">{loadError}</p>
            <button type="button" onClick={() => void fetchExperiences()} className="text-clamp-small font-medium text-secondary underline-offset-2 hover:underline">Try again</button>
          </div>
        ) : total === 0 ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <MessageSquareQuote className="size-8 text-white/30" strokeWidth={1.25} />
            </div>
            <div>
              <p className="font-heading text-clamp-h3 font-semibold text-white/80">No experiences yet</p>
              <p className="text-clamp-body mt-2 max-w-sm text-white/45">Be the first to share feedback.</p>
            </div>
            <button type="button" onClick={openDialog} className="text-clamp-small inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-medium text-white/80 transition-colors hover:border-hover hover:text-white">
              <Plus className="size-4" /> Add experience
            </button>
          </div>
        ) : (
          <div className="w-full px-2 sm:px-6" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            <div className="flex items-start gap-4 sm:gap-8">
              <span className="hidden select-none text-[clamp(4rem,12vw,7.5rem)] leading-none font-light text-white/10 sm:block" style={{ fontFeatureSettings: '"tnum"' }}>
                {indexLabel}
              </span>
              <div className="min-w-0 flex-1 sm:pt-6">
                <blockquote className={`text-clamp-h3 font-light leading-relaxed tracking-tight text-white transition-[transform,opacity] duration-500 ease-out will-change-[transform,opacity] ${isTransitioning ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}>
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <div className={`mt-8 transition-[transform,opacity] duration-500 ease-out delay-75 will-change-[transform,opacity] ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
                  <div className="group flex cursor-default items-center gap-4">
                    <div className="relative size-12 overflow-hidden rounded-full ring-2 ring-white/10 transition-[ring] duration-300 group-hover:ring-white/30">
                      <SafeAvatar src={current.image} alt={current.author} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{current.author}</p>
                      <p className="text-clamp-small text-white/50">
                        {current.role || "Partner"}
                        {current.company ? (<><span className="mx-2 text-white/20">/</span><span className="transition-colors duration-300 group-hover:text-white/80">{current.company}</span></>) : null}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 flex items-center gap-4 sm:gap-6 w-full sm:mt-16">
              <div className="flex-1 flex items-center gap-1.5 sm:gap-2.5">
                {experiences.map((item, i) => (
                  <button key={item.id} type="button" onClick={() => go(i)} className="flex-1 group relative py-4" aria-label={`View experience ${i + 1}`}>
                    <span className={`block h-px w-full transition-all duration-500 ease-out ${i === active ? "bg-white" : "bg-white/20 group-hover:bg-white/45"}`} />
                  </button>
                ))}
              </div>
              <span className="text-xs tracking-widest text-white/40 uppercase whitespace-nowrap shrink-0">{indexLabel} / {String(total).padStart(2, "0")}</span>
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={prev} className="rounded-full p-2 text-white/40 transition-all duration-300 hover:bg-white/5 hover:text-white" aria-label="Previous"><ChevronLeft className="size-5" /></button>
                <button type="button" onClick={next} className="rounded-full p-2 text-white/40 transition-all duration-300 hover:bg-white/5 hover:text-white" aria-label="Next"><ChevronRight className="size-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
