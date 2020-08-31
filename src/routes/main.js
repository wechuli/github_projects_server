const express = require("express");
const axios = require("axios");
const genericData = require("../models/generic");
const { delay } = require("../utility/utilityMain");
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

router.post("/member", async (req, res) => {
  const { body } = req;
  try {
    console.log(body);
    const dataObject = {
      name: "member",
      body,
    };

    const newGenericData = new genericData(dataObject);
    await newGenericData.save();
    res
      .status(200)
      .json({ error: true, message: "webhook successfully received" });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "something unexpected happened" });
  }
});

// CI server for fake statuses

router.post("/test", async (req, res) => {
  const { body } = req;
  const { HTTP_X_GITHUB_EVENT } = req.headers;
  try {
    console.log(HTTP_X_GITHUB_EVENT);
    await delay(5000);
    res.status(200).json({
      error: false,
      message: "successful",
      headers: req.headers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "something unexpected happened" });
  }
});
module.exports = router;
