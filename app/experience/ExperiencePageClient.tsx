"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2, MessageSquareQuote, Plus, UserCircle2, X } from "lucide-react";
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
        <div className="relative shrink-0 size-11 rounded-full overflow-hidden border border-white/15 bg-white/5 flex items-center justify-center">
          {preview ? (
            <>
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="44px" unoptimized />
              <button type="button" onClick={clear} disabled={disabled} aria-label="Remove"
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                <X className="size-3.5 text-white" />
              </button>
            </>
          ) : <UserCircle2 className="size-5 text-white/25" strokeWidth={1.25} />}
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
              placeholder="https://&hellip;" className={`${inputCls} flex-1 min-w-0 py-2`} />
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

const panelStyle: React.CSSProperties = {
  background: "color-mix(in srgb, white 4%, #0a0a0a)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.06) inset",
};

export function ExperiencePageClient() {
  const [experiences, setExperiences] = useState<CustomerExperienceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [imageValue, setImageValue] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true); setLoadError(null);
    try {
      const res = await fetch("/api/customer-experiences");
      const json = (await res.json()) as { experiences?: CustomerExperienceCard[]; error?: string };
      if (!res.ok) { setLoadError(json.error ?? "Could not load."); setExperiences([]); return; }
      setExperiences(json.experiences ?? []);
    } catch { setLoadError("Network error."); setExperiences([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void fetchExperiences(); }, [fetchExperiences]);

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
      if (json.experience) { setExperiences(p => [json.experience!, ...p]); } else { await fetchExperiences(); }
      (e.target as HTMLFormElement).reset(); setImageValue("");
      setFormStatus("success");
      window.setTimeout(() => { setDialogOpen(false); setFormStatus("idle"); }, 1400);
    } catch { setFormError("Network error."); setFormStatus("error"); }
  }

  const selected = experiences.find(e => e.id === selectedId);

  return (
    <>
      {/* header */}
      <section className="relative pad-section">
        <div className="mx-auto max-w-[clamp(20rem,92vw,72rem)]">
          <Link href="/#contact"
            className="inline-flex items-center gap-2 text-[0.85rem] text-white/40 hover:text-white/70 transition-colors mb-6">
            <ArrowLeft className="size-4" /> Back to home
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-clamp-small mb-2 font-semibold tracking-[0.25em] text-ternary uppercase">Customer Experiences</p>
              <h1 className="font-heading text-clamp-h1 font-bold text-white">What partners say</h1>
              <p className="text-clamp-body mt-3 max-w-2xl text-white/65">
                Real stories from teams we work with. Add yours to share how OORDHWA helped your project.
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button type="button"
                  className="inline-flex items-center gap-2 shrink-0 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-white/80 transition-colors hover:border-hover hover:bg-hover/20 hover:text-white"
                  aria-label="Add customer experience">
                  <Plus className="size-4" strokeWidth={1.75} /> Share experience
                </button>
              </DialogTrigger>
              <DialogContent className="w-full overflow-hidden sm:max-w-md" style={panelStyle}>
                <div className="flex flex-col max-h-[calc(100dvh-4rem)] sm:max-h-[85dvh]">
                  <div className="relative flex items-start gap-2.5 px-4 pt-4 pb-3 border-b border-white/8 shrink-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8">
                      <UserCircle2 className="size-4 text-white/55" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <DialogTitle className="text-[1rem]">Share your experience</DialogTitle>
                      <DialogDescription className="text-[0.78rem]">Your story appears for everyone to see.</DialogDescription>
                    </div>
                    <DialogClose asChild>
                      <button type="button" aria-label="Close"
                        className="absolute right-3 top-3 rounded-full p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="size-3.5" />
                      </button>
                    </DialogClose>
                  </div>

                  <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 scrollbar-none">
                    {formStatus === "success" ? (
                      <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <div className="flex size-12 items-center justify-center rounded-full border border-hover/30 bg-hover/10">
                          <svg className="size-5 text-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-[0.9rem] font-medium text-hover">Your experience has been published.</p>
                        <p className="text-[0.78rem] text-white/40">Closing in a moment&hellip;</p>
                      </div>
                    ) : (
                      <form id="exp-form-page" onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-2.5">
                          {formError && (
                            <p role="alert" className="rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-2 text-[0.8rem] text-secondary">
                              {formError}
                            </p>
                          )}
                          <Field label="Your experience">
                            <textarea required name="quote" rows={3} minLength={10} maxLength={2000}
                              disabled={formStatus === "submitting"} placeholder="What was it like working with OORDHWA?"
                              className={`${inputCls} resize-none`} />
                          </Field>
                          <Field label="Your name">
                            <input required type="text" name="author" minLength={2} maxLength={120}
                              disabled={formStatus === "submitting"} placeholder="Sarah Chen" className={inputCls} />
                          </Field>
                          <Field label="Role" optional>
                            <input type="text" name="role" maxLength={120}
                              disabled={formStatus === "submitting"} placeholder="Creative Director" className={inputCls} />
                          </Field>
                          <Field label="Company" optional>
                            <input type="text" name="company" maxLength={120}
                              disabled={formStatus === "submitting"} placeholder="Studio Forma" className={inputCls} />
                          </Field>
                          <AvatarUpload disabled={formStatus === "submitting"} onValue={setImageValue} />
                        </div>
                      </form>
                    )}
                  </div>

                  {formStatus !== "success" && (
                    <div className="shrink-0 flex gap-2.5 px-4 pb-4 pt-2.5 border-t border-white/8">
                      <DialogClose asChild>
                        <button type="button" disabled={formStatus === "submitting"}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[0.85rem] font-medium text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors">
                          Cancel
                        </button>
                      </DialogClose>
                      <button type="submit" form="exp-form-page" disabled={formStatus === "submitting"}
                        className="flex-[2] rounded-xl bg-secondary py-2.5 text-[0.88rem] font-semibold text-white hover:bg-[#7c3aed] active:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors">
                        {formStatus === "submitting" ? <><Loader2 className="size-4 animate-spin" />Saving&hellip;</> : "Publish experience"}
                      </button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* testimonial grid */}
          {loading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-white/50">
              <Loader2 className="size-8 animate-spin" aria-hidden /><p className="text-clamp-small">Loading experiences&hellip;</p>
            </div>
          ) : loadError ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
              <MessageSquareQuote className="size-12 text-white/25" strokeWidth={1.25} />
              <p className="text-clamp-body max-w-sm text-white/55">{loadError}</p>
              <button type="button" onClick={() => void fetchExperiences()} className="text-clamp-small font-medium text-secondary underline-offset-2 hover:underline">Try again</button>
            </div>
          ) : experiences.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <MessageSquareQuote className="size-8 text-white/30" strokeWidth={1.25} />
              </div>
              <div>
                <p className="font-heading text-clamp-h3 font-semibold text-white/80">No experiences yet</p>
                <p className="text-clamp-body mt-2 max-w-sm text-white/45">Be the first to share feedback.</p>
              </div>
            </div>
          ) : (
            <>
              {/* featured card - first experience */}
              <div className="mb-10">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
                  <div className="absolute top-0 right-0 text-[12rem] leading-none text-white/[0.02] font-serif select-none pointer-events-none">&ldquo;</div>
                  <blockquote className="relative text-clamp-h3 font-light leading-relaxed tracking-tight text-white/90 max-w-4xl">
                    &ldquo;{experiences[0].quote}&rdquo;
                  </blockquote>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-white/10">
                      <Image src={experiences[0].image} alt={experiences[0].author} fill className="object-cover" sizes="56px" unoptimized />
                    </div>
                    <div>
                      <p className="font-medium text-white text-[1.05rem]">{experiences[0].author}</p>
                      <p className="text-[0.85rem] text-white/50">
                        {experiences[0].role || "Partner"}
                        {experiences[0].company ? <><span className="mx-2 text-white/20">/</span>{experiences[0].company}</> : null}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* remaining experiences in grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {experiences.slice(1).map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedId(selectedId === exp.id ? null : exp.id)}
                    className={`group relative text-left overflow-hidden rounded-xl border transition-all duration-300 p-6 ${
                      selectedId === exp.id
                        ? "border-hover/40 bg-white/[0.06]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="absolute top-2 right-3 text-[5rem] leading-none text-white/[0.015] font-serif select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-0">&ldquo;</div>
                    <div className="relative">
                      <blockquote className={`text-[0.9rem] leading-relaxed text-white/70 transition-all duration-300 ${
                        selectedId === exp.id ? "" : "line-clamp-4"
                      }`}>
                        &ldquo;{exp.quote}&rdquo;
                      </blockquote>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                          <Image src={exp.image} alt={exp.author} fill className="object-cover" sizes="40px" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.88rem] font-medium text-white truncate">{exp.author}</p>
                          <p className="text-[0.75rem] text-white/40 truncate">
                            {exp.role || "Partner"}
                            {exp.company ? <> &middot; {exp.company}</> : null}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
