const express = require("express");

const router = express.Router();

router.get("/auth", (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
