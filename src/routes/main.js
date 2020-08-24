const express = require("express");
const genericData = require("../models/generic");
const router = express.Router();

// route for testing the server
router.get("/", async (req, res) => {
  const { body } = req;
  try {
    console.log(requestBody);
    res.status(200).json({ error: false, message: "request successful" });
  } catch (error) {
    res.status(500).json({ error: true });
  }
});

// memberships

router.get("/member", async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    res
      .status(200)
      .json({ error: true, message: "webhook successfully received" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "something unexpected happened" });
  }
});

module.exports = router;
