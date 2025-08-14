import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DESCI_RESEARCH_DATABASE_URL,
});

export default pool;
