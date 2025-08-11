import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

async function fetchAirtableRowsWithRetry(maxRetries = 3, delayMs = 5000) {
  const base = new Airtable({
    apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_ID);

  // YYYY-MM-DD in Asia/Kolkata
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  console.log(today);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const records = await base(process.env.AIRTABLE_TABLE_NAME)
        .select({
          view: "Grid view",
          filterByFormula: `{Date} = '${today}'`,
        })
        .all();

      return records.map((record) => ({
        id: record.id,
        ...record.fields,
      }));
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.code || error}`);
      if (attempt === maxRetries) {
        throw error; // rethrow if all retries fail
      }
      await new Promise((res) => setTimeout(res, delayMs));
      console.log(`Retrying... (${attempt + 1}/${maxRetries})`);
    }
  }
}

export default fetchAirtableRowsWithRetry;
