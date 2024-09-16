//psql --host=localhost --port=5432 --username=local_user
import { Client } from "pg";

function getSSLValues() {
  //console.log(`NODE_ENV> ${process.env.NODE_ENV}`);
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production" ? true : false;
}
async function query(queryString) {
  let client;
  try {
    client = await getNewDBClient();
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

async function getNewDBClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  client.connect();
  return client;
}
export default {
  query,
  getNewDBClient,
};
