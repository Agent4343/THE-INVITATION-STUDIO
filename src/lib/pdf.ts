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
    ? (() => {
        const s = template.ornamentStyle || "classic";
        const c = palette.accent;
        const line = (w: string, extra = "") =>
          `<span style="display:inline-block;width:${w};height:1px;background:${c};opacity:0.4;${extra}"></span>`;
        const wrap = (inner: string) =>
          `<div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:12px auto;color:${c};">${inner}</div>`;
        switch (s) {
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
            return wrap(`<span style="font-size:14px;opacity:0.5;">&#10048;</span>${line("50px", "border-top:1px dotted " + c + ";height:0;background:transparent;")}<span style="font-size:8px;letter-spacing:4px;">&#10047;</span>${line("50px", "border-top:1px dotted " + c + ";height:0;background:transparent;")}<span style="font-size:14px;opacity:0.5;">&#10048;</span>`);
          case "romantic":
            return wrap(`${line("50px")}<span style="font-size:14px;opacity:0.6;">&#10084;</span>${line("50px")}`);
          case "classic":
          default:
            return wrap(`${line("50px")}<span style="font-size:10px;letter-spacing:4px;">&#10022;</span>${line("50px")}`);
        }
      })()
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
