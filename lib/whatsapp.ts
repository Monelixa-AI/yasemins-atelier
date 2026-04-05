const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

function getConfig() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp yapilandirmasi eksik (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)");
  }

  return { token, phoneNumberId };
}

/* ------------------------------------------------------------------ */
/*  Metin Mesaji Gonder                                                */
/* ------------------------------------------------------------------ */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<{ success: boolean; messageId?: string }> {
  const { token, phoneNumberId } = getConfig();

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("WhatsApp mesaj gonderme hatasi:", errorData);
    return { success: false };
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.messages?.[0]?.id,
  };
}

/* ------------------------------------------------------------------ */
/*  Template Mesaji Gonder                                             */
/* ------------------------------------------------------------------ */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  params?: string[]
): Promise<{ success: boolean; messageId?: string }> {
  const { token, phoneNumberId } = getConfig();

  const components = params?.length
    ? [
        {
          type: "body",
          parameters: params.map((p) => ({ type: "text", text: p })),
        },
      ]
    : undefined;

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "tr" },
          ...(components ? { components } : {}),
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("WhatsApp template gonderme hatasi:", errorData);
    return { success: false };
  }

  const data = await response.json();
  return {
    success: true,
    messageId: data.messages?.[0]?.id,
  };
}
