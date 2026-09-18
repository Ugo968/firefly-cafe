/**
 * Firefly Café — delivery coverage & pricing.
 *
 * Coverage: Awka (Anambra State) and its axis, every terminal of
 * Nnamdi Azikiwe University (UNIZIK) including all hostels & lodges,
 * plus the university's other campuses.
 *
 * Fees are in Naira. The server ALWAYS re-computes the fee from this
 * config — never trust a client-submitted amount.
 *
 * FREE DELIVERY on subtotal >= FREE_DELIVERY_THRESHOLD.
 */

export const FREE_DELIVERY_THRESHOLD = 25000;

export type ZoneGroup =
  | 'unizik-campus'
  | 'unizik-hostels'
  | 'awka-city'
  | 'awka-axis'
  | 'unizik-campuses';

export type DeliveryZone = {
  id: string;
  group: ZoneGroup;
  name: string;
  fee: number;
  eta: string;
};

export const ZONE_GROUPS: { id: ZoneGroup; label: string; blurb: string }[] = [
  { id: 'unizik-campus', label: 'UNIZIK Campus', blurb: 'Every gate, park & terminal inside the main campus (Ifite)' },
  { id: 'unizik-hostels', label: 'Hostels & Lodges', blurb: 'School hostels and private lodges around Ifite' },
  { id: 'awka-city', label: 'Awka City', blurb: 'Every junction, market and street axis in Awka' },
  { id: 'awka-axis', label: 'Awka Axis', blurb: 'Neighbouring towns on the Awka corridor' },
  { id: 'unizik-campuses', label: 'Other Campuses', blurb: 'Igbariam, Agulu & Nnewi campuses' },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  /* ------------------------- UNIZIK main campus (Ifite) ------------------------- */
  { id: 'unizik-main-gate', group: 'unizik-campus', name: 'Main Gate (Ifite Road)', fee: 500, eta: '30–45 min' },
  { id: 'unizik-second-gate', group: 'unizik-campus', name: 'Second Gate (Back Gate)', fee: 500, eta: '30–45 min' },
  { id: 'unizik-science-village', group: 'unizik-campus', name: 'Science Village', fee: 600, eta: '35–50 min' },
  { id: 'unizik-temp-site', group: 'unizik-campus', name: 'Temporary Site (Temp Site)', fee: 700, eta: '35–55 min' },
  { id: 'unizik-ifite-park', group: 'unizik-campus', name: 'Ifite Park', fee: 600, eta: '30–45 min' },
  { id: 'unizik-library', group: 'unizik-campus', name: 'University Library', fee: 600, eta: '35–50 min' },
  { id: 'unizik-sports-complex', group: 'unizik-campus', name: 'Sports Complex', fee: 700, eta: '35–55 min' },
  { id: 'unizik-admin-block', group: 'unizik-campus', name: 'Admin Block / Senate Building', fee: 600, eta: '35–50 min' },
  { id: 'unizik-cape', group: 'unizik-campus', name: 'Cape Point (Faculty of Engineering axis)', fee: 700, eta: '35–55 min' },
  { id: 'unizik-other-terminal', group: 'unizik-campus', name: 'Other campus terminal — describe below', fee: 600, eta: '30–55 min' },

  /* ------------------------- UNIZIK hostels & lodges ------------------------- */
  { id: 'hostel-emeka-offor', group: 'unizik-hostels', name: 'Emeka Offor Lodge', fee: 600, eta: '30–45 min' },
  { id: 'hostel-boys', group: 'unizik-hostels', name: "Boys' Hostel (School Hostel)", fee: 600, eta: '30–45 min' },
  { id: 'hostel-girls', group: 'unizik-hostels', name: "Girls' Hostel (School Hostel)", fee: 600, eta: '30–45 min' },
  { id: 'hostel-postgrad', group: 'unizik-hostels', name: 'Postgraduate Hostel', fee: 600, eta: '30–45 min' },
  { id: 'hostel-medical', group: 'unizik-hostels', name: 'Medical / Health Sciences Hostel', fee: 600, eta: '30–45 min' },
  { id: 'hostel-peace', group: 'unizik-hostels', name: 'Peace Hostel, Ifite', fee: 600, eta: '30–45 min' },
  { id: 'hostel-origin', group: 'unizik-hostels', name: 'Origin Hostel, Ifite', fee: 700, eta: '35–50 min' },
  { id: 'hostel-manfred', group: 'unizik-hostels', name: 'Manfred Hostel, Ifite', fee: 700, eta: '35–50 min' },
  { id: 'hostel-eldorado', group: 'unizik-hostels', name: 'El-Dorado Lodge, Ifite', fee: 700, eta: '35–50 min' },
  { id: 'hostel-alpha', group: 'unizik-hostels', name: 'Alpha Hostel, Ifite', fee: 700, eta: '35–50 min' },
  { id: 'hostel-shell', group: 'unizik-hostels', name: 'Shell Hostel, Ifite', fee: 700, eta: '35–50 min' },
  { id: 'hostel-other', group: 'unizik-hostels', name: 'Other hostel / lodge — describe below', fee: 600, eta: '30–55 min' },

  /* ------------------------------- Awka city ------------------------------- */
  { id: 'awka-unizik-junction', group: 'awka-city', name: 'Unizik Junction', fee: 800, eta: '30–45 min' },
  { id: 'awka-kwata', group: 'awka-city', name: 'Kwata Junction', fee: 1000, eta: '40–55 min' },
  { id: 'awka-eke', group: 'awka-city', name: 'Eke Awka Market', fee: 1000, eta: '40–55 min' },
  { id: 'awka-amansea', group: 'awka-city', name: 'Amansea', fee: 1200, eta: '45–60 min' },
  { id: 'awka-agu-awka', group: 'awka-city', name: 'Agu-Awka', fee: 1000, eta: '40–55 min' },
  { id: 'awka-zik-avenue', group: 'awka-city', name: 'Zik Avenue axis', fee: 900, eta: '40–55 min' },
  { id: 'awka-ifite-road', group: 'awka-city', name: 'Ifite Road axis', fee: 700, eta: '30–45 min' },
  { id: 'awka-ezi-awka', group: 'awka-city', name: 'Ezi-Awka', fee: 1000, eta: '40–55 min' },
  { id: 'awka-amikwo', group: 'awka-city', name: 'Amikwo', fee: 1000, eta: '40–55 min' },
  { id: 'awka-umuzocha', group: 'awka-city', name: 'Umuzocha', fee: 1000, eta: '40–55 min' },
  { id: 'awka-umuike', group: 'awka-city', name: 'Umuike', fee: 1000, eta: '40–55 min' },
  { id: 'awka-arthur-eze', group: 'awka-city', name: 'Arthur Eze Crescent / Country Home axis', fee: 1000, eta: '40–55 min' },
  { id: 'awka-other', group: 'awka-city', name: 'Other Awka street — describe below', fee: 900, eta: '40–60 min' },

  /* ------------------------------ Awka axis ------------------------------ */
  { id: 'axis-amawbia', group: 'awka-axis', name: 'Amawbia', fee: 1500, eta: '50–70 min' },
  { id: 'axis-nibo', group: 'awka-axis', name: 'Nibo', fee: 1500, eta: '50–70 min' },
  { id: 'axis-nise', group: 'awka-axis', name: 'Nise', fee: 1800, eta: '55–75 min' },
  { id: 'axis-okpuno', group: 'awka-axis', name: 'Okpuno', fee: 1500, eta: '50–70 min' },
  { id: 'axis-umuokpu', group: 'awka-axis', name: 'Umuokpu', fee: 1400, eta: '50–65 min' },
  { id: 'axis-mbaukwu', group: 'awka-axis', name: 'Mbaukwu', fee: 2000, eta: '60–80 min' },
  { id: 'axis-isuofia', group: 'awka-axis', name: 'Isuofia', fee: 2200, eta: '60–85 min' },
  { id: 'axis-agulu', group: 'awka-axis', name: 'Agulu', fee: 2200, eta: '60–85 min' },
  { id: 'axis-adazi-nnukwu', group: 'awka-axis', name: 'Adazi-Nnukwu', fee: 2000, eta: '60–80 min' },
  { id: 'axis-enugwu-ukwu', group: 'awka-axis', name: 'Enugwu-Ukwu', fee: 2000, eta: '60–80 min' },
  { id: 'axis-nawfia', group: 'awka-axis', name: 'Nawfia', fee: 1800, eta: '55–75 min' },

  /* --------------------------- UNIZIK other campuses --------------------------- */
  { id: 'campus-igbariam', group: 'unizik-campuses', name: 'Igbariam Campus (Agriculture)', fee: 3000, eta: '90–120 min' },
  { id: 'campus-agulu', group: 'unizik-campuses', name: 'Agulu Campus', fee: 2500, eta: '75–100 min' },
  { id: 'campus-nnewi', group: 'unizik-campuses', name: 'Nnewi Campus (Teaching Hospital)', fee: 3500, eta: '100–140 min' },
];

export function getZone(id: string): DeliveryZone | undefined {
  return DELIVERY_ZONES.find((z) => z.id === id);
}

/** Server-side fee calculator — the single source of truth. */
export function computeDeliveryFee(zoneId: string, subtotal: number): { fee: number; zone?: DeliveryZone } {
  const zone = getZone(zoneId);
  if (!zone) return { fee: 0 };
  const fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : zone.fee;
  return { fee, zone };
}
