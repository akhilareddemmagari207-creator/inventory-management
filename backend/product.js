const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const csv = require("csv-parser");
const fs = require("fs");
const { body } = require("express-validator");

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

// UPDATE PRODUCT
router.put(
  "/:id",
  body("name").notEmpty(),
  body("stock").isInt(),
  (req, res) => {
    const { id } = req.params;
    const { name, unit, category, brand, stock } = req.body;

    db.get("SELECT * FROM products WHERE id = ?", [id], (err, oldProduct) => {
      if (!oldProduct) return res.status(404).json({ msg: "Not found" });

      if (oldProduct.stock !== stock) {
        db.run(
          `INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date)
           VALUES (?, ?, ?, ?)`,
          [id, oldProduct.stock, stock, new Date().toISOString()]
        );
      }

      db.run(
        `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=? WHERE id=?`,
        [name, unit, category, brand, stock, id],
        (err) => {
          if (err) return res.status(400).json({ error: err });
          res.json({ msg: "Updated" });
        }
      );
    });
  }
);

// PRODUCT HISTORY
router.get("/:id/history", (req, res) => {
  db.all(
    `SELECT * FROM inventory_history WHERE product_id=? ORDER BY change_date DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

// IMPORT CSV
router.post("/import", upload.single("csvFile"), (req, res) => {
  const products = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => products.push(row))
    .on("end", () => {
      let added = 0,
        skipped = 0;

      products.forEach((p) => {
        db.get(
          "SELECT id FROM products WHERE name=?",
          [p.name],
          (err, found) => {
            if (!found) {
              db.run(
                `INSERT INTO products (name, unit, category, brand, stock)
                 VALUES (?, ?, ?, ?, ?)`,
                [p.name, p.unit, p.category, p.brand, p.stock],
                () => {}
              );
              added++;
            } else skipped++;
          }
        );
      });

      res.json({ added, skipped });
    });
});

// EXPORT CSV
router.get("/export", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    let csv = "id,name,unit,category,brand,stock\n";
    rows.forEach((r) => {
      csv += `${r.id},${r.name},${r.unit},${r.category},${r.brand},${r.stock}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products.csv"
    );

    res.send(csv);
  });
});

module.exports = router;
