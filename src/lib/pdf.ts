import type { Design, Template, Palette, Font, SuitePiece } from "@/types";

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
  const defaultInviteLine = "invite you to celebrate with us";
  const defaultHostLine = "Hosted by their loved ones";
  const defaultWelcomeMessage = "Welcome to the Celebration of";
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
          ${e(c.name1, "Name One")}
        </h1>
        <p style="font-size: 16px; font-style: italic; color: ${palette.accent}; margin: ${spacing / 3}px 0; z-index:1;">
          ${e(c.conjunction, "&")}
        </p>
        <h1 style="font-size: 32px; font-weight: 300; color: ${palette.primary}; margin: 2px 0 0; line-height: 1.15; z-index:1;">
          ${e(c.name2, "Name Two")}
        </h1>
        ${ornamentHtml}
        <p style="font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: ${palette.muted}; margin: 6px 0 ${spacing}px; opacity:0.7; z-index:1;">
          ${e(c.invitationLine, defaultInviteLine)}
        </p>
        <p style="font-size: 14px; letter-spacing: 0.15em; margin: 0 0 4px; color: ${palette.text}; font-weight:500; z-index:1;">
          ${e(c.date, "Your Event Date")}
        </p>
        <p style="font-size: 11px; color: ${palette.muted}; margin: 0 0 ${spacing}px; z-index:1;">
          ${e(c.time, "Your Event Time")}
        </p>
        <p style="font-size: 13px; color: ${palette.primary}; margin: 0 0 2px; font-weight:500; z-index:1;">
          ${e(c.venue, "Your Event Venue")}
        </p>
        <p style="font-size: 10px; color: ${palette.muted}; margin: 0; z-index:1;">
          ${e(c.address, "Venue Address")}
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

    case "details":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.4}px; opacity:0.8;">
          ${e(c.eventType, "Event Day")}
        </p>
        <h2 style="font-size: 20px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing * 0.3}px; letter-spacing:4px; text-transform:uppercase;">
          Details
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing}px 0; line-height: 1.7; font-size: 12px; max-width:300px;">
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Ceremony</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; white-space:pre-line;">${e(c.ceremonyDetails)}</p>
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Reception</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; white-space:pre-line;">${e(c.receptionDetails)}</p>
          <p style="font-size:10px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Dress Code</p>
          <p style="color: ${palette.text}; margin: 0;">${e(c.dressCode)}</p>
        </div>
      `;
      break;

    case "menu":
      body += `
        <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing * 0.3}px; opacity:0.8;">
          Dinner
        </p>
        <h2 style="font-size: 22px; font-weight: 300; color: ${palette.primary}; margin: 0; letter-spacing:5px; text-transform:uppercase;">
          Menu
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing * 1.5}px 0; line-height: 1.6; font-size: 13px;">
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">First Course</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; font-style:italic;">${e(c.appetizer)}</p>
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Main Course</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px; font-style:italic;">${e(c.entree)}</p>
          <p style="font-size:9px; font-weight:600; color:${palette.accent}; letter-spacing:3px; text-transform:uppercase; margin: 0 0 4px;">Dessert</p>
          <p style="color: ${palette.text}; margin: 0; font-style:italic;">${e(c.dessert)}</p>
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
