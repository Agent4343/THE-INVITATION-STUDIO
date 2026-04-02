import type { ShippingAddress } from "@/types";

const PRODIGI_BASE_URL = process.env.PRODIGI_BASE_URL!;
const PRODIGI_API_KEY = process.env.PRODIGI_API_KEY!;

function headers() {
  return {
    "X-API-Key": PRODIGI_API_KEY,
    "Content-Type": "application/json",
  } as const;
}

export async function createProdigiOrder(
  pdfUrl: string,
  items: Array<{ piece: string; quantity: number; paper: string }>,
  shippingAddress: ShippingAddress,
) {
  const response = await fetch(`${PRODIGI_BASE_URL}/v4.0/Orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      shippingMethod: "Standard",
      recipient: {
        name: shippingAddress.name,
        address: {
          line1: shippingAddress.address1,
          line2: shippingAddress.address2 || "",
          postalOrZipCode: shippingAddress.zip,
          townOrCity: shippingAddress.city,
          stateOrCounty: shippingAddress.state,
          countryCode: shippingAddress.country,
        },
      },
      items: items.map((item) => ({
        sku: `invitation-${item.paper}`,
        copies: item.quantity,
        sizing: "fillPrintArea",
        assets: [
          {
            printArea: "default",
            url: pdfUrl,
          },
        ],
        attributes: {
          piece: item.piece,
        },
      })),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Prodigi order creation failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function getProdigiOrderStatus(orderId: string) {
  const response = await fetch(`${PRODIGI_BASE_URL}/v4.0/Orders/${orderId}`, {
    method: "GET",
    headers: headers(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Prodigi order fetch failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}
