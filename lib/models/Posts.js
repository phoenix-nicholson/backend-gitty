const pool = require('../utils/pool');

module.exports = class Post {
  id;
  text;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
  }

  static insertPost({ text }) {
    return pool
      .query(
        `INSERT
            INTO posts (text) VALUES ($1) RETURNING * `,
        [text]
      )
      .then(({ rows }) => new Post(rows[0]));
  }

  static async getPosts() {
    const { rows } = await pool.query(
      `SELECT *
          FROM posts`
    );

    return rows.map((row) => new Post(row));
  }
};
