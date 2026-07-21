"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Dialog        = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal  = DialogPrimitive.Portal;
const DialogClose   = DialogPrimitive.Close;

/* ── Overlay ────────────────────────────────────────────────────── */
const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-md",
      "data-[state=open]:animate-[dialog-overlay-in_220ms_ease_forwards]",
      "data-[state=closed]:animate-[dialog-overlay-out_180ms_ease_forwards]",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/*
  ── Content ──────────────────────────────────────────────────────

  TWO positional wrappers inside one portal:

  1. SHEET wrapper  (< lg):  fixed inset-x-0 bottom-0, top gap = 3rem
     → sheet slides up from bottom, touches left/right/bottom edges

  2. CENTER wrapper (≥ lg):  fixed inset-0 flex items-center justify-center p-6
     → landscape card floats in the true center

  Only one is visible at a time via responsive display classes.
  The DialogPrimitive.Content lives inside both so Radix can manage
  open/close state; we use `asChild`-style wrapping via a wrapper div
  to avoid double-mounting — instead we render ONE Content element
  inside ONE wrapper, and swap the wrapper's CSS at the breakpoint.
*/
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  /* preventScroll={false} — we handle our own scroll lock in the component */
  <DialogPortal>
    <DialogOverlay />

    {/*
      Combined wrapper:
      - Below lg  → sheet: fixed, bottom-0, inset-x-0, top=3rem, flex-col justify-end
      - At lg+    → center: flex items-center justify-center p-6
      pointer-events-none so the dimmer overlay receives outside-click
    */}
    <div
      className={cn(
        "fixed z-50 pointer-events-none overflow-hidden",
        /* sheet mode < lg */
        "inset-x-0 bottom-0 top-12 flex flex-col justify-end",
        /* center mode ≥ lg */
        "lg:inset-0 lg:top-0 lg:flex-row lg:items-center lg:justify-center lg:p-6",
      )}
    >
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "pointer-events-auto relative w-full focus:outline-none",
          /* sheet shape < lg: rounded top only, no bottom radius, full width */
          "rounded-t-2xl rounded-b-none",
          /* center shape ≥ lg: all corners rounded, max-width */
          "lg:rounded-2xl lg:max-w-3xl",
          /* sheet open/close */
          "data-[state=open]:animate-[dialog-sheet-in_320ms_cubic-bezier(0.32,0.72,0,1)_forwards]",
          "data-[state=closed]:animate-[dialog-sheet-out_220ms_ease_forwards]",
          /* override to scale animation on lg+ */
          "lg:data-[state=open]:animate-[dialog-content-in_300ms_cubic-bezier(0.34,1.4,0.64,1)_forwards]",
          "lg:data-[state=closed]:animate-[dialog-content-out_200ms_ease_forwards]",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

/* ── Sub-components ─────────────────────────────────────────────── */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-heading text-[1.1rem] font-semibold leading-snug text-white", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[0.85rem] leading-relaxed text-white/50", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
