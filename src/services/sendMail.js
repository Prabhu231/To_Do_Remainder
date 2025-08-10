import nodemailer from "nodemailer";
import fetchAirtableRows from "./airtable.js";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async () => {
  try {
    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASSWORD;
    const receiver = process.env.EMAIL_RECEIVER;

    const rows = await fetchAirtableRows();

    const mainKeys = ["Date", "Tasks", "Time"];

    const rowsText = rows
      .map(
        (row, index) =>
          `${index + 1}. Date: ${row.Date || ""}, Tasks: ${
            row.Tasks || ""
          }, Time: ${row.Time || ""}`
      )
      .join("\n");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
    const dateObj = new Date(today);

    function getOrdinal(n) {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    }

    const formattedDate = `${dateObj.getDate()}${getOrdinal(
      dateObj.getDate()
    )} ${dateObj.toLocaleString("en-US", {
      month: "long",
    })} ${dateObj.getFullYear()}`;

    const rowsHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          
          .email-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            animation: float 20s infinite linear;
            pointer-events: none;
          }
          
          @keyframes float {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .header .date {
            font-size: 1.1rem;
            font-weight: 300;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .agenda-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }
          
          .agenda-table thead {
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
          }
          
          .agenda-table th {
            padding: 18px 15px;
            text-align: left;
            font-weight: 600;
            color: #2d3748;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
          }
          
          .agenda-table th:first-child {
            text-align: center;
            width: 60px;
          }
          
          .agenda-table td {
            padding: 16px 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 0.95rem;
            color: #4a5568;
            transition: all 0.2s ease;
          }
          
          .agenda-table td:first-child {
            text-align: center;
            font-weight: 600;
            background: #f7fafc;
            color: #2d3748;
            border-right: 2px solid #e2e8f0;
          }
          
          .agenda-table tbody tr {
            transition: all 0.3s ease;
          }
          
          .agenda-table tbody tr:hover {
            background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
            transform: scale(1.01);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          
          .agenda-table tbody tr:nth-child(even) {
            background: #f8fafc;
          }
          
          .agenda-table tbody tr:nth-child(even):hover {
            background: linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%);
          }
          
          .task-cell {
            max-width: 300px;
            word-wrap: break-word;
            line-height: 1.5;
          }
          
          .time-cell {
            font-weight: 500;
            color: #059669;
            background: #ecfdf5;
            border-radius: 6px;
            padding: 4px 8px;
            display: inline-block;
            font-size: 0.9rem;
          }
          
          .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 0.9rem;
          }
          
          .footer-icon {
            width: 24px;
            height: 24px;
            margin: 0 auto 10px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
          
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
          }
          
          .empty-state h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #4a5568;
          }
          
          @media (max-width: 600px) {
            .email-container {
              margin: 10px;
              border-radius: 12px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .header h1 {
              font-size: 2rem;
            }
            
            .content {
              padding: 30px 20px;
            }
            
            .agenda-table {
              font-size: 0.9rem;
            }
            
            .agenda-table th,
            .agenda-table td {
              padding: 12px 8px;
            }
            
            .task-cell {
              max-width: 200px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📋 Daily Agenda</h1>
            <div class="date">${formattedDate}</div>
          </div>
          
          <div class="content">
            ${
              rows.length > 0
                ? `
              <table class="agenda-table">
                <thead>
                  <tr>
                    <th>#</th>
                    ${mainKeys.map((key) => `<th>${key}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${rows
                    .map(
                      (row, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td class="task-cell">${row.Date || ""}</td>
                      <td class="task-cell">${row.Tasks || ""}</td>
                      <td><span class="time-cell">${row.Time || ""}</span></td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : `
              <div class="empty-state">
                <h3>🌟 No tasks scheduled</h3>
                <p>Enjoy your free day!</p>
              </div>
            `
            }
          </div>
          
          <div class="footer">
            <div class="footer-icon">✓</div>
            <p>Generated automatically from your Airtable • Have a productive day!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: password,
      },
    });

    let mailOptions = {
      from: `"Prabhu" <${user}>`,
      to: receiver,
      subject: `📋 Agenda for ${formattedDate}`,
      text: rowsText,
      html: rowsHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendMail;
