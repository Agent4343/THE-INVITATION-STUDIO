"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import InvitationPreview from "@/components/preview/InvitationPreview";
import RSVPPreview from "@/components/preview/RSVPPreview";
import DetailsPreview from "@/components/preview/DetailsPreview";
import MenuPreview from "@/components/preview/MenuPreview";
import ThankYouPreview from "@/components/preview/ThankYouPreview";
import SaveTheDatePreview from "@/components/preview/SaveTheDatePreview";
import TableNumberPreview from "@/components/preview/TableNumberPreview";
import PlaceCardPreview from "@/components/preview/PlaceCardPreview";
import WelcomeSignPreview from "@/components/preview/WelcomeSignPreview";

export default function LivePreview() {
  const { activePiece, palette, font, template, content } = useDesignStore();

  const previewProps = { palette, font, template, content };

  const previewMap: Record<string, React.ReactNode> = {
    invitation: <InvitationPreview {...previewProps} />,
    rsvp: <RSVPPreview {...previewProps} />,
    details: <DetailsPreview {...previewProps} />,
    menu: <MenuPreview {...previewProps} />,
    thankyou: <ThankYouPreview {...previewProps} />,
    savethedate: <SaveTheDatePreview {...previewProps} />,
    tablenumber: <TableNumberPreview {...previewProps} />,
    placecard: <PlaceCardPreview {...previewProps} />,
    welcomesign: <WelcomeSignPreview {...previewProps} />,
  };

  return (
    <div className="w-full">
      <div className="mb-3 text-center text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
        Live Preview
      </div>
      <div className="relative mx-auto w-full max-w-md rounded-2xl border border-stone-200 bg-stone-100 p-3 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-24 rounded-t-2xl bg-gradient-to-b from-white/80 to-transparent" />
        <div className="relative overflow-hidden rounded-xl bg-white shadow-xl">
          {previewMap[activePiece]}
        </div>
      </div>
    </div>
  );
}
