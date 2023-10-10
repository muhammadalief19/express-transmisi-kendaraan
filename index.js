const express = require("express");
const app = express();
const port = 1908;
const transmisiRouter = require("./routes/transmisi.js");

// import body-parser
const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.get("/", (req, res) => {
  res.send("Hallo Sayang ❤️");
});

app.use("/api/transmisi", transmisiRouter);

app.listen(port, () => {
  console.log(`Aplikasi ini berjalan pada port: ${port}`);
});
