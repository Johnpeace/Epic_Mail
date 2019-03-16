/* eslint-disable import/prefer-default-export */
import { Pool } from 'pg';
import moment from 'moment';
import query from '../db/index';

let connectionString;
/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
/* istanbul ignore next */
  connectionString = process.env.TEST_DB;
} else {
  connectionString = process.env.DEV_DB;
}

const pool = new Pool({ connectionString });

pool.connect();

class Group {
  /* istanbul ignore next */
  static async createGroupTable() {
  /* istanbul ignore next */
    const queryText = `CREATE TABLE IF NOT EXISTS
        groups(
          id SERIAL NOT NULL UNIQUE PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          role VARCHAR(128),
          ownerId INTEGER,
          createdAt TIMESTAMP,
          updatedAt TIMESTAMP,
          FOREIGN KEY (ownerId) REFERENCES users (id) ON DELETE CASCADE
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
  }

  /* istanbul ignore next */
  static async dropGroupTable() {
  /* istanbul ignore next */
    const queryText = 'DROP TABLE IF EXISTS groups CASCADE';
    /* istanbul ignore next */
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
  }

  static async sendGroupMessage({ name, userId }) {
    const dbQuery = `INSERT INTO
      groups(name, ownerid, role, createdat, updatedat)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [name, userId, 'admin', moment(new Date()), moment(new Date())];

    try {
      const { rows } = await query(dbQuery, values);
      return {
        success: true,
        data: { ...rows[0] },
      };
    } catch (error) {
      return {
        success: false,
        error: [error],
      };
    }
  }
}

export { Group };
