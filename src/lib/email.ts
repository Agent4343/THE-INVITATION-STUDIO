import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured.");
    }
    _resend = new Resend(resendApiKey);
  }
  return _resend;
}

const FROM_ADDRESS = "The Invitation Studio <orders@theinvitationstudio.com>";

const TIER_NAMES: Record<string, string> = {
  standard: "Event Stationery Suite Builder",
  premium: "Premium Event Stationery Suite Builder",
  complete: "Complete Event Stationery Suite + Premium Templates",
};

export async function sendAccessCodeEmail(
  email: string,
  code: string,
  tier: string,
) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://theinvitationstudio.com";
  const tierName = TIER_NAMES[tier] || tier;
  const designUrl = `${APP_URL}/design?code=${code}`;

  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Your Access Code — The Invitation Studio",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #3d3427; background-color: #fdfbf7;">
        <h1 style="font-size: 22px; font-weight: normal; text-align: center; letter-spacing: 0.05em; margin-bottom: 8px;">
          The Invitation Studio
        </h1>
        <p style="text-align: center; font-size: 14px; color: #9a8e7f; margin-top: 0;">
          Welcome to your creative journey
        </p>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />

        <p style="line-height: 1.7; text-align: center;">
          Thank you for purchasing the <strong>${tierName}</strong>. Your access code is ready.
        </p>

        <div style="background-color: #f5f0e8; border: 1px solid #e0d6c8; border-radius: 8px; padding: 24px; margin: 28px 0; text-align: center;">
          <p style="font-size: 13px; color: #9a8e7f; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.1em;">
            Your Access Code
          </p>
          <p style="font-size: 28px; font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 0.15em; color: #3d3427; margin: 0;">
            ${code}
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${designUrl}" style="display: inline-block; background-color: #3d3427; color: #ffffff; text-decoration: none; padding: 14px 36px; font-family: Georgia, serif; font-size: 15px; letter-spacing: 0.05em; border-radius: 4px;">
            Start Designing
          </a>
        </div>

        <p style="line-height: 1.7; font-size: 14px;">
          <strong>How to get started:</strong>
        </p>
        <ol style="line-height: 1.9; font-size: 14px; padding-left: 20px;">
          <li>Click the button above or visit <a href="${designUrl}" style="color: #6b5e4f;">${APP_URL}/design</a></li>
          <li>Enter your access code when prompted</li>
          <li>Choose your template and begin customizing</li>
        </ol>

        <p style="line-height: 1.7; font-size: 14px;">
          Save this email for your records. Your access code can be used to return
          to your design at any time.
        </p>

        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9a8e7f; text-align: center;">
          Need help? Reply to this email or reach us at
          <a href="mailto:support@theinvitationstudio.com" style="color: #9a8e7f;">support@theinvitationstudio.com</a>
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send access code email: ${error.message}`);
  }
}
