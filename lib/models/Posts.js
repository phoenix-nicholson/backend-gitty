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

  static getPosts() {
    return pool
      .query(
        `SELECT *
          FROM posts`
      )

      .then(({ rows }) => rows.map((row) => new Post(row)));
  }
};
