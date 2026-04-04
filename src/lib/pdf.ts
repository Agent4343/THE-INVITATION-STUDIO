import type { Design, Template, Palette, Font, SuitePiece } from "@/types";

function normalizeEventType(value: unknown): string {
  return String(value || "celebration")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .trim();
}

type EventKind =
  | "birthday"
  | "anniversary"
  | "engagement"
  | "vow-renewal"
  | "baby-shower"
  | "bridal-shower"
  | "graduation"
  | "retirement"
  | "holiday-party"
  | "corporate-event"
  | "elopement"
  | "civil-ceremony"
  | "wedding"
  | "default";

function normalizeEventKind(value: unknown): EventKind {
  const normalized = normalizeEventType(value);
  if (normalized.includes("birthday")) return "birthday";
  if (normalized.includes("vow-renewal") || (normalized.includes("vow") && normalized.includes("renew"))) {
    return "vow-renewal";
  }
  if (normalized.includes("anniversary")) return "anniversary";
  if (normalized.includes("engagement")) return "engagement";
  if ((normalized.includes("baby") && normalized.includes("shower")) || normalized.includes("baby-shower")) {
    return "baby-shower";
  }
  if ((normalized.includes("bridal") && normalized.includes("shower")) || normalized.includes("bridal-shower")) {
    return "bridal-shower";
  }
  if (normalized.includes("graduation")) return "graduation";
  if (normalized.includes("retirement")) return "retirement";
  if (normalized.includes("holiday") || normalized.includes("christmas") || normalized.includes("new-year")) {
    return "holiday-party";
  }
  if (normalized.includes("corporate") || normalized.includes("company") || normalized.includes("team-event")) {
    return "corporate-event";
  }
  if (normalized.includes("elopement")) return "elopement";
  if (normalized.includes("civil-ceremony") || (normalized.includes("civil") && normalized.includes("ceremony"))) {
    return "civil-ceremony";
  }
  if (normalized.includes("wedding")) return "wedding";
  return "default";
}

function detailsSectionsForEvent(eventType: string): Array<{
  label: string;
  detail: unknown;
  placeholder: string;
}> {
  switch (normalizeEventKind(eventType)) {
    case "birthday":
      return [
        { label: "Party", detail: undefined, placeholder: "Party starts at 4:30 PM\nwith games and cake to follow." },
        { label: "Schedule", detail: undefined, placeholder: "Cake cutting at 6:00 PM\nand celebration photos after." },
        { label: "Attire", detail: undefined, placeholder: "Festive Casual" },
      ];
    case "anniversary":
    case "vow-renewal":
      return [
        { label: "Ceremony", detail: undefined, placeholder: "Vow renewal begins at 4:30 PM\nin the garden." },
        { label: "Celebration", detail: undefined, placeholder: "Dinner and celebration to follow\nin the main hall." },
        { label: "Attire", detail: undefined, placeholder: "Cocktail Attire" },
      ];
    case "engagement":
      return [
        { label: "Celebration", detail: undefined, placeholder: "Engagement celebration starts at 5:30 PM\nwith cocktails and light bites." },
        { label: "Reception", detail: undefined, placeholder: "Dinner and toasts to follow\nin the lounge." },
        { label: "Attire", detail: undefined, placeholder: "Cocktail Attire" },
      ];
    case "baby-shower":
    case "bridal-shower":
      return [
        { label: "Shower", detail: undefined, placeholder: "Shower starts at 1:00 PM\nwith refreshments and activities." },
        { label: "Activities", detail: undefined, placeholder: "Games, gift opening, and photos\nafter the welcome toast." },
        { label: "Attire", detail: undefined, placeholder: "Smart Casual" },
      ];
    case "graduation":
      return [
        { label: "Ceremony", detail: undefined, placeholder: "Graduation ceremony begins at 3:00 PM\nat the auditorium." },
        { label: "Celebration", detail: undefined, placeholder: "Family celebration to follow\nat Celebration Hall." },
        { label: "Attire", detail: undefined, placeholder: "Semi-Formal" },
      ];
    case "retirement":
      return [
        { label: "Program", detail: undefined, placeholder: "Retirement celebration starts at 6:00 PM\nwith speeches and dinner." },
        { label: "Reception", detail: undefined, placeholder: "Reception and memories to follow\nwith music and toasts." },
        { label: "Attire", detail: undefined, placeholder: "Business Casual" },
      ];
    case "holiday-party":
      return [
        { label: "Gathering", detail: undefined, placeholder: "Holiday party begins at 7:00 PM\nwith seasonal drinks and appetizers." },
        { label: "Celebration", detail: undefined, placeholder: "Dinner, music, and celebration to follow." },
        { label: "Attire", detail: undefined, placeholder: "Festive Attire" },
      ];
    case "corporate-event":
      return [
        { label: "Agenda", detail: undefined, placeholder: "Event opens at 6:00 PM with networking\nand opening remarks." },
        { label: "Program", detail: undefined, placeholder: "Dinner service and keynote presentation\nto follow." },
        { label: "Attire", detail: undefined, placeholder: "Business Formal" },
      ];
    case "elopement":
      return [
        { label: "Ceremony", detail: undefined, placeholder: "Intimate ceremony begins at 4:00 PM\non the terrace." },
        { label: "Celebration", detail: undefined, placeholder: "Champagne toast and dinner to follow." },
        { label: "Attire", detail: undefined, placeholder: "Elegant Casual" },
      ];
    case "civil-ceremony":
      return [
        { label: "Ceremony", detail: undefined, placeholder: "Civil ceremony begins at 3:30 PM\nin the city hall chamber." },
        { label: "Celebration", detail: undefined, placeholder: "Refreshments and photos to follow nearby." },
        { label: "Attire", detail: undefined, placeholder: "Semi-Formal" },
      ];
    case "wedding":
    case "default":
    default:
      return [
        { label: "Ceremony", detail: undefined, placeholder: "Main event begins at 4:30 PM\nin the main hall." },
        { label: "Celebration", detail: undefined, placeholder: "Celebration to follow\nwith dinner and music." },
        { label: "Attire", detail: undefined, placeholder: "Event Attire" },
      ];
  }
}

function invitationSamplesForEvent(eventType: string): {
  name1: string;
  name2: string;
  date: string;
  time: string;
  venue: string;
  address: string;
} {
  switch (normalizeEventKind(eventType)) {
    case "birthday":
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "6:00 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
    case "anniversary":
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "5:00 PM",
        venue: "Anniversary House",
        address: "456 Memory Lane, Your City, ST",
      };
    case "engagement":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Saturday, May 8, 2027",
        time: "5:30 PM",
        venue: "Riverside Loft",
        address: "25 Harbor Street, Your City, ST",
      };
    case "vow-renewal":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Sunday, August 22, 2027",
        time: "4:00 PM",
        venue: "Sunset Garden",
        address: "18 Willow Avenue, Your City, ST",
      };
    case "baby-shower":
      return {
        name1: "Taylor",
        name2: "Morgan",
        date: "Sunday, October 19, 2026",
        time: "11:00 AM",
        venue: "Garden Room",
        address: "789 Blossom Street, Your City, ST",
      };
    case "bridal-shower":
      return {
        name1: "Taylor",
        name2: "Riley",
        date: "Saturday, October 18, 2026",
        time: "1:00 PM",
        venue: "Rosewood Lounge",
        address: "321 Rose Avenue, Your City, ST",
      };
    case "graduation":
      return {
        name1: "Jordan",
        name2: "Family & Friends",
        date: "Saturday, June 12, 2027",
        time: "2:00 PM",
        venue: "Main Auditorium",
        address: "200 University Way, Your City, ST",
      };
    case "retirement":
      return {
        name1: "Alex",
        name2: "Colleagues & Friends",
        date: "Friday, September 10, 2027",
        time: "6:30 PM",
        venue: "Banquet Hall",
        address: "100 Heritage Drive, Your City, ST",
      };
    case "holiday-party":
      return {
        name1: "The Rivera Family",
        name2: "Friends & Neighbors",
        date: "Saturday, December 12, 2026",
        time: "7:00 PM",
        venue: "Winter Hall",
        address: "90 Evergreen Avenue, Your City, ST",
      };
    case "corporate-event":
      return {
        name1: "Horizon Team",
        name2: "Clients & Partners",
        date: "Thursday, November 4, 2027",
        time: "6:00 PM",
        venue: "City Conference Center",
        address: "410 Commerce Plaza, Your City, ST",
      };
    case "elopement":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, July 16, 2027",
        time: "4:00 PM",
        venue: "Cliffside Terrace",
        address: "12 Seaview Point, Your City, ST",
      };
    case "civil-ceremony":
      return {
        name1: "Avery",
        name2: "Cameron",
        date: "Friday, June 18, 2027",
        time: "3:30 PM",
        venue: "City Hall Atrium",
        address: "1 Municipal Square, Your City, ST",
      };
    case "wedding":
    case "default":
    default:
      return {
        name1: "Alex",
        name2: "Jordan",
        date: "Saturday, October 18, 2026",
        time: "4:30 PM",
        venue: "Celebration Hall",
        address: "123 Celebration Lane, Your City, ST",
      };
  }
}

function menuSamplesForEvent(eventType: string): {
  menuHeading: string;
  appetizer: string;
  entree: string;
  dessert: string;
} {
  switch (normalizeEventKind(eventType)) {
    case "birthday":
      return {
        menuHeading: "Birthday Menu",
        appetizer: "Mini Sliders & Crispy Fries",
        entree: "Build-Your-Own Taco Bar",
        dessert: "Birthday Cake & Ice Cream Bar",
      };
    case "anniversary":
      return {
        menuHeading: "Anniversary Dinner",
        appetizer: "Burrata with Heirloom Tomatoes",
        entree: "Filet Mignon with Truffle Mash",
        dessert: "Champagne Tiramisu",
      };
    case "engagement":
      return {
        menuHeading: "Engagement Soiree",
        appetizer: "Smoked Salmon Crostini",
        entree: "Lemon Herb Chicken",
        dessert: "Macaron Tower",
      };
    case "vow-renewal":
      return {
        menuHeading: "Vow Renewal Dinner",
        appetizer: "Seasonal Bruschetta Trio",
        entree: "Roasted Salmon with Citrus Glaze",
        dessert: "Vanilla Bean Panna Cotta",
      };
    case "baby-shower":
      return {
        menuHeading: "Shower Brunch",
        appetizer: "Fresh Fruit & Yogurt Parfaits",
        entree: "Quiche Lorraine & Garden Salad",
        dessert: "Cupcake Assortment",
      };
    case "bridal-shower":
      return {
        menuHeading: "Bridal Shower Menu",
        appetizer: "Tea Sandwich Selection",
        entree: "Lemon Ricotta Pasta",
        dessert: "Strawberry Shortcake",
      };
    case "graduation":
      return {
        menuHeading: "Graduation Feast",
        appetizer: "Buffalo Cauliflower Bites",
        entree: "BBQ Chicken and Cornbread",
        dessert: "Chocolate Brownie Sundaes",
      };
    case "retirement":
      return {
        menuHeading: "Retirement Reception",
        appetizer: "Charcuterie and Artisan Cheese",
        entree: "Herb-Crusted Prime Rib",
        dessert: "Classic New York Cheesecake",
      };
    case "holiday-party":
      return {
        menuHeading: "Holiday Party Menu",
        appetizer: "Seasonal Cranberry Brie Bites",
        entree: "Roast Turkey with Winter Vegetables",
        dessert: "Gingerbread Trifle",
      };
    case "corporate-event":
      return {
        menuHeading: "Event Menu",
        appetizer: "Mediterranean Mezze Platter",
        entree: "Grilled Chicken with Wild Rice",
        dessert: "Chocolate Mousse Cups",
      };
    case "elopement":
      return {
        menuHeading: "Celebration Dinner",
        appetizer: "Prosciutto & Fig Flatbread",
        entree: "Seared Sea Bass",
        dessert: "Lemon Tartlets",
      };
    case "civil-ceremony":
      return {
        menuHeading: "Ceremony Reception Menu",
        appetizer: "Roasted Tomato Crostini",
        entree: "Chicken Piccata",
        dessert: "Berry Chantilly Cake",
      };
    case "wedding":
      return {
        menuHeading: "Reception Menu",
        appetizer: "Burrata & Heirloom Tomato",
        entree: "Herb-Crusted Lamb",
        dessert: "Vanilla Bean Panna Cotta",
      };
    case "default":
    default:
      return {
        menuHeading: "Event Menu",
        appetizer: "Seasonal Starter",
        entree: "Chef's Signature Entree",
        dessert: "House Dessert",
      };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Render a single suite piece as self-contained HTML with inline styles.
 */
export function renderPieceHtml(
  piece: SuitePiece,
  design: Design,
  template: Template,
  palette: Palette,
  font: Font,
): string {
  const c = design.content;
  const e = (value: unknown, fallback = "") =>
    escapeHtml(
      value === undefined || value === null || value === ""
        ? fallback
        : String(value),
    );
  const normalizedEventType = normalizeEventType(c.eventType);
  const eventKind = normalizeEventKind(c.eventType);
  const invitationSamples = invitationSamplesForEvent(normalizedEventType);
  const menuSamples = menuSamplesForEvent(normalizedEventType);
  const defaultInviteLine = (() => {
    switch (eventKind) {
      case "birthday":
        return "invite you to a birthday celebration";
      case "anniversary":
        return "invite you to celebrate our anniversary";
      case "engagement":
        return "invite you to celebrate our engagement";
      case "vow-renewal":
        return "invite you to celebrate our vow renewal";
      case "baby-shower":
        return "invite you to a baby shower celebration";
      case "bridal-shower":
        return "invite you to a bridal shower celebration";
      case "graduation":
        return "invite you to celebrate this graduation";
      case "retirement":
        return "invite you to celebrate a retirement";
      case "holiday-party":
        return "invite you to our holiday party";
      case "corporate-event":
        return "invite you to our corporate celebration";
      case "elopement":
        return "invite you to celebrate our elopement";
      case "civil-ceremony":
        return "invite you to celebrate our civil ceremony";
      case "wedding":
      case "default":
      default:
        return "invite you to celebrate with us";
    }
  })();

  const defaultHostLine = (() => {
    switch (eventKind) {
      case "birthday":
        return "Join us for a birthday celebration";
      case "anniversary":
      case "vow-renewal":
      case "engagement":
      case "civil-ceremony":
        return "Together with our loved ones";
      case "baby-shower":
      case "bridal-shower":
        return "Hosted with love";
      case "holiday-party":
        return "You're invited to celebrate the season";
      case "corporate-event":
        return "You're invited";
      case "elopement":
        return "A small celebration with those we love";
      case "wedding":
      case "default":
      default:
        return "Hosted by friends and family";
    }
  })();

  const defaultWelcomeMessage = (() => {
    switch (eventKind) {
      case "birthday":
        return "Welcome to the Birthday Celebration of";
      case "anniversary":
        return "Welcome to the Anniversary Celebration of";
      case "engagement":
        return "Welcome to the Engagement Celebration of";
      case "vow-renewal":
        return "Welcome to the Vow Renewal Celebration of";
      case "baby-shower":
        return "Welcome to the Baby Shower of";
      case "bridal-shower":
        return "Welcome to the Bridal Shower of";
      case "graduation":
        return "Welcome to the Graduation Celebration of";
      case "retirement":
        return "Welcome to the Retirement Celebration of";
      case "holiday-party":
        return "Welcome to the Holiday Celebration of";
      case "corporate-event":
        return "Welcome to the Corporate Event of";
      case "elopement":
        return "Welcome to the Elopement Celebration of";
      case "civil-ceremony":
        return "Welcome to the Civil Ceremony Celebration of";
      case "wedding":
      case "default":
      default:
        return "Welcome to the Celebration of";
    }
  })();
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFontsFamily)}&display=swap`;

  const textAlign =
    template.layout === "centered"
      ? "center"
      : template.layout === "left"
        ? "left"
        : "center";

  const borderCss =
    template.borderStyle === "thin"
      ? `border: 1px solid ${palette.accent};`
      : template.borderStyle === "double"
        ? `border: 3px double ${palette.accent};`
        : "";

  const ornStyle = template.ornamentStyle || "classic";

  const ornamentHtml = template.ornament
    ? (() => {
        const col = palette.accent;
        const line = (w: string, extra = "") =>
          `<span style="display:inline-block;width:${w};height:1px;background:${col};opacity:0.4;${extra}"></span>`;
        const wrap = (inner: string) =>
          `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:12px auto;color:${col};">${inner}</div>`;
        switch (ornStyle) {
          case "botanical":
            return wrap(`${line("50px")}<span style="font-size:10px;letter-spacing:6px;opacity:0.7;">&#9753; &#10047; &#9753;</span>${line("50px")}`);
          case "geometric":
            return wrap(`${line("50px", "height:2px;opacity:0.3;")}<span style="font-size:10px;letter-spacing:4px;">&#9670; &#9671; &#9670;</span>${line("50px", "height:2px;opacity:0.3;")}`);
          case "art-deco":
            return wrap(`${line("40px")}<span style="font-size:14px;letter-spacing:3px;">&#9001; &#9674; &#9002;</span>${line("40px")}`);
          case "minimal":
            return wrap(`${line("80px", "opacity:0.25;")}`);
          case "flourish":
            return wrap(`<span style="font-size:16px;opacity:0.6;transform:scaleX(-1);display:inline-block;">&#10087;</span>${line("50px", "opacity:0.3;")}<span style="font-size:8px;letter-spacing:4px;">&#10022;</span>${line("50px", "opacity:0.3;")}<span style="font-size:16px;opacity:0.6;">&#10087;</span>`);
          case "vintage":
            return wrap(`<span style="font-size:14px;opacity:0.5;">&#10048;</span>${line("50px", "border-top:1px dotted " + col + ";height:0;background:transparent;")}<span style="font-size:8px;letter-spacing:4px;">&#10047;</span>${line("50px", "border-top:1px dotted " + col + ";height:0;background:transparent;")}<span style="font-size:14px;opacity:0.5;">&#10048;</span>`);
          case "romantic":
            return wrap(`${line("50px")}<span style="font-size:14px;opacity:0.6;">&#10084;</span>${line("50px")}`);
          case "classic":
          default:
            return wrap(`${line("50px")}<span style="font-size:10px;letter-spacing:4px;">&#10022;</span>${line("50px")}`);
        }
      })()
    : "";

  // Inner frame for non-minimal styles
  const innerFrameHtml = ornStyle !== "minimal"
    ? `<div style="position:absolute;inset:16px;border:1px solid ${palette.accent};opacity:0.12;pointer-events:none;"></div>`
    : "";

  const spacing = Math.round(template.spacingRatio * 20);

  // Determine page size based on piece type
  const isSmall = piece === "rsvp" || piece === "thankyou" || piece === "placecard";
  const isSquare = piece === "tablenumber";
  const isSign = piece === "welcomesign";
  const pageWidth = "5in";
  const pageHeight = isSmall ? "3.5in" : isSquare ? "5in" : isSign ? "10in" : "7in";

  const wrapperStyle = [
    `font-family: '${font.name}', ${font.category};`,
    `background: ${palette.bg};`,
    `color: ${palette.text};`,
    `width: ${pageWidth}; height: ${pageHeight};`,
    `box-sizing: border-box;`,
    `padding: ${spacing + 20}px ${spacing + 16}px;`,
    `display: flex; flex-direction: column; justify-content: center; align-items: ${template.layout === "left" ? "flex-start" : "center"};`,
    `text-align: ${textAlign};`,
    borderCss,
    `margin: 0;`,
    `overflow: hidden;`,
    `position: relative;`,
  ].join(" ");

  let body = innerFrameHtml;

  switch (piece) {
    case "invitation":
      body += `
        <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.5}px; z-index:1;">
          ${e(c.preHeading, defaultHostLine)}
        </p>
        <h1 style="font-size: 32px; font-weight: 300; color: ${palette.primary}; margin: 8px 0 2px; line-height: 1.15; z-index:1;">
          ${e(c.name1, invitationSamples.name1)}
        </h1>
        <p style="font-size: 16px; font-style: italic; color: ${palette.accent}; margin: ${spacing / 3}px 0; z-index:1;">
          ${e(c.conjunction, "&")}
        </p>
        <h1 style="font-size: 32px; font-weight: 300; color: ${palette.primary}; margin: 2px 0 0; line-height: 1.15; z-index:1;">
          ${e(c.name2, invitationSamples.name2)}
        </h1>
        ${ornamentHtml}
        <p style="font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: ${palette.muted}; margin: 6px 0 ${spacing}px; opacity:0.7; z-index:1;">
          ${e(c.invitationLine, defaultInviteLine)}
        </p>
        <p style="font-size: 14px; letter-spacing: 0.15em; margin: 0 0 4px; color: ${palette.text}; font-weight:500; z-index:1;">
          ${e(c.date, invitationSamples.date)}
        </p>
        <p style="font-size: 11px; color: ${palette.muted}; margin: 0 0 ${spacing}px; z-index:1;">
          ${e(c.time, invitationSamples.time)}
        </p>
        <p style="font-size: 13px; color: ${palette.primary}; margin: 0 0 2px; font-weight:500; z-index:1;">
          ${e(c.venue, invitationSamples.venue)}
        </p>
        <p style="font-size: 10px; color: ${palette.muted}; margin: 0; z-index:1;">
          ${e(c.address, invitationSamples.address)}
        </p>
      `;
      break;

    case "rsvp":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.4}px; opacity:0.8;">
          Kindly Respond
        </p>
        <h2 style="font-size: 26px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing * 0.4}px; letter-spacing:5px;">
          RSVP
        </h2>
        ${ornamentHtml}
        <p style="font-size: 10px; color: ${palette.muted}; margin: ${spacing * 0.3}px 0 ${spacing * 0.3}px; letter-spacing:2px; text-transform:uppercase;">
          ${e(c.rsvpPrompt, "Please respond by")}
        </p>
        <p style="font-size: 14px; color: ${palette.text}; font-weight:500; margin: 0 0 ${spacing}px; letter-spacing:1px;">
          ${e(c.rsvpDeadline, "September 1, 2026")}
        </p>
        <div style="width: 75%; border-bottom: 1px solid ${palette.muted}; padding-bottom: 3px; margin-bottom:${spacing}px;">
          <p style="font-size: 11px; color: ${palette.muted}; margin: 0; text-align: left;">M</p>
        </div>
        <div style="width:75%; display: flex; flex-direction:column; gap:${spacing * 0.5}px; font-size: 11px; color: ${palette.text};">
          <span>&#9633; Joyfully accepts</span>
          <span>&#9633; Respectfully declines</span>
        </div>
      `;
      break;

    case "details": {
      const detailsSections = detailsSectionsForEvent(normalizedEventType);
      const firstDetail = c.ceremonyDetails || detailsSections[0].placeholder;
      const secondDetail = c.receptionDetails || detailsSections[1].placeholder;
      const attireDetail = c.dressCode || detailsSections[2].placeholder;
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.4}px; opacity:0.8;">
          ${e(c.eventType, "Event Day")}
        </p>
        <h2 style="font-size: 20px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing * 0.3}px; letter-spacing:4px; text-transform:uppercase;">
          Details
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing}px 0; line-height: 1.7; font-size: 12px; max-width:300px;">
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">${e(detailsSections[0].label)}</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; white-space:pre-line;">${e(firstDetail)}</p>
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">${e(detailsSections[1].label)}</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; white-space:pre-line;">${e(secondDetail)}</p>
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">${e(detailsSections[2].label)}</p>
          <p style="color: ${palette.text}; margin: 0;">${e(attireDetail)}</p>
        </div>
      `;
      break;
    }

    case "menu":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.3}px; opacity:0.8;">
          ${e(c.menuHeading, menuSamples.menuHeading)}
        </p>
        <h2 style="font-size: 22px; font-weight: 300; color: ${palette.primary}; margin: 0; letter-spacing:5px; text-transform:uppercase;">
          Menu
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing * 1.5}px 0; line-height: 1.6; font-size: 13px;">
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">First Course</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; font-style:italic;">${e(c.appetizer, menuSamples.appetizer)}</p>
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Main Course</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; font-style:italic;">${e(c.entree, menuSamples.entree)}</p>
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Dessert</p>
          <p style="color: ${palette.text}; margin: 0; font-style:italic;">${e(c.dessert, menuSamples.dessert)}</p>
        </div>
      `;
      break;

    case "thankyou":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.3}px; opacity:0.8;">
          With Gratitude
        </p>
        <h2 style="font-size: 28px; font-weight: 300; color: ${palette.primary}; margin: 0; letter-spacing:1px;">
          Thank You
        </h2>
        ${ornamentHtml}
        <p style="font-size: 12px; color: ${palette.text}; line-height: 1.8; margin: ${spacing}px 0; max-width: 360px; white-space:pre-line;">
          ${e(c.thankYouMessage)}
        </p>
        <p style="font-size: 13px; color: ${palette.primary}; font-weight:500; margin: ${spacing * 0.5}px 0 0; letter-spacing:1px;">
          ${e(c.name1)} &amp; ${e(c.name2)}
        </p>
      `;
      break;

    case "savethedate":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px; opacity:0.8;">
          ${e(c.saveTheDateMessage, "Save the Date")}
        </p>
        ${ornamentHtml}
        <h1 style="font-size: 30px; font-weight: 300; color: ${palette.primary}; margin: 0 0 4px; line-height: 1.15;">
          ${e(c.name1, "Alex")}
        </h1>
        <p style="font-size: 16px; font-style: italic; color: ${palette.accent}; margin: ${spacing / 3}px 0;">
          ${e(c.conjunction, "&")}
        </p>
        <h1 style="font-size: 30px; font-weight: 300; color: ${palette.primary}; margin: 0; line-height: 1.15;">
          ${e(c.name2, "Jordan")}
        </h1>
        <p style="font-size: 22px; font-weight: 500; color: ${palette.primary}; margin: ${spacing * 1.5}px 0 ${spacing * 0.5}px; letter-spacing:2px;">
          ${e(c.date, "Saturday, October 18, 2026")}
        </p>
        <p style="font-size: 13px; color: ${palette.muted}; margin: 0;">
          ${e(c.venue, "Celebration Hall")} &bull; ${e(c.address, "Your City, ST")}
        </p>
        <p style="font-size: 10px; letter-spacing:2px; text-transform:uppercase; color: ${palette.muted}; margin: ${spacing * 1.5}px 0 0; opacity:0.7;">
          Formal invitation to follow
        </p>
      `;
      break;

    case "tablenumber":
      body += `
        <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.5}px;">
          Table
        </p>
        ${ornamentHtml}
        <p style="font-size: 64px; font-weight: 300; color: ${palette.primary}; margin: 0; line-height: 1;">
          ${e(c.tableNumber, "1")}
        </p>
        ${ornamentHtml}
      `;
      break;

    case "placecard":
      body += `
        <p style="font-size: 20px; font-weight: 400; color: ${palette.primary}; margin: 0; letter-spacing: 1px;">
          ${e(c.guestName, e(c.guestPrompt, "Guest Name"))}
        </p>
      `;
      break;

    case "welcomesign":
      body += `
        <p style="font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px; opacity:0.8;">
          ${e(c.welcomeMessage, defaultWelcomeMessage)}
        </p>
        ${ornamentHtml}
        <h1 style="font-size: 36px; font-weight: 300; color: ${palette.primary}; margin: 0 0 4px; line-height: 1.15;">
          ${e(c.name1, "Alex")}
        </h1>
        <p style="font-size: 18px; font-style: italic; color: ${palette.accent}; margin: ${spacing / 2}px 0;">
          ${e(c.conjunction, "&")}
        </p>
        <h1 style="font-size: 36px; font-weight: 300; color: ${palette.primary}; margin: 0; line-height: 1.15;">
          ${e(c.name2, "Jordan")}
        </h1>
        ${ornamentHtml}
        <p style="font-size: 16px; color: ${palette.text}; margin: ${spacing}px 0 ${spacing * 0.5}px; letter-spacing:2px;">
          ${e(c.date, "Saturday, October 18, 2026")}
        </p>
        <p style="font-size: 13px; color: ${palette.muted}; margin: 0 0 ${spacing * 2}px;">
          ${e(c.venue, "Celebration Hall")}
        </p>
        <p style="font-size: 12px; color: ${palette.muted}; margin: 0; letter-spacing:1px; font-style:italic;">
          ${e(c.welcomeSubtext, "Please find your seat and enjoy the celebration")}
        </p>
      `;
      break;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @import url('${googleFontUrl}');
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    @page { size: ${pageWidth} ${pageHeight}; margin: 0; }
  </style>
</head>
<body>
  <div style="${wrapperStyle}">
    ${body}
  </div>
</body>
</html>`;
}

/**
 * Generate full suite HTML — all 9 pieces as separate pages.
 */
export function generateSuiteHtml(
  design: Design,
  template: Template,
  palette: Palette,
  font: Font,
): string {
  const pieces: SuitePiece[] = [
    "invitation", "rsvp", "details", "menu", "thankyou",
    "savethedate", "tablenumber", "placecard", "welcomesign",
  ];
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFontsFamily)}&display=swap`;

  const pagesHtml = pieces.map((piece) => {
    const singleHtml = renderPieceHtml(piece, design, template, palette, font);
    const bodyMatch = singleHtml.match(/<body>([\s\S]*)<\/body>/);
    return bodyMatch ? bodyMatch[1] : "";
  }).join('<div style="page-break-after: always;"></div>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @import url('${googleFontUrl}');
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    @page { size: 5in 7in; margin: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`;
}
