"use client";

import React from "react";
import { useDesignStore } from "@/store/designStore";
import InvitationPreview from "@/components/preview/InvitationPreview";
import RSVPPreview from "@/components/preview/RSVPPreview";
import DetailsPreview from "@/components/preview/DetailsPreview";
import MenuPreview from "@/components/preview/MenuPreview";
import ThankYouPreview from "@/components/preview/ThankYouPreview";

export default function LivePreview() {
  const { activePiece, palette, font, template, content } = useDesignStore();

  const previewProps = { palette, font, template, content };

  const previewMap: Record<string, React.ReactNode> = {
    invitation: <InvitationPreview {...previewProps} />,
    rsvp: <RSVPPreview {...previewProps} />,
    details: <DetailsPreview {...previewProps} />,
    menu: <MenuPreview {...previewProps} />,
    thankyou: <ThankYouPreview {...previewProps} />,
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
      >
        {previewMap[activePiece]}
      </div>
    </div>
  );
}
