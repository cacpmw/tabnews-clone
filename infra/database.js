//psql --host=localhost --port=5432 --username=local_user
import { Client } from "pg";

async function query(queryString) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
    const result = await client.query(queryString);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    //this certifies db connection is closed no matter what
    await client.end();
  }
}

export default {
  query: query,
};
