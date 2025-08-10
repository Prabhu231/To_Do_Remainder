import sendMail from "./services/sendMail.js";

const sendScheduledMail = async () => {
  await sendMail();
};

sendScheduledMail();
