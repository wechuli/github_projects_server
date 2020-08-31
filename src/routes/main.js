const express = require("express");
const axios = require("axios");
const genericData = require("../models/generic");
const { delay, octokit } = require("../utility/utilityMain");
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
  const payload = JSON.parse(req.body["payload"]);
  const HTTP_X_GITHUB_EVENT = req.headers["x-github-event"];
  const statusContext = "Super_awesome_check";
  try {
    if (
      HTTP_X_GITHUB_EVENT === "pull_request" &&
      payload["action"] == "opened"
    ) {
      await octokit.request("POST /repos/{owner}/{repo}/statuses/{sha}", {
        owner: payload["repository"]["owner"]["login"],
        repo: payload["repository"]["name"],
        sha: payload["pull_request"]["head"]["sha"],
        context: statusContext,
        state: "pending",
      });

      await delay(10000);

      await octokit.request("POST /repos/{owner}/{repo}/statuses/{sha}", {
        owner: payload["repository"]["owner"]["login"],
        repo: payload["repository"]["name"],
        sha: payload["pull_request"]["head"]["sha"],
        context: statusContext,
        state: "success",
      });

      res.status(200).json({
        error: false,
        title: payload["pull_request"]["title"],
        message: "successful",
        headers: req.headers,
      });
    }

    res.status(200).json({
      message: "something is not right",
      HTTP_X_GITHUB_EVENT,
      body: payload,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "something unexpected happened" });
  }
});
module.exports = router;
