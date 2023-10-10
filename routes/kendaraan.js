const express = require("express");
const router = express.Router(); // deklarasi router
const { body, validationResult } = require("express-validator");
const connect = require("../config/db.js"); // import database
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// file filter configuration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png") {
    cb(null, true); // file diizinkan
  } else {
    cb(new Error("File Gambar harus berformat png"), false);
  }
};
// Storage Configuration and Destination Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage, fileFilter: fileFilter });

// membuat route /
router.get("/", (req, res) => {
  connect.query(
    "SELECT k.*, t.nama_transmisi FROM kendaraan as k INNER JOIN transmisi as t ON k.id_transmisi = t.id_transmisi",
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
          message: "Data kendaraan",
          data: rows,
        });
      }
    }
  );
});

// membuat route store
router.post(
  "/",
  upload.single("foto_kendaraan"),
  [
    (body("no_pol").notEmpty(),
    body("nama_kendaraan").notEmpty(),
    body("id_transmisi")),
  ],
  (req, res) => {
    const error = validationResult(req);

    // ketika validasi gagal
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: array,
      });
    }

    let data = {
      no_pol: req.body.no_pol,
      nama_kendaraan: req.body.nama_kendaraan,
      id_transmisi: req.body.id_transmisi,
      foto_kendaraan: req.file.filename,
    };

    connect.query("INSERT INTO kendaraan set ? ", data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(201).json({
          status: true,
          message: "kendaraan berhasil ditambahkan",
          payload: data,
        });
      }
    });
  }
);

// membuat route get kendaraan by id
router.get("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query(
    `SELECT k.*, t.nama_transmisi FROM kendaraan as k INNER JOIN transmisi as t ON k.id_transmisi = t.id_transmisi WHERE no_pol=?`,
    id,
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
          message: "Data kendaraan",
          payload: rows[0],
        });
      }
    }
  );
});

// membuat route update
router.patch(
  "/(:id)",
  upload.single("foto_kendaraan"),
  [
    (body("no_pol").notEmpty(),
    body("nama_kendaraan").notEmpty(),
    body("id_transmisi")),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let foto_kendaraan = req.file ? req.file.filename : null;

    connect.query("SELECT * FROM kendaraan WHERE no_pol=?", id, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Data tidak ditemukan",
        });
      }
      const namaFileLama = rows[0].foto_kendaraan;

      console;
      // hapus file lama jika ada
      if (namaFileLama && foto_kendaraan) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images",
          namaFileLama
        );
        fs.unlinkSync(pathFileLama);
      }
      let data = {
        no_pol: req.body.no_pol,
        nama_kendaraan: req.body.nama_kendaraan,
        id_transmisi: req.body.id_transmisi,
        foto_kendaraan: foto_kendaraan,
      };
      connect.query(
        `UPDATE kendaraan set ? WHERE no_pol=?`,
        [data, id],
        (err, rows) => {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "Internal Server Error",
              error: err,
            });
          }
          return res.status(200).json({
            status: true,
            message: "Kendaraan berhasil diupdate",
            payload: data,
          });
        }
      );
    });
  }
);

// membuat route delete
router.delete("/(:id)", (req, res) => {
  let id = req.params.id;
  connect.query("SELECT * FROM kendaraan WHERE no_pol=?", id, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err,
      });
    }
    if (rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Data tidak ditemukan",
      });
    }
    const namaFileLama = rows[0].foto_kendaraan;

    // hapus file lama jika ada
    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }
    connect.query(`DELETE FROM kendaraan WHERE no_pol=?`, id, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "Internal Server Error",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "kendaraan berhasil di delete",
        });
      }
    });
  });
});

module.exports = router;
