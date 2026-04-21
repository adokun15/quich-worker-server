export const WhatsappTextMessage = async ({
  phone,
  text_message,
  //  enable_preview = false,
}) => {
  const option = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `${phone}`,
      type: "text",
      text: {
        //      preview_url: enable_preview,
        body: text_message,
      },
    }),
  };
  console.log(JSON.stringify(option));
  try {
    const api_endpoint = await fetch(
      `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
      option,
    );

    const res = await api_endpoint.json();
    if (res?.error) {
      console.log(res?.error);
      throw new CustomError(res?.error?.message);
    }
    return { status: "success", res };
  } catch (e) {
    console.log(e);
    return { status: "failed", message: e?.message || "Failed to send!" };
  }
};
