// ─── Navigation ───────────────────────────────────────────────────────────────

export type NavLink = {
  label: string;
  href: string;
};

export type ThemeOption = {
  id: string;
  icon: string;
  label: string;
};

export type NavigationData = {
  links: NavLink[];
  themes: ThemeOption[];
  userMenu: {
    profile: NavLink;
    signOut: string;
  };
};

// ─── Footer ───────────────────────────────────────────────────────────────────

export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  platform: string;
  href: string;
  ariaLabel: string;
};

export type FooterData = {
  menu: {
    title: string;
    links: FooterLink[];
  };
  contact: {
    title: string;
    email: string;
    phone: string;
    location: string;
  };
  social: {
    title: string;
    links: SocialLink[];
  };
  copyright: string;
};

// ─── Calculators ──────────────────────────────────────────────────────────────

export type Range = {
  label: string;
  value: string;
  color: string;
};

export type Calculator = {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  formula: string;
  ranges: Range[];
  note: string;
  source: string;
};

export type CalculatorsData = {
  page: {
    title: string;
    subtitle: string;
  };
  items: Calculator[];
};
