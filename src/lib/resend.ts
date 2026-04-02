import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

const FROM_ADDRESS = "The Invitation Studio <orders@theinvitationstudio.com>";

export async function sendOrderConfirmation(email: string, orderId: string) {
  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Your print order has been placed",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #3d3427;">
        <h1 style="font-size: 22px; font-weight: normal; text-align: center; letter-spacing: 0.05em;">
          The Invitation Studio
        </h1>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="line-height: 1.7;">
          Thank you for your order! We have received your print request and it is
          now being prepared.
        </p>
        <p style="line-height: 1.7;">
          <strong>Order ID:</strong> ${orderId}
        </p>
        <p style="line-height: 1.7;">
          We will send you another email once your invitations have shipped.
          Most orders are printed and dispatched within 3-5 business days.
        </p>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9a8e7f; text-align: center;">
          If you have any questions, reply to this email and we will be happy to help.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send order confirmation: ${error.message}`);
  }
}

export async function sendShippingNotification(
  email: string,
  trackingNumber: string,
) {
  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: "Your invitations have shipped!",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #3d3427;">
        <h1 style="font-size: 22px; font-weight: normal; text-align: center; letter-spacing: 0.05em;">
          The Invitation Studio
        </h1>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="line-height: 1.7;">
          Great news! Your invitations are on their way.
        </p>
        <p style="line-height: 1.7;">
          <strong>Tracking number:</strong> ${trackingNumber}
        </p>
        <p style="line-height: 1.7;">
          You can typically track your parcel on your carrier's website within
          24 hours. Delivery usually takes 5-7 business days.
        </p>
        <hr style="border: none; border-top: 1px solid #e0d6c8; margin: 24px 0;" />
        <p style="font-size: 13px; color: #9a8e7f; text-align: center;">
          If you have any questions, reply to this email and we will be happy to help.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send shipping notification: ${error.message}`);
  }
}
