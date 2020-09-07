const express = require("express");

const router = express.Router();

router.post("/auth", (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

router.post("/install", (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

router.post("/all", (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
