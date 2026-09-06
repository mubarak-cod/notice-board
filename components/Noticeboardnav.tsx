"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationBell from "@/components/NotificationBell";
import { supabase } from "@/lib/supabase/client";

/* ---------- MAPOLY brand theme ---------- */
const THEME = {
  primary: "#42154B",
  primaryDark: "#33103A",
  accent: "#FF8D27",
  onPrimary: "#FFFFFF",
};

/* ---------- Custom SVG icons (hand-drawn, no icon library) ---------- */

interface MenuIconProps {
  open: boolean;
}

const MenuIcon = ({ open }: MenuIconProps) => (
  <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1={open ? 11 : 5.5} x2={open ? 19 : 19} y2={open ? 11 : 5.5}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      style={{ transformOrigin: "11px 11px", transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform .2s ease" }} />
    <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      style={{ opacity: open ? 0 : 1, transition: "opacity .15s ease" }} />
    <line x1="3" y1={open ? 11 : 16.5} x2={open ? 19 : 19} y2={open ? 11 : 16.5}
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      style={{ transformOrigin: "11px 11px", transform: open ? "rotate(-45deg)" : "rotate(0)", transition: "transform .2s ease" }} />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8.4" cy="8.4" r="5.6" stroke="currentColor" strokeWidth="1.7" />
    <line x1="12.6" y1="12.6" x2="17" y2="17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

interface SearchResult {
  slug: string;
  title: string;
}

interface NoticeSearchProps {
  value: string;
  results: SearchResult[];
  loading: boolean;
  onChange: (value: string) => void;
  mobile?: boolean;
}

function NoticeSearch({ value, results, loading, onChange, mobile = false }: NoticeSearchProps) {
  const hasSearch = value.trim().length > 0;

  return (
    <div className={`relative ${mobile ? "w-full" : "w-50"}`}>
      <div
        className="flex items-center gap-2 rounded-full border px-3 py-1.5"
        style={{ borderColor: "rgba(255,255,255,0.35)" }}
      >
        <SearchIcon style={{ color: THEME.onPrimary }} />
        <input
          autoFocus={!mobile}
          value={value}
          placeholder="Search notices..."
          className={`w-full bg-transparent outline-none ${mobile ? "text-[14px]" : "text-[13.5px]"}`}
          style={{ color: THEME.onPrimary }}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      {hasSearch && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border py-1 shadow-lg"
          style={{ background: "#FFFFFF", borderColor: "#E7E4DC" }}
        >
          {loading && <p className="px-3.5 py-3 text-[13px]" style={{ color: "#5B5F73" }}>Searching...</p>}
          {!loading && results.length === 0 && (
            <p className="px-3.5 py-3 text-[13px]" style={{ color: "#5B5F73" }}>No notices found</p>
          )}
          {!loading && results.map((result) => (
            <Link
              key={result.slug}
              href={`/notices/${result.slug}`}
              className="block px-3.5 py-2.5 text-[13.5px] hover:bg-black/5"
              style={{ color: "#1F2430" }}
            >
              {result.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Nav ---------- */

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Notices", href: "/notices" },
  { label: "About", href: "#" }, // still a placeholder — no About page built yet
];

export default function NoticeBoardNav() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const term = searchTerm.trim().replace(/[%,()_]/g, " ").replace(/\s+/g, " ").slice(0, 80);
    if (!term || !supabase) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    const client = supabase;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      const nowIso = new Date().toISOString();
      const { data, error } = await client
        .from("notices")
        .select("slug, title")
        .eq("status", "published")
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
        .or(`title.ilike.%${term}%,body.ilike.%${term}%`)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!cancelled) {
        setSearchResults(error || !data ? [] : data);
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  function updateSearchTerm(value: string) {
    setSearchTerm(value);
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ background: THEME.primary, borderColor: THEME.primaryDark }}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo + wordmark */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="https://res.cloudinary.com/ddlnqthao/image/upload/v1787586978/a9d5c97b-f7ff-485d-9bb3-f8b6de23afc9.png"
            alt="School crest"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain bg-white ring-1 ring-black/5 p-0.5"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
          <span
            className="hidden sm:inline text-[17px] sm:text-[18px] font-bold tracking-tight leading-tight"
            style={{ color: THEME.accent }}
          >
            Moshood Abiola Polytechnic
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[15.5px] font-semibold uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ color: THEME.onPrimary }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="hidden sm:flex items-center">
            {searchOpen ? (
              <NoticeSearch
                value={searchTerm}
                results={searchResults}
                loading={searchLoading}
                onChange={updateSearchTerm}
              />
            ) : (
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                style={{ color: THEME.onPrimary }}
              >
                <SearchIcon />
              </button>
            )}
          </div>

          {/* Notification bell — now the REAL live-updating one */}
          <NotificationBell />

          {/* Admin login */}
          <a
            href="/login"
            className="hidden sm:inline-flex items-center rounded-md px-5 py-2.5 text-[14px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
            style={{ background: THEME.accent, color: THEME.onPrimary }}
          >
            Staff Login
          </a>

          {/* Mobile menu toggle */}
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            style={{ color: THEME.onPrimary }}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile slide-down panel */}
      <div
        className="md:hidden overflow-hidden transition-all duration-200 ease-out border-t"
        style={{
          maxHeight: mobileOpen ? 260 : 0,
          borderColor: mobileOpen ? "rgba(255,255,255,0.12)" : "transparent",
          background: THEME.primaryDark,
        }}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          <div
            className="relative z-10 mb-2"
          >
            <NoticeSearch
              value={searchTerm}
              results={searchResults}
              loading={searchLoading}
              onChange={updateSearchTerm}
              mobile
            />
          </div>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-2 py-2.5 text-[15px] font-semibold uppercase tracking-wide"
              style={{ color: THEME.onPrimary }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="/login"
            className="mt-2 inline-flex items-center justify-center rounded-md px-5 py-2.5 text-[14px] font-bold uppercase tracking-wide"
            style={{ background: THEME.accent, color: THEME.onPrimary }}
          >
            Staff Login
          </a>
        </div>
      </div>
    </header>
  );
}