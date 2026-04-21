// worker.js
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { WhatsappTextMessage } from "./whatsapp/processWhatsapp";

const connection = new IORedis(process.env.REDIS_URL);

const worker = new Worker(
  "whatsapp",
  async (job) => {
    const { phone, text_message } = job.data;

    console.log("Processing job:", job.id);

    await WhatsappTextMessage({
      phone,
      text_message,
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
