import { THEME } from "@/lib/Theme";
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1.5c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 7.5 3.5 7.5s3.5-5 3.5-7.5c0-2-1.5-3.5-3.5-3.5Z" fill="#F2A93B" />
    <circle cx="7" cy="5" r="1.4" fill="#FAFAF7" />
  </svg>
);

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: "Browse",
    links: [
      { label: "All notices", href: "#" },
      { label: "By department", href: "#" },
      { label: "Archive", href: "#" },
    ],
  },
  {
    heading: "Institution",
    links: [
      { label: "About", href: "#" },
      { label: "Staff login", href: "#" },
      { label: "Contact registry", href: "#" },
    ],
  },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#FAFAF7", borderColor: "#E7E4DC" }} className="w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3 shrink-0">
          <img
            src="https://res.cloudinary.com/ddlnqthao/image/upload/v1787586978/a9d5c97b-f7ff-485d-9bb3-f8b6de23afc9.png"
            alt="School crest"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-contain bg-white ring-1 ring-black/5 p-0.5"
           
          />
          <span
            className="hidden sm:inline text-[17px] sm:text-[18px] font-bold tracking-tight leading-tight"
            style={{ color: THEME.accent }}
          >
            Moshood Abiola Polytechnic
          </span>
        </a>

          {/* Link columns */}
          <div className="flex gap-12 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: "#5B5F73" }}>
                  {col.heading}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13.5px] transition-opacity hover:opacity-70"
                        style={{ color: "#1F2430" }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-9 flex flex-col-reverse items-center gap-3 border-t pt-5 sm:flex-row sm:justify-between"
          style={{ borderColor: "#E7E4DC" }}
        >
          <p className="text-[12.5px]" style={{ color: "#5B5F73" }}>
            &copy; {year} Notice Board. Built for the student body.
          </p>
          <p className="text-[12.5px]" style={{ color: "#5B5F73" }}>
            A digital replacement for the pin-board.
          </p>
        </div>
      </div>
    </footer>
  );
}