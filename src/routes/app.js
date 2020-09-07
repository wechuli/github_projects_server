const express = require("express");
const axios = require("axios");
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
  const payload = req.body;
  const HTTP_X_GITHUB_EVENT = req.headers["x-github-event"];

  const headers = {
    "Content-Type": "text/plain",
    "Ocp-Apim-Subscription-Key": process.env.AZURE_COGNITIVE,
  };

  console.log(req.body);

  try {
    if (HTTP_X_GITHUB_EVENT === "issues" && payload["action"] == "opened") {
      const owner = payload["repository"]["owner"]["login"];
      const repo = payload["repository"]["name"];
      const issue_number = payload["issue"]["number"];
      const issue_body = payload["issue"]["body"];

      const azure_moderation = await axios.post(
        "https://cognitive-services-playground.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen?classify=True",
        issue_body,
        { headers: headers }
      );

      const reviewRecommended =
        azure_moderation.data["Classification"]["ReviewRecommended"];

      const { data } = await request("GET /repos/:owner/:repo/installation", {
        owner,
        repo,
        headers: {
          authorization: `Bearer ${jwt}`,
          accept: "application/vnd.github.machine-man-preview+json",
        },
      });

      const installationId = data.id;

      const installationAccessToken = await app.getInstallationAccessToken({
        installationId,
      });

      if (reviewRecommended) {
        // label a danger issue
        await request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
          {
            owner,
            repo,
            issue_number,
            labels: ["danger"],

            headers: {
              authorization: `token ${installationAccessToken}`,
              accept: "application/vnd.github.machine-man-preview+json",
            },
          }
        );

        // close the issue
        await request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
          owner,
          repo,
          issue_number,
          state: "closed",
          headers: {
            authorization: `token ${installationAccessToken}`,
            accept: "application/vnd.github.machine-man-preview+json",
          },
        });
      } else {
        await request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
          {
            owner,
            repo,
            issue_number,
            labels: ["needs-response", "okay"],

            headers: {
              authorization: `token ${installationAccessToken}`,
              accept: "application/vnd.github.machine-man-preview+json",
            },
          }
        );
      }
    }

    res.status(200).json({ error: false, message: "Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
