"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PurchaseStatus {
  status: "ready" | "processing";
}

function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<PurchaseStatus | null>(null);
  const [error, setError] = useState(false);

  const poll = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(
        `/api/purchase/status?session_id=${encodeURIComponent(sessionId)}`,
      );
      if (!res.ok) {
        setError(true);
        return;
      }
      const json: PurchaseStatus = await res.json();
      setData(json);

      if (json.status === "processing") {
        setTimeout(poll, 2000);
      }
    } catch {
      setError(true);
    }
  }, [sessionId]);

  useEffect(() => {
    poll();
  }, [poll]);

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7]">
        <p className="text-[#9a8e7f]">Invalid session.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl text-[#3d3427]">
            Something went wrong
          </h1>
          <p className="mt-4 text-[#9a8e7f]">
            We were unable to retrieve your purchase details. Please check your
            email for your access code, or contact{" "}
            <a
              href="mailto:support@theinvitationstudio.com"
              className="underline"
            >
              support@theinvitationstudio.com
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.status === "processing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-[#e0d6c8] border-t-[#3d3427]" />
          <h1 className="font-serif text-2xl text-[#3d3427]">
            Setting up your account&hellip;
          </h1>
          <p className="mt-3 text-[#9a8e7f]">
            This should only take a moment. Please don&rsquo;t close this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] px-4">
      <div className="w-full max-w-lg text-center">
        <p className="mb-2 text-3xl text-[#e0d6c8]">&mdash; &#10047; &mdash;</p>

        <h1 className="font-serif text-3xl tracking-wide text-[#3d3427]">
          Thank you for your purchase!
        </h1>

        <p className="mt-4 text-[#6b5e4f]">
          Your access code has been created and sent to the email address you
          used at checkout.
        </p>

        <p className="mt-6 text-sm text-[#9a8e7f]">
          Open your email to get your code, then use it on the homepage to
          start designing.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded bg-[#3d3427] px-10 py-3 font-serif text-sm tracking-wide text-white transition-colors hover:bg-[#2a241b]"
        >
          Go to Homepage
        </Link>

        <p className="mt-10 text-xs text-[#9a8e7f]">
          Questions?{" "}
          <a
            href="mailto:support@theinvitationstudio.com"
            className="underline"
          >
            support@theinvitationstudio.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#e0d6c8] border-t-[#3d3427]" />
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
