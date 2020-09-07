const express = require("express");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

const APP_ID = process.env.APP_ID; // replace with your app ID
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
const jwt = app.getSignedJsonWebToken();

const router = express.Router();

router.post("/auth", async (req, res) => {
  try {
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

router.post("/install", async (req, res) => {
  const payload = JSON.parse(req.body["payload"]);
  const HTTP_X_GITHUB_EVENT = req.headers["x-github-event"];

  try {
    if (HTTP_X_GITHUB_EVENT === "issues" && payload["action"] == "opened") {
      await request("POST /repos/{owner}/{repo}/issues/{issue_number}/labels", {
        owner: payload["repository"]["owner"]["login"],
        repo: payload["repository"]["name"],
        issue_number: payload["issue"]["number"],
        labels: ["needs-response"],
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: "application/vnd.github.machine-man-preview+json",
        },
      });
    }
    console.log(req.body);
    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

router.post("/all", async (req, res) => {
  //  const payload = JSON.parse(req.body["payload"]);
  //const HTTP_X_GITHUB_EVENT = req.headers["x-github-event"];

  console.log(req.body);

  try {
    // if (HTTP_X_GITHUB_EVENT === "issues" && payload["action"] == "opened") {
    //   await request("POST /repos/{owner}/{repo}/issues/{issue_number}/labels", {
    //     owner: payload["repository"]["owner"]["login"],
    //     repo: payload["repository"]["name"],
    //     issue_number: payload["issue"]["number"],
    //     labels: ["needs-response"],
    //     headers: {
    //       authorization: `Bearer ${jwt}`,
    //       accept: "application/vnd.github.machine-man-preview+json",
    //     },
    //   });
    // }

    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
