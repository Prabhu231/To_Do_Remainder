import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

async function fetchAirtableRows() {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_ID);

  // YYYY-MM-DD
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  console.log(today);

  const records = await base(process.env.AIRTABLE_TABLE_NAME)
    .select({
      view: "Grid view",
      filterByFormula: `{Date} = '2025-08-11'`,
    })
    .all();

  return records.map((record) => ({
    id: record.id,
    ...record.fields,
  }));
}

export default fetchAirtableRows;
