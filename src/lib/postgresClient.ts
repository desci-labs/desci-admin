import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DESCI_RESEARCH_DATABASE_URL,
  statement_timeout: 15000, // 15s — must finish before Vercel's 20s timeout
  query_timeout: 15000,
});

export default pool;
