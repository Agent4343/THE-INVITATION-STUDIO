import { Template } from "../types";

export const templates: Template[] = [
  {
    id: "classic-elegance",
    name: "Classic Elegance",
    layout: "centered",
    ornament: true,
    borderStyle: "thin",
    spacingRatio: 1.4,
    thumbnail: "/images/templates/classic-elegance.jpg",
  },
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    layout: "centered",
    ornament: false,
    borderStyle: "none",
    spacingRatio: 1.6,
    thumbnail: "/images/templates/modern-minimalist.jpg",
  },
  {
    id: "romantic-garden",
    name: "Romantic Garden",
    layout: "centered",
    ornament: true,
    borderStyle: "double",
    spacingRatio: 1.3,
    thumbnail: "/images/templates/romantic-garden.jpg",
  },
  {
    id: "rustic-charm",
    name: "Rustic Charm",
    layout: "left",
    ornament: true,
    borderStyle: "thin",
    spacingRatio: 1.5,
    thumbnail: "/images/templates/rustic-charm.jpg",
  },
];
