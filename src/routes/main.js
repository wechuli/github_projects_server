const express = require("express");

const router = express.Router();

// route for testing the server
router.get("/", async (req, res) => {
  const requestBody = req.body;
  try {
    console.log(requestBody);
    res.status(200).json({ error: false, message: "request successful" });
  } catch (error) {
    res.status(500).json({ error: true });
  }
});




module.exports = router;