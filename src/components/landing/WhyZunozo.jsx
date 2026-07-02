import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── helpers ─── */

/**
 * Build an elegant S-curve SVG path that weaves through the
 * measured midpoints of each step card inside the timeline wrapper.
 *
 * @param {Array<{x:number, y:number}>} points – anchor points
 * @param {number} amplitude – horizontal curve offset (px)
 * @returns {string} SVG path `d` attribute
 */
const buildSCurvePath = (points, amplitude = 200) => {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midY = (curr.y + next.y) / 2;
    // alternate direction each segment
    const dir = i % 2 === 0 ? 1 : -1;
    const cpX = curr.x + amplitude * dir;
    d += ` C ${cpX} ${midY}, ${next.x - amplitude * dir} ${midY}, ${next.x} ${next.y}`;
  }
  return d;
};

const WhyZunozo = () => {
  /* ─── refs ─── */
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const mobilePathRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const ctaRef = useRef(null);

  /* node refs – the small circles at each anchor */
  const nodeRefs = useRef([]);

  const [pathD, setPathD] = useState("");
  const [mobilePathD, setMobilePathD] = useState("");
  const [anchorPoints, setAnchorPoints] = useState([]);
  const [wrapperHeight, setWrapperHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* ─── measure card positions & compute path ─── */
  const computePath = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);

    const wRect = wrapper.getBoundingClientRect();
    setWrapperHeight(wRect.height);

    const cards = [step1Ref, step2Ref, step3Ref, step4Ref, ctaRef];
    const points = cards
      .map((ref) => {
        if (!ref.current) return null;
        const r = ref.current.getBoundingClientRect();
        return {
          // position relative to wrapper
          x: r.left - wRect.left + r.width / 2,
          y: r.top - wRect.top + r.height / 2,
        };
      })
      .filter(Boolean);

    if (points.length < 2) return;

    setAnchorPoints(points);

    if (mobile) {
      // Centered vertical line through midpoints
      const centerX = wRect.width / 2;
      const mobilePoints = points.map((p) => ({ ...p, x: centerX }));
      let md = `M ${mobilePoints[0].x} ${mobilePoints[0].y}`;
      for (let i = 1; i < mobilePoints.length; i++) {
        md += ` L ${mobilePoints[i].x} ${mobilePoints[i].y}`;
      }
      setMobilePathD(md);
      setPathD("");
    } else {
      // Elegant S-curve for desktop / tablet
      const amplitude = window.innerWidth < 1280 ? 120 : 200;
      setPathD(buildSCurvePath(points, amplitude));
      setMobilePathD("");
    }
  }, []);

  /* ─── on mount: measure + animate ─── */
  useEffect(() => {
    // Wait a frame so the DOM has painted
    const raf = requestAnimationFrame(() => {
      computePath();
    });

    const onResize = () => {
      computePath();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [computePath]);

  /* ─── GSAP animations (runs after path is computed) ─── */
  useEffect(() => {
    const activePathRef = isMobile ? mobilePathRef : pathRef;
    const activePath = activePathRef.current;
    const wrapper = wrapperRef.current;

    if (!activePath || !wrapper) return;

    const pathLength = activePath.getTotalLength();

    gsap.set(activePath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    /*
     * ScrollTrigger end is calculated dynamically:
     *   - "start" fires when the wrapper's top hits 60% of the viewport
     *   - "end" fires when the CTA (last child) reaches 50% of the viewport
     *
     * We use the CTA's offsetTop + its height to compute the exact
     * pixel distance within the wrapper, then express it as
     * "top+<distance>px 50%" so GSAP resolves it in real units.
     *
     * scrub: true  → animation progress is mapped 1:1 to scroll
     *                position with ZERO lag (no trailing delay).
     */
    const ctaEl = ctaRef.current;
    const endOffset = ctaEl
      ? ctaEl.offsetTop + ctaEl.offsetHeight
      : wrapper.scrollHeight;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 60%",
        end: `top+=${endOffset}px 50%`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tl.to(activePath, {
      strokeDashoffset: 0,
      ease: "none",
    });

    // Animate anchor nodes (scale in)
    nodeRefs.current.forEach((node) => {
      if (!node) return;
      gsap.set(node, { scale: 0, transformOrigin: "center" });
    });

    // Animate cards & nodes sequentially
    const cards = [step1Ref, step2Ref, step3Ref, step4Ref, ctaRef];
    cards.forEach((cardRef, i) => {
      if (!cardRef.current) return;
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Scale in the corresponding node
      const node = nodeRefs.current[i];
      if (node) {
        gsap.to(node, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    });

    // Refresh after a tick so measurements are accurate post-layout
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathD, mobilePathD, isMobile]);

  /* ─── JSX ─── */
  return (
    <section className="relative py-32 px-6 bg-[#09090B] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* ─── Section Heading (UNCHANGED) ─── */}
        <div className="text-center mb-32">
          <p className="text-zinc-500 text-sm uppercase tracking-wider mb-4">
            How Zunozo Works
          </p>
          <h2 className="font-['Anton'] text-6xl md:text-7xl lg:text-8xl text-white uppercase leading-none mb-6">
            FROM
            <br />
            DISCOVERING EVENTS
            <br />
            <span className="text-zinc-400">TO MAKING</span>
            <br />
            MEMORIES
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Your journey from finding the perfect event to creating
            unforgettable moments
          </p>
        </div>

        {/* ═══════════════════════════════════════════
            TIMELINE WRAPPER — SVG + cards live here
        ═══════════════════════════════════════════ */}
        <div ref={wrapperRef} className="relative">
          {/* Desktop / Tablet SVG */}
          {pathD && (
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full pointer-events-none hidden lg:block"
              style={{ height: wrapperHeight || "100%", zIndex: 0 }}
              preserveAspectRatio="none"
              viewBox={`0 0 ${wrapperRef.current?.offsetWidth || 1200} ${wrapperHeight || 1}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={pathRef}
                d={pathD}
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,0.12))",
                }}
              />
              {/* Metro-map anchor nodes */}
              {anchorPoints.map((pt, i) => (
                <circle
                  key={i}
                  ref={(el) => (nodeRefs.current[i] = el)}
                  cx={pt.x}
                  cy={pt.y}
                  r="8"
                  fill="#09090B"
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="3"
                />
              ))}
            </svg>
          )}

          {/* Mobile SVG — centered vertical line */}
          {mobilePathD && (
            <svg
              className="absolute inset-0 w-full pointer-events-none lg:hidden"
              style={{ height: wrapperHeight || "100%", zIndex: 0 }}
              preserveAspectRatio="none"
              viewBox={`0 0 ${wrapperRef.current?.offsetWidth || 400} ${wrapperHeight || 1}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={mobilePathRef}
                d={mobilePathD}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Mobile anchor nodes */}
              {anchorPoints.map((pt, i) => {
                const cx =
                  (wrapperRef.current?.offsetWidth || 400) / 2;
                return (
                  <circle
                    key={i}
                    ref={(el) =>
                      (nodeRefs.current[i] = el)
                    }
                    cx={cx}
                    cy={pt.y}
                    r="6"
                    fill="#09090B"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          )}

          {/* ─── Step 1 — Discover (UNCHANGED card design) ─── */}
          <div
            ref={step1Ref}
            className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
            style={{ zIndex: 1 }}
          >
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
                <span className="text-zinc-400 text-sm">Step 1</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Discover
                <br />
                Events
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                Find concerts, house parties, run clubs, workshops and hidden
                experiences curated just for you. No more endless scrolling.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-zinc-500 text-sm">Live Events</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-zinc-500 text-sm">Cities</p>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-9/16 max-w-xs mx-auto bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-white/10">
                <div className="w-full h-full bg-linear-to-br from-purple-600/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white/50">
                    Event Discovery UI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Step 2 — Book (UNCHANGED card design) ─── */}
          <div
            ref={step2Ref}
            className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
            style={{ zIndex: 1 }}
          >
            <div className="relative order-1">
              <div className="aspect-16/10 bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="w-full h-full bg-linear-to-br from-orange-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white/50">
                    Booking Interface
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-2">
              <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
                <span className="text-zinc-400 text-sm">Step 2</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Book
                <br />
                Instantly
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                Reserve your seat in seconds. Secure payment, instant
                confirmation. Your ticket is ready before you know it.
              </p>
              <button className="inline-flex items-center gap-2 text-white hover:text-zinc-300 transition">
                <span>See how it works</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* ─── Step 3 — Get Ticket (UNCHANGED card design) ─── */}
          <div
            ref={step3Ref}
            className="relative grid lg:grid-cols-2 gap-16 items-center mb-48"
            style={{ zIndex: 1 }}
          >
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
                <span className="text-zinc-400 text-sm">Step 3</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Get Your
                <br />
                Ticket
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                QR ticket delivered instantly. Track your booking status. Set
                reminders. Everything you need in one place.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                  QR Code
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                  Countdown
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full text-zinc-400 text-sm">
                  Reminders
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="aspect-9/16 max-w-xs mx-auto bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-white/10">
                <div className="w-full h-full bg-linear-to-br from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white/50">Ticket UI</div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Step 4 — Enjoy (UNCHANGED card design) ─── */}
          <div
            ref={step4Ref}
            className="relative grid lg:grid-cols-2 gap-16 items-center mb-32"
            style={{ zIndex: 1 }}
          >
            <div className="relative order-1">
              <div className="aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="w-full h-full bg-linear-to-br from-orange-500/30 to-purple-600/30 flex items-center justify-center">
                  <div className="text-center text-white/50">
                    Event Experience
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-2">
              <div className="inline-block px-4 py-1 bg-white/5 rounded-full">
                <span className="text-zinc-400 text-sm">Step 4</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Enjoy
                <br />
                Together
              </h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                Meet people, join communities, create memories. This is where
                the magic happens.
              </p>
              <div className="pt-4">
                <p className="text-sm text-zinc-500 mb-2">
                  Join thousands already creating memories
                </p>
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-orange-500 border-2 border-zinc-900"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-400">
                    +2k
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Final CTA (UNCHANGED design) ─── */}
          <div
            ref={ctaRef}
            className="text-center pt-16"
            style={{ zIndex: 1 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your journey?
            </h3>
            <button className="inline-flex items-center justify-center gap-2 px-10 h-14 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-lg">
              Explore Events
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* ─── END Timeline Wrapper ─── */}
      </div>
    </section>
  );
};

export default WhyZunozo;
