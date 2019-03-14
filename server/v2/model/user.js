import { Pool } from 'pg';

let connectionString;
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.TEST_DB;
} else {
  connectionString = process.env.DEV_DB;
}

const pool = new Pool({ connectionString });

pool.connect();
/* istanbul ignore next */
const createUserTable = async () => {
/* istanbul ignore next */
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL NOT NULL UNIQUE,
        firstname VARCHAR(128) NOT NULL,
        lastname VARCHAR(128),
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        avatar VARCHAR(128),
        createdAt TIMESTAMP,
        updatedAt TIMESTAMP
      )`;
  await pool
    .query(queryText)
  /* istanbul ignore next */
    .then(() => {
    /* istanbul ignore next */
      pool.end();
    })
  /* istanbul ignore next */
    .catch(() => {
    /* istanbul ignore next */
      pool.end();
    });
};
/* istanbul ignore next */
const dropUserTable = () => {
/* istanbul ignore next */
  const queryText = 'DROP TABLE IF EXISTS users CASCADE';
  /* istanbul ignore next */
  pool
    .query(queryText)
  /* istanbul ignore next */
    .then(() => {
    /* istanbul ignore next */
      pool.end();
    })
  /* istanbul ignore next */
    .catch(() => {
    /* istanbul ignore next */
      pool.end();
    });
};

export { dropUserTable, createUserTable };
