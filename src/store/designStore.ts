import { create } from "zustand";
import type {
  Template,
  Palette,
  Font,
  DesignContent,
  SuitePiece,
  BuilderStep,
} from "@/types";
import { templates } from "@/data/templates";
import { palettes } from "@/data/palettes";
import { fonts } from "@/data/fonts";

const defaultContent: DesignContent = {
  name1: "",
  name2: "",
  preHeading: "",
  conjunction: "&",
  date: "",
  time: "",
  venue: "",
  address: "",
  rsvpDeadline: "",
  ceremonyDetails: "",
  receptionDetails: "",
  dressCode: "",
  appetizer: "",
  entree: "",
  dessert: "",
  thankYouMessage: "",
};

interface DesignState {
  template: Template;
  palette: Palette;
  font: Font;
  content: DesignContent;
  activePiece: SuitePiece;
  currentStep: BuilderStep;
  designId: string | null;
  token: string | null;
  isSaving: boolean;
  lastSavedAt: string | null;
  isGeneratingPdf: boolean;

  setTemplate: (template: Template) => void;
  setPalette: (palette: Palette) => void;
  setFont: (font: Font) => void;
  setContent: (content: Partial<DesignContent>) => void;
  setActivePiece: (piece: SuitePiece) => void;
  setCurrentStep: (step: BuilderStep) => void;
  setDesignId: (id: string) => void;
  setToken: (token: string) => void;
  setSaving: (saving: boolean) => void;
  setLastSavedAt: (date: string) => void;
  setGeneratingPdf: (generating: boolean) => void;
  resetDesign: () => void;
}

const initialState = {
  template: templates[0],
  palette: palettes[0],
  font: fonts[0],
  content: defaultContent,
  activePiece: "invitation" as SuitePiece,
  currentStep: "template" as BuilderStep,
  designId: null,
  token: null,
  isSaving: false,
  lastSavedAt: null,
  isGeneratingPdf: false,
};

export const useDesignStore = create<DesignState>((set) => ({
  ...initialState,

  setTemplate: (template) => set({ template }),
  setPalette: (palette) => set({ palette }),
  setFont: (font) => set({ font }),
  setContent: (content) =>
    set((state) => ({ content: { ...state.content, ...content } })),
  setActivePiece: (piece) => set({ activePiece: piece }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setDesignId: (id) => set({ designId: id }),
  setToken: (token) => set({ token }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setGeneratingPdf: (generating) => set({ isGeneratingPdf: generating }),
  resetDesign: () => set(initialState),
}));
