import cron from "node-cron";
import sendMail from "./services/sendMail.js";

cron.schedule(
  "0 8,14,18 * * *",
  async () => {
    try {
      await sendMail();
    } catch (err) {
      console.log(err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
