# Airtable To-Do Mailer

A simple **Node.js script** that checks an Airtable base for your **to-do list items** and sends them via email at scheduled times of the day:  
- **8:00 AM**  
- **2:00 PM**  
- **6:00 PM**

This helps you stay on track with your tasks without needing to open Airtable.

---

## 🚀 Features
- Fetches pending to-dos from Airtable.  
- Sends a nicely formatted email with the tasks.  
- Runs automatically at fixed times using `node-cron`.  
- Lightweight and easy to set up.  

---

## 📦 Tech Stack
- [Node.js](https://nodejs.org/)  
- [Airtable API](https://airtable.com/api)  
- [Nodemailer](https://nodemailer.com/)  
- [node-cron](https://github.com/node-cron/node-cron)  

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prabhu231/To_Do_Remainder.git
   cd To_Do_Remainder
   ```
2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Use PM2 for scheduling mails and keeping it active**
   ```bash
   npm install -g pm2
   pm2 start index.js --name airtable-mailer
   ```
