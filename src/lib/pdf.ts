import type { Design, Template, Palette, Font, SuitePiece } from "@/types";

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
        ? `border: 4px double ${palette.accent};`
        : "";

  const ornamentHtml = template.ornament
    ? `<div style="margin: 12px auto; color: ${palette.accent}; font-size: 14px; letter-spacing: 0.3em;">&#10047;</div>`
    : "";

  const spacing = Math.round(template.spacingRatio * 20);

  const wrapperStyle = [
    `font-family: '${font.name}', ${font.category};`,
    `background: ${palette.bg};`,
    `color: ${palette.text};`,
    `width: 5in; height: 7in;`,
    `box-sizing: border-box;`,
    `padding: ${spacing + 20}px ${spacing + 16}px;`,
    `display: flex; flex-direction: column; justify-content: center; align-items: ${template.layout === "left" ? "flex-start" : "center"};`,
    `text-align: ${textAlign};`,
    borderCss,
    `margin: 0;`,
    `overflow: hidden;`,
  ].join(" ");

  let body = "";

  switch (piece) {
    case "invitation":
      body = `
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px;">
          ${c.preHeading || "Together with their families"}
        </p>
        <h1 style="font-size: 36px; font-weight: 300; color: ${palette.primary}; margin: 0 0 4px; line-height: 1.2;">
          ${c.name1 || "Name"}
        </h1>
        <p style="font-size: 16px; font-style: italic; color: ${palette.accent}; margin: ${spacing / 2}px 0;">
          ${c.conjunction || "&"}
        </p>
        <h1 style="font-size: 36px; font-weight: 300; color: ${palette.primary}; margin: 0; line-height: 1.2;">
          ${c.name2 || "Name"}
        </h1>
        ${ornamentHtml}
        <p style="font-size: 14px; letter-spacing: 0.15em; margin: ${spacing}px 0 6px; color: ${palette.text};">
          ${c.date || "Date"}
        </p>
        <p style="font-size: 13px; color: ${palette.muted}; margin: 0 0 4px;">
          ${c.time || "Time"}
        </p>
        <p style="font-size: 13px; color: ${palette.muted}; margin: ${spacing}px 0 2px;">
          ${c.venue || "Venue"}
        </p>
        <p style="font-size: 12px; color: ${palette.muted}; margin: 0;">
          ${c.address || "Address"}
        </p>
      `;
      break;

    case "rsvp":
      body = `
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px;">
          Kindly Respond
        </p>
        <h2 style="font-size: 28px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing}px;">
          RSVP
        </h2>
        ${ornamentHtml}
        <p style="font-size: 13px; color: ${palette.text}; margin: ${spacing}px 0; line-height: 1.7;">
          Please respond by ${c.rsvpDeadline || "Date"}
        </p>
        <div style="margin-top: ${spacing}px; width: 80%; border-bottom: 1px solid ${palette.accent}; padding-bottom: 6px;">
          <p style="font-size: 11px; color: ${palette.muted}; margin: 0; text-align: left;">Name(s)</p>
        </div>
        <div style="margin-top: ${spacing}px; display: flex; gap: 24px; font-size: 13px; color: ${palette.text};">
          <span>\u25CB Joyfully Accepts</span>
          <span>\u25CB Regretfully Declines</span>
        </div>
      `;
      break;

    case "details":
      body = `
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px;">
          Wedding Day
        </p>
        <h2 style="font-size: 28px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing}px;">
          Details
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing}px 0; line-height: 1.8; font-size: 13px;">
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 4px;">Ceremony</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px;">${c.ceremonyDetails || ""}</p>
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 4px;">Reception</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px;">${c.receptionDetails || ""}</p>
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 4px;">Dress Code</p>
          <p style="color: ${palette.text}; margin: 0;">${c.dressCode || ""}</p>
        </div>
      `;
      break;

    case "menu":
      body = `
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px;">
          Dinner
        </p>
        <h2 style="font-size: 28px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing}px;">
          Menu
        </h2>
        ${ornamentHtml}
        <div style="margin: ${spacing}px 0; line-height: 1.8; font-size: 13px;">
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 2px;">Appetizer</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px;">${c.appetizer || ""}</p>
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 2px;">Entr\u00e9e</p>
          <p style="color: ${palette.text}; margin: 0 0 ${spacing}px;">${c.entree || ""}</p>
          <p style="font-weight: 600; color: ${palette.primary}; margin: 0 0 2px;">Dessert</p>
          <p style="color: ${palette.text}; margin: 0;">${c.dessert || ""}</p>
        </div>
      `;
      break;

    case "thankyou":
      body = `
        <p style="font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: ${palette.muted}; margin: 0 0 ${spacing}px;">
          With Gratitude
        </p>
        <h2 style="font-size: 28px; font-weight: 300; color: ${palette.primary}; margin: 0 0 ${spacing}px;">
          Thank You
        </h2>
        ${ornamentHtml}
        <p style="font-size: 14px; color: ${palette.text}; line-height: 1.8; margin: ${spacing}px 0; max-width: 360px;">
          ${c.thankYouMessage || ""}
        </p>
        <p style="font-size: 15px; font-style: italic; color: ${palette.primary}; margin: ${spacing}px 0 0;">
          ${c.name1 || ""} & ${c.name2 || ""}
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
    @page { size: 5in 7in; margin: 0; }
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
 * Generate full suite HTML — all 5 pieces as separate pages.
 */
export function generateSuiteHtml(
  design: Design,
  template: Template,
  palette: Palette,
  font: Font,
): string {
  const pieces: SuitePiece[] = ["invitation", "rsvp", "details", "menu", "thankyou"];
  const googleFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.googleFontsFamily)}&display=swap`;

  const pagesHtml = pieces.map((piece) => {
    const singleHtml = renderPieceHtml(piece, design, template, palette, font);
    // Extract body content only
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
