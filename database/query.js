const executeQuery = ({ db, query, params }) => {
  return new Promise((resolve, reject) => {
    db.query(query, [params], (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
};

const getById = ({ db, query, id }) => {
  return new Promise((resolve, reject) => {
    db.query(query, [id], (error, row) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
};

const create = ({ db, query, params }) => {
  return new Promise(async (resolve, reject) => {
    const rs = await db.query(query, [params]);
    const rowAffectd = rs.rowAffectd;
    if (rowAffectd > 0) return true;
    return false;
  });
};

const getOne = ({ db, query, params }) => {
  return new Promise((resolve, reject) => {
    db.query(query, [params], (err, rows) => {
      if (err) reject(err);
      const data = rows[0];
      resolve(data);
    });
  });
};

module.exports = {
  executeQuery,
  getOne,
  create,
};
