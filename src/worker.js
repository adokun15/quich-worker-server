import { Worker } from "bullmq";
import IORedis from "ioredis";
import fetch from "node-fetch";

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const WhatsappTextMessage = async ({ phone, text_message }) => {
  const res = await fetch(
    `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONENUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: { body: text_message },
      }),
    },
  );

  const data = await res.json();
  console.log("WA Response:", data);

  if (data.error) throw new Error(data.error.message);
};

const worker = new Worker(
  "whatsapp",
  async (job) => {
    const { phone, text } = job.data;

    console.log("Processing job:", job.id);

    await WhatsappTextMessage({
      phone,
      text_message: text,
    });
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} done`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
