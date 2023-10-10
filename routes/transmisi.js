const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database

// membuat route
router.get("/", (req, res) => {
  connect.query(
    "SELECT * FROM transmisi ORDER BY id_transmisi DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data transmisi",
          data: rows,
        });
      }
    }
  );
});

// membuat route store
router.post("/", [body("nama_transmisi").notEmpty()], (req, res) => {
  const error = validationResult(req);

  // ketika validasi gagal
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: array,
    });
  }

  let data = {
    nama_transmisi: req.body.nama_transmisi,
  };

  connect.query("INSERT INTO transmisi set ? ", data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    } else {
      return res.status(201).json({
        status: true,
        message: "transmisi berhasil ditambahkan",
        data: data,
      });
    }
  });
});

// membuat route get mahasiswa by id
router.get("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(
    `SELECT * FROM transmisi where id_transmisi=${id}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data transmisi",
          payload: rows[0],
        });
      }
    }
  );
});

// membuat route update
router.patch("/(:id)", [body("nama_transmisi").notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let id = req.params.id;
  let data = {
    nama_transmisi: req.body.nama_transmisi,
  };
  connect.query(
    `UPDATE transmisi set ? where id_transmisi=${id}`,
    data,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "transmisi berhasil diupdate",
          data: data,
        });
      }
    }
  );
});

// membuat route delete
router.delete("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(
    `DELETE FROM transmisi WHERE id_transmisi=${id}`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "transmisi berhasil di delete",
        });
      }
    }
  );
});

module.exports = router;
