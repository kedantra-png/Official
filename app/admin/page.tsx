"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Trash2, Plus, Eye, EyeOff, Loader2, RefreshCw,
  MessageSquareQuote, FolderKanban, LayoutDashboard,
  ChevronDown, ChevronUp, X, AlertCircle, CheckCircle2,
  Building2, Pencil, UploadCloud, Inbox, Mail, Download, Phone, Copy
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Review = {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  company: string | null;
  image_url: string | null;
  is_published: boolean;
  source: string;
  created_at: string;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  video_url: string | null;
  gallery_images: string[];
  features: string[];
  is_published: boolean;
  sort_order: number;
  created_at?: string;
};

type Tab = "dashboard" | "reviews" | "inquiries";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/[0.06] px-2 py-0.5 text-[10px] font-medium text-black/50 border border-black/8">
      {label}
    </span>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ok ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
      <span className={`size-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-400"}`} />
      {ok ? "Published" : "Draft"}
    </span>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "ok" | "err"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg text-sm font-medium ${type === "ok" ? "bg-white border-emerald-100 text-emerald-700" : "bg-white border-red-100 text-red-600"}`}>
      {type === "ok" ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
      {msg}
      <button onClick={onClose} className="ml-2 text-black/30 hover:text-black/60"><X className="size-3.5" /></button>
    </div>
  );
}

function ConfirmModal({
  title, message, onConfirm, onCancel,
}: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/8 shadow-2xl overflow-hidden p-6 text-center">
        <h3 className="font-serif font-bold text-lg text-black mb-2">{title}</h3>
        <p className="text-sm text-black/60 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.03] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Project Form ─────────────────────────────────────────────────────────

const INPUT = "w-full rounded-lg border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-sm text-black outline-none focus:border-black/30 focus:bg-white transition-colors placeholder:text-black/20 disabled:opacity-50";

// ─── File Uploader ─────────────────────────────────────────────────────────────

function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUpload(data.url);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} accept="image/*,video/*" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2.5 text-sm font-semibold text-black/60 hover:bg-black/5 hover:text-black transition-colors disabled:opacity-40 bg-white"
        title="Upload file directly to storage"
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </>
  );
}

// ─── Gallery Manager ─────────────────────────────────────────────────────────

function GalleryManager({
  images, onChange, disabled,
}: { images: string[]; onChange: (imgs: string[]) => void; disabled?: boolean }) {
  const [inputUrl, setInputUrl] = useState("");

  const add = () => {
    const url = inputUrl.trim();
    if (!url || images.includes(url)) return;
    onChange([...images, url]);
    setInputUrl("");
  };

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">
        Gallery Images <span className="normal-case font-normal">({images.length} added)</span>
      </label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group size-16 rounded-lg overflow-hidden border border-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold"
                disabled={disabled}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          className={`${INPUT} flex-1`}
          placeholder="https://example.com/screenshot.png"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={add}
          disabled={disabled || !inputUrl.trim()}
          className="shrink-0 rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold text-black/60 hover:bg-black/5 hover:text-black transition-colors disabled:opacity-40"
        >
          Add
        </button>
        <FileUpload onUpload={(url) => onChange([...images, url])} />
      </div>
      <p className="text-[10px] text-black/30">Press Enter or click Add to add each image URL. These appear in the project gallery.</p>
    </div>
  );
}

// ─── Add Project Modal ──────────────────────────────────────────────────────

function AddProjectModal({
  onClose, onAdded,
}: { onClose: () => void; onAdded: (p: Project) => void }) {
  const [form, setForm] = useState({
    title: "", category: "", description: "",
    image_url: "", video_url: "", tags: "", features: "",
    sort_order: "0", is_published: true,
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim() || null,
          video_url: form.video_url.trim() || null,
          gallery_images: galleryImages,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
          sort_order: parseInt(form.sort_order) || 0,
          is_published: form.is_published,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Failed to create project"); return; }
      onAdded(data.project);
      onClose();
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-black/8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/6">
          <h2 className="font-serif font-bold text-lg text-black">Add New Project</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5 transition-colors">
            <X className="size-4 text-black/40" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Title *</label>
              <input className={INPUT} placeholder="My Project" value={form.title} onChange={e => set("title", e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Category *</label>
              <input className={INPUT} placeholder="Web Application" value={form.category} onChange={e => set("category", e.target.value)} required disabled={loading} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea className={`${INPUT} resize-none`} rows={3} placeholder="Short project description…" value={form.description} onChange={e => set("description", e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider">Image URL <span className="normal-case font-normal">(optional)</span></label>
            <div className="flex gap-2">
              <input className={INPUT} placeholder="https://images.unsplash.com/…" value={form.image_url} onChange={e => set("image_url", e.target.value)} disabled={loading} />
              <FileUpload onUpload={(url) => set("image_url", url)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider">Video URL <span className="normal-case font-normal">(YouTube/Vimeo/MP4 - optional)</span></label>
            <div className="flex gap-2">
              <input className={INPUT} placeholder="https://www.youtube.com/watch?v=..." value={form.video_url} onChange={e => set("video_url", e.target.value)} disabled={loading} />
              <FileUpload onUpload={(url) => set("video_url", url)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Tags <span className="normal-case font-normal">(comma-separated)</span></label>
            <input className={INPUT} placeholder="AI, Analytics, Security" value={form.tags} onChange={e => set("tags", e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Features <span className="normal-case font-normal">(one per line)</span></label>
            <textarea className={`${INPUT} resize-none`} rows={3} placeholder={"Predictive Analytics Engine\nMulti-tenant Architecture\nAutomated Reporting"} value={form.features} onChange={e => set("features", e.target.value)} disabled={loading} />
          </div>
          <GalleryManager images={galleryImages} onChange={setGalleryImages} disabled={loading} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Sort Order</label>
              <input type="number" className={INPUT} placeholder="0" value={form.sort_order} onChange={e => set("sort_order", e.target.value)} min="0" disabled={loading} />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => set("is_published", !form.is_published)}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.is_published ? "bg-black" : "bg-black/20"}`}
                >
                  <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium text-black/70">Publish immediately</span>
              </label>
            </div>
          </div>
          {err && <p className="text-sm text-red-500/80 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
          <div className="flex gap-3 pt-2 border-t border-black/6">
            <button type="button" onClick={onClose} disabled={loading} className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.03] transition-colors disabled:opacity-40">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reviews Tab ─────────────────────────────────────────────────────────────

function ReviewsTab({ onToast }: { onToast: (msg: string, t: "ok" | "err") => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [warning, setWarning] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews ?? []);
      if (data.warning) setWarning(data.warning);
    } catch {
      onToast("Failed to load reviews", "err");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    const id = reviewToDelete;
    setReviewToDelete(null);
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setReviews(prev => prev.filter(r => r.id !== id));
      onToast("Review deleted", "ok");
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Delete failed", "err");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="size-7 animate-spin text-black/20" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif font-bold text-xl text-black">User Reviews</h2>
          <p className="text-xs text-black/40 mt-0.5">{reviews.length} total submission{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/50 hover:text-black hover:border-black/20 transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>
      </div>

      {warning && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span><strong>Setup needed:</strong> {warning} Add <code className="font-mono bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to your .env.local to view reviews.</span>
        </div>
      )}

      {reviews.length === 0 && !warning ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-20 text-center">
          <MessageSquareQuote className="size-10 text-black/10 mb-3" strokeWidth={1.25} />
          <p className="text-sm font-medium text-black/40">No reviews yet</p>
          <p className="text-xs text-black/25 mt-1">Reviews submitted by users will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="group rounded-xl border border-black/8 bg-white p-5 hover:border-black/15 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {r.image_url && (
                    <div className="shrink-0 size-12 rounded-full overflow-hidden border border-black/10 bg-black/5 mt-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.image_url} alt={r.author} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-black/70 leading-relaxed line-clamp-3 mb-3 italic">
                      &ldquo;{r.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-black">{r.author}</span>
                      {r.role && <span className="text-xs text-black/40">{r.role}</span>}
                      {r.company && <span className="text-xs text-black/40">@ {r.company}</span>}
                      <StatusBadge ok={r.is_published} />
                      <span className="text-[10px] text-black/25">{fmtDate(r.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingReview(r)}
                    className="rounded-lg border border-black/10 bg-white p-2 text-black/50 hover:bg-black/5 hover:text-black transition-all"
                    title="Edit review"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setReviewToDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all disabled:opacity-40"
                    title="Delete review"
                  >
                    {deletingId === r.id
                      ? <Loader2 className="size-3.5 animate-spin" />
                      : <Trash2 className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onUpdated={(updatedReview) => {
            setReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
            onToast("Review updated successfully", "ok");
          }}
        />
      )}

      {reviewToDelete && (
        <ConfirmModal
          title="Delete Review"
          message="Delete this review? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setReviewToDelete(null)}
        />
      )}
    </div>
  );
}

function EditReviewModal({
  review, onClose, onUpdated
}: { review: Review; onClose: () => void; onUpdated: (r: Review) => void }) {
  const [form, setForm] = useState({
    quote: review.quote,
    author: review.author,
    role: review.role || "",
    company: review.company || "",
    image_url: review.image_url || "",
    is_published: review.is_published,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: review.id,
          quote: form.quote.trim(),
          author: form.author.trim(),
          role: form.role.trim() || null,
          company: form.company.trim() || null,
          image_url: form.image_url.trim() || null,
          is_published: form.is_published,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Failed to update review"); return; }
      onUpdated(data.review);
      onClose();
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-black/8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/6 shrink-0">
          <h2 className="font-serif font-bold text-lg text-black">Edit Review</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5 transition-colors">
            <X className="size-4 text-black/40" />
          </button>
        </div>
        <form id="edit-review-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Quote *</label>
            <textarea className={`${INPUT} min-h-[80px] resize-y py-2.5`} placeholder="This product is amazing!" value={form.quote} onChange={e => set("quote", e.target.value)} required disabled={loading} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Author Name *</label>
              <input className={INPUT} placeholder="Jane Doe" value={form.author} onChange={e => set("author", e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Role</label>
              <input className={INPUT} placeholder="CEO" value={form.role} onChange={e => set("role", e.target.value)} disabled={loading} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Company</label>
            <input className={INPUT} placeholder="Acme Corp" value={form.company} onChange={e => set("company", e.target.value)} disabled={loading} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider">Image URL <span className="normal-case font-normal">(optional)</span></label>
            <div className="flex gap-2">
              <input className={INPUT} placeholder="https://example.com/avatar.jpg" value={form.image_url} onChange={e => set("image_url", e.target.value)} disabled={loading} />
              <FileUpload onUpload={(url) => set("image_url", url)} />
            </div>
          </div>
          <div className="flex flex-col justify-end pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div onClick={() => set("is_published", !form.is_published)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.is_published ? "bg-black" : "bg-black/20"}`}>
                <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-sm font-medium text-black/70">Published</span>
            </label>
          </div>
          {err && <p className="text-sm text-red-500/80 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
        </form>
        <div className="flex gap-3 px-6 py-4 border-t border-black/6 shrink-0 bg-black/[0.02]">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.03] transition-colors disabled:opacity-40">Cancel</button>
          <button form="edit-review-form" type="submit" disabled={loading} className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Projects Tab ─────────────────────────────────────────────────────────────

function ProjectsTab({ onToast }: { onToast: (msg: string, t: "ok" | "err") => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [warning, setWarning] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.projects ?? []);
      if (data.warning) setWarning(data.warning);
    } catch {
      onToast("Failed to load projects", "err");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => { load(); }, [load]);

  // Also update toggle to use returned project data
  const handleTogglePublish = async (p: Project) => {
    setTogglingId(p.id);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_published: !p.is_published }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_published: !x.is_published } : x));
      onToast(`Project ${!p.is_published ? "published" : "unpublished"}`, "ok");
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Toggle failed", "err");
    } finally {
      setTogglingId(null);
    }
  };

  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete;
    setProjectToDelete(null);
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setProjects(prev => prev.filter(p => p.id !== id));
      onToast("Project deleted", "ok");
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Delete failed", "err");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="size-7 animate-spin text-black/20" />
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif font-bold text-xl text-black">Projects</h2>
          <p className="text-xs text-black/40 mt-0.5">
            {projects.filter(p => p.is_published).length} published · {projects.length} total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={load} className="flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black/50 hover:text-black hover:border-black/20 transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/90 transition-colors"
          >
            <Plus className="size-3.5" /> Add Project
          </button>
        </div>
      </div>

      {warning && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span><strong>Setup needed:</strong> {warning} Add <code className="font-mono bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to your .env.local to manage projects.</span>
        </div>
      )}

      {projects.length === 0 && !warning ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 py-20 text-center">
          <FolderKanban className="size-10 text-black/10 mb-3" strokeWidth={1.25} />
          <p className="text-sm font-medium text-black/40">No projects yet</p>
          <p className="text-xs text-black/25 mt-1 mb-4">Add a project to display it on the homepage</p>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-black/85 transition-colors">
            <Plus className="size-3.5" /> Add First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="group rounded-xl border border-black/8 bg-white hover:border-black/15 transition-colors overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Image thumbnail */}
                  {p.image_url ? (
                    <div className="shrink-0 size-14 rounded-lg overflow-hidden border border-black/6 bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="shrink-0 size-14 rounded-lg border border-dashed border-black/10 bg-black/[0.02] flex items-center justify-center">
                      <FolderKanban className="size-5 text-black/15" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-serif font-bold text-sm text-black">{p.title}</span>
                      <StatusBadge ok={p.is_published} />
                    </div>
                    <p className="text-xs text-black/40 mb-2">{p.category}</p>
                    <p className="text-xs text-black/55 leading-relaxed line-clamp-2">{p.description}</p>
                    {p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.map(t => <TagBadge key={t} label={t} />)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingProject(p)}
                    className="rounded-lg border border-black/10 bg-white p-1.5 text-black/50 hover:bg-black/5 hover:text-black transition-colors"
                    title="Edit project"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(p)}
                    disabled={togglingId === p.id}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5 ${p.is_published ? "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100" : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                    title={p.is_published ? "Unpublish" : "Publish"}
                  >
                    {togglingId === p.id
                      ? <Loader2 className="size-3 animate-spin" />
                      : p.is_published
                        ? <><EyeOff className="size-3" /> Unpublish</>
                        : <><Eye className="size-3" /> Publish</>}
                  </button>
                  <button
                    onClick={() => setProjectToDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                    title="Delete project"
                  >
                    {deletingId === p.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddProjectModal
          onClose={() => setShowModal(false)}
          onAdded={(p) => {
            setProjects(prev => [p, ...prev]);
            onToast("Project added!", "ok");
          }}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={(updated) => {
            setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
            onToast("Project updated!", "ok");
          }}
        />
      )}

      {projectToDelete && (
        <ConfirmModal
          title="Delete Project"
          message="Delete this project permanently?"
          onConfirm={confirmDelete}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
}

// ─── Edit Project Modal ───────────────────────────────────────────────────────

function EditProjectModal({
  project, onClose, onUpdated,
}: { project: Project; onClose: () => void; onUpdated: (p: Project) => void }) {
  const [form, setForm] = useState({
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    image_url: project.image_url || "",
    video_url: project.video_url || "",
    tags: (project.tags ?? []).join(", "),
    features: (project.features ?? []).join("\n"),
    sort_order: String(project.sort_order ?? 0),
    is_published: project.is_published,
  });
  const [galleryImages, setGalleryImages] = useState<string[]>(project.gallery_images ?? []);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const slug = form.slug.trim() ||
        form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          title: form.title.trim(),
          slug,
          category: form.category.trim(),
          description: form.description.trim(),
          image_url: form.image_url.trim() || null,
          video_url: form.video_url.trim() || null,
          gallery_images: galleryImages,
          tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
          features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
          sort_order: parseInt(form.sort_order) || 0,
          is_published: form.is_published,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Failed to update project"); return; }
      onUpdated(data.project);
      onClose();
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-black/8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/6 shrink-0">
          <div>
            <h2 className="font-serif font-bold text-lg text-black">Edit Project</h2>
            <p className="text-xs text-black/40 mt-0.5">{project.title}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-black/5 transition-colors">
            <X className="size-4 text-black/40" />
          </button>
        </div>
        <form id="edit-project-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Title *</label>
              <input className={INPUT} value={form.title} onChange={e => set("title", e.target.value)} required disabled={loading} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Category *</label>
              <input className={INPUT} value={form.category} onChange={e => set("category", e.target.value)} required disabled={loading} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Slug</label>
            <input className={INPUT} placeholder="auto-generated from title" value={form.slug} onChange={e => set("slug", e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea className={`${INPUT} resize-none`} rows={3} value={form.description} onChange={e => set("description", e.target.value)} required disabled={loading} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider">Image URL <span className="normal-case font-normal">(optional)</span></label>
            <div className="flex gap-2">
              <input className={INPUT} placeholder="https://images.unsplash.com/…" value={form.image_url} onChange={e => set("image_url", e.target.value)} disabled={loading} />
              <FileUpload onUpload={(url) => set("image_url", url)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider">Video URL <span className="normal-case font-normal">(YouTube/Vimeo/MP4 - optional)</span></label>
            <div className="flex gap-2">
              <input className={INPUT} placeholder="https://www.youtube.com/watch?v=..." value={form.video_url} onChange={e => set("video_url", e.target.value)} disabled={loading} />
              <FileUpload onUpload={(url) => set("video_url", url)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Tags <span className="normal-case font-normal">(comma-separated)</span></label>
            <input className={INPUT} placeholder="React, Node.js, PostgreSQL" value={form.tags} onChange={e => set("tags", e.target.value)} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Features <span className="normal-case font-normal">(one per line)</span></label>
            <textarea className={`${INPUT} resize-none`} rows={4} placeholder={"Feature one\nFeature two\nFeature three"} value={form.features} onChange={e => set("features", e.target.value)} disabled={loading} />
          </div>
          <GalleryManager images={galleryImages} onChange={setGalleryImages} disabled={loading} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-black/50 uppercase tracking-wider mb-1.5">Sort Order</label>
              <input type="number" className={INPUT} value={form.sort_order} onChange={e => set("sort_order", e.target.value)} min="0" disabled={loading} />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2.5 cursor-pointer select-none mb-2">
                <div onClick={() => set("is_published", !form.is_published)} className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.is_published ? "bg-black" : "bg-black/20"}`}>
                  <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.is_published ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-medium text-black/70">Published</span>
              </label>
            </div>
          </div>
          {err && <p className="text-sm text-red-500/80 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
        </form>
        <div className="flex gap-3 px-6 py-4 border-t border-black/6 shrink-0 bg-black/[0.02]">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.03] transition-colors disabled:opacity-40">Cancel</button>
          <button form="edit-project-form" type="submit" disabled={loading} className="flex-1 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inquiries Tab ────────────────────────────────────────────────────────────

type Inquiry = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  inquiry_type: string;
  message: string;
  status: "new" | "read" | "resolved";
  source: string;
  created_at: string;
};

function InquiriesTab({ onToast }: { onToast: (msg: string, t: "ok" | "err") => void }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onToast("Copied to clipboard", "ok");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (res.ok) {
        setInquiries(data.inquiries ?? []);
      } else {
        onToast(data.error ?? "Failed to load inquiries", "err");
      }
    } catch {
      onToast("Network error loading inquiries", "err");
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);
  
  const exportToExcel = () => {
    if (inquiries.length === 0) {
      onToast("No inquiries to export", "err");
      return;
    }

    // Prepare headers
    const headers = ["Inquiry ID", "Phone Number", "Email Address", "Type", "Message Content", "Status", "Source", "Date Received"];
    
    // Map rows and escape quotes/newlines
    const rows = inquiries.map((inq) => [
      inq.id,
      inq.phone || "",
      inq.email || "",
      inq.inquiry_type,
      inq.message.replace(/"/g, '""').replace(/\r?\n|\r/g, " "),
      inq.status,
      inq.source,
      fmtDate(inq.created_at),
    ]);

    // Construct CSV file data
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    // File download trigger
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" }); // include UTF-8 BOM
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Oordhwa_Inquiries_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onToast("Excel CSV export downloaded", "ok");
  };

  const handleUpdateStatus = async (id: string, status: "new" | "read" | "resolved") => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
        onToast(`Inquiry marked as ${status}`, "ok");
      } else {
        onToast("Failed to update status", "err");
      }
    } catch {
      onToast("Network error updating status", "err");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== deleteId));
        onToast("Inquiry deleted successfully", "ok");
      } else {
        onToast("Failed to delete inquiry", "err");
      }
    } catch {
      onToast("Network error deleting inquiry", "err");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-xl text-black">Get In Touch Submissions</h2>
          <p className="text-xs text-black/50 mt-0.5">{inquiries.length} total messages received</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50/50 px-3 py-2 text-xs font-semibold text-cyan-700 hover:bg-cyan-100/60 transition-colors"
          >
            <Download className="size-3.5" /> Export Excel
          </button>
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-black/30" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white p-12 text-center">
          <Inbox className="size-10 text-black/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-black/60">No contact messages yet</p>
          <p className="text-xs text-black/40 mt-1">Submissions from the website &quot;Get In Touch&quot; form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div key={inq.id} className="rounded-xl border border-black/8 bg-white p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/6 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center font-semibold text-xs text-cyan-700 uppercase">
                    {inq.phone ? (
                      <Phone className="size-3.5 text-cyan-700" />
                    ) : inq.name ? (
                      inq.name.substring(0, 2)
                    ) : (
                      "📞"
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-black flex items-center gap-1.5">
                      {inq.phone ? (
                        <>
                          <Phone className="size-3.5 text-black/40" />
                          <span className="font-mono">{inq.phone}</span>
                          <button
                            onClick={() => handleCopy(inq.phone!, inq.id + "-phone")}
                            className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black/70 transition-all flex items-center justify-center"
                            title="Copy Phone Number"
                          >
                            {copiedId === inq.id + "-phone" ? (
                              <CheckCircle2 className="size-3 text-emerald-600 animate-pulse" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </>
                      ) : (
                        inq.name || "Website Visitor"
                      )}
                    </h3>
                    {inq.email && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <a href={`mailto:${inq.email}`} className="text-xs text-cyan-600 hover:underline flex items-center gap-1">
                          <Mail className="size-3" /> {inq.email}
                        </a>
                        <button
                          onClick={() => handleCopy(inq.email!, inq.id + "-email")}
                          className="p-1 rounded hover:bg-black/5 text-black/40 hover:text-black/70 transition-all flex items-center justify-center"
                          title="Copy Email Address"
                        >
                          {copiedId === inq.id + "-email" ? (
                            <CheckCircle2 className="size-3 text-emerald-600 animate-pulse" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    inq.status === "resolved"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : inq.status === "read"
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    <span className={`size-1.5 rounded-full ${
                      inq.status === "resolved" ? "bg-emerald-500" : inq.status === "read" ? "bg-blue-500" : "bg-amber-400"
                    }`} />
                    {inq.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-black/40">{fmtDate(inq.created_at)}</span>
                </div>
              </div>

              <p className="text-sm text-black/80 whitespace-pre-wrap leading-relaxed bg-black/[0.015] p-3 rounded-lg border border-black/5">
                {inq.message}
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-black/40 uppercase tracking-wider">Status:</span>
                  {(["new", "read", "resolved"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(inq.id, st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        inq.status === st
                          ? "bg-black text-white"
                          : "bg-black/5 text-black/50 hover:bg-black/10"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setDeleteId(inq.id)}
                  className="p-1.5 text-black/30 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Inquiry"
          message="Are you sure you want to delete this message? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState({ projects: 0, reviews: 0, inquiries: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
  }, []);

  // Verify authentication state on mount
  useEffect(() => {
    fetch("/api/admin/verify")
      .then((r) => {
        if (r.ok) setAuthenticated(true);
        else setAuthenticated(false);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setAuthenticated(false);
    }
  };

  // Load stats when authenticated
  useEffect(() => {
    if (!authenticated) return;
    setStatsLoading(true);
    Promise.all([
      fetch("/api/admin/reviews").then(r => r.json()).catch(() => ({ reviews: [] })),
      fetch("/api/admin/inquiries").then(r => r.json()).catch(() => ({ inquiries: [] })),
    ]).then(([rData, iData]) => {
      setStats({
        projects: 0,
        reviews: (rData.reviews ?? []).length,
        inquiries: (iData.inquiries ?? []).length,
      });
    }).finally(() => setStatsLoading(false));
  }, [authenticated]);

  const handleImageClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setShowLogin(true);
      return;
    }
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 1500);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, route: "/admin" }),
      });
      const data = await res.json();
      if (res.ok) { setAuthenticated(true); setShowLogin(false); }
      else { setLoginError(data.error ?? "Invalid credentials"); }
    } catch {
      setLoginError("Connection error. Try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Authenticated dashboard ──────────────────────────────────────────────
  if (authenticated) {
    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-3.5" /> },
      { id: "reviews", label: "Reviews", icon: <MessageSquareQuote className="size-3.5" /> },
      { id: "inquiries", label: "Inquiries", icon: <Inbox className="size-3.5" /> },
    ];

    return (
      <div className="select-none min-h-screen bg-[#f9f9f8] font-serif text-black">
        {/* Sidebar */}
        <div className="flex min-h-screen">
          <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-black/8 px-4 py-8">
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-2 mb-3 group hover:opacity-90 transition-opacity">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/oordhwa-icon.png"
                  alt="Oordhwa Tech Solutions"
                  className="size-8 object-contain shrink-0 drop-shadow-[0_0_10px_rgba(6,182,212,0.45)]"
                />
                <div className="flex flex-col leading-none select-none">
                  <span className="font-ethnocentric text-xs tracking-[0.14em] text-black leading-none flex items-center">
                    OORDHW
                    <span className="inline-flex items-center justify-center -ml-[0.03em] relative">
                      <svg
                        className="h-[9px] w-auto shrink-0 translate-y-[0.5px]"
                        viewBox="0 0 20 18"
                        fill="none"
                      >
                        <path d="M10 0L20 18H14.8L10 9.2L5.2 18H0L10 0Z" fill="black" />
                        <path d="M8.1 13.5H11.9L14.0 17.5H6.0L8.1 13.5Z" fill="url(#admin-a-core-grad)" />
                        <defs>
                          <linearGradient id="admin-a-core-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00d2ff" />
                            <stop offset="100%" stopColor="#0066ff" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </span>
                  <span className="font-sans font-extrabold text-[7.5px] tracking-[0.24em] uppercase leading-none bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#a855f7] bg-clip-text text-transparent mt-1">
                    Tech Solutions
                  </span>
                </div>
              </Link>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-semibold text-black/60 border border-black/8 w-fit">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Admin Panel
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${activeTab === t.id ? "bg-black text-white" : "text-black/50 hover:text-black hover:bg-black/[0.04]"}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-black/30 hover:text-black/60 hover:bg-black/[0.03] transition-colors"
              >
                <X className="size-3.5" /> Sign out
              </button>
            </div>
          </aside>

          {/* Mobile tab bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-black/8 flex">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${activeTab === t.id ? "text-black" : "text-black/30"}`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-4xl px-6 sm:px-10 pt-10 pb-24 md:pb-12">
              {/* Header */}
              <div className="mb-8">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-black/35 uppercase mb-1">Admin Panel</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-black capitalize">{activeTab}</h1>
              </div>

              {/* Stats (always visible) */}
              {activeTab === "dashboard" && (
                <>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 mb-8">
                    <div onClick={() => setActiveTab("reviews")} className="rounded-xl border border-black/8 bg-white p-5 cursor-pointer hover:border-black/20 transition-colors">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40">User Reviews</p>
                      <p className="text-3xl font-bold mt-2 text-black">{statsLoading ? "…" : stats.reviews}</p>
                    </div>
                    <div onClick={() => setActiveTab("inquiries")} className="rounded-xl border border-black/8 bg-white p-5 cursor-pointer hover:border-black/20 transition-colors">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40">Inquiries</p>
                      <p className="text-3xl font-bold mt-2 text-black">{statsLoading ? "…" : stats.inquiries}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/8 bg-white p-6 mb-6">
                    <h2 className="text-sm font-bold text-black mb-3">Quick Actions</h2>
                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setActiveTab("reviews")} className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black/60 hover:text-black hover:border-black/20 hover:bg-black/[0.02] transition-colors">
                        <MessageSquareQuote className="size-4" /> View Reviews
                      </button>
                      <button onClick={() => setActiveTab("inquiries")} className="flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black/60 hover:text-black hover:border-black/20 hover:bg-black/[0.02] transition-colors">
                        <Inbox className="size-4" /> View Inquiries
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "reviews" && <ReviewsTab onToast={showToast} />}
              {activeTab === "inquiries" && <InquiriesTab onToast={showToast} />}
            </div>
          </main>
        </div>

        {toast && (
          <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    );
  }

  // ── Login / 404 screen ───────────────────────────────────────────────────
  return (
    <section className="select-none bg-white font-serif min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain cursor-pointer"
              onClick={handleImageClick}
              aria-hidden="true"
            >
              <h1
                className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 cursor-pointer select-none hover:opacity-80 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogin(true);
                }}
                title="Click to access Admin Portal"
              >
                404
              </h1>
            </div>
            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">Look like you&apos;re lost</h3>
              <p className="mb-6 text-black sm:mb-5">The page you are looking for is not available!</p>
              <Button variant="default" asChild className="my-5 bg-green-600 hover:bg-green-700">
                <Link href="/">Go to OORDHWA</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-lg border border-black/10 bg-white p-6 shadow-2xl">
            <h2 className="font-serif text-lg font-bold text-black mb-5">Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-black/50 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-black/10 bg-black/[0.02] px-3.5 py-2.5 text-sm text-black outline-none focus:border-black/30 transition-colors placeholder:text-black/20"
                  placeholder="oordhwa2026@gmail.com" required />
              </div>
              <div>
                <label className="block text-xs text-black/50 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-black/[0.02] pl-3.5 pr-10 py-2.5 text-sm text-black outline-none focus:border-black/30 transition-colors placeholder:text-black/20"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/70 focus:outline-none p-1 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {loginError && <p className="text-sm text-red-500/80">{loginError}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowLogin(false); setLoginError(""); setShowPassword(false); }}
                  className="flex-1 rounded-lg border border-black/10 px-4 py-2.5 text-sm text-black/50 hover:bg-black/[0.02] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loginLoading}
                  className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition-colors disabled:opacity-50">
                  {loginLoading ? "Validating..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
