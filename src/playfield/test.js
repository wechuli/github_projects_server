const fs = require("fs");

const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

const privateKey = fs.readFileSync("../../config/key.pem").toString();

const APP_ID = 80009; // replace with your app ID
const PRIVATE_KEY = privateKey;

const app = new App({ id: APP_ID, privateKey: PRIVATE_KEY });
const jwt = app.getSignedJsonWebToken();

async function DoAll() {
  const { data } = await request("GET /repos/:owner/:repo/installation", {
    owner: "wechuli",
    repo: "react_projects",
    headers: {
      authorization: `Bearer ${jwt}`,
      accept: "application/vnd.github.machine-man-preview+json",
    },
  });

  // contains the installation id necessary to authenticate as an installation
  const installationId = data.id;
  console.log(installationId);
  //   const installationAccessToken = await app.getInstallationAccessToken({
  //     installationId: 11694869,
  //   });

  const installationAccessToken = await app.getInstallationAccessToken({
    installationId,
  });

  await request("POST /repos/:owner/:repo/issues", {
    owner: "wechuli",
    repo: "react_projects",
    headers: {
      authorization: `token ${installationAccessToken}`,
      accept: "application/vnd.github.machine-man-preview+json",
    },
    title: "An issue created by a bot",
    body: "This is just a body",
  });
}

DoAll();

// https://developer.github.com/v3/issues/#create-an-issue
// request("POST /repos/:owner/:repo/issues", {
//   owner: "paulosmallz",
//   repo: "new_repo",
//   headers: {
//     authorization: `token ${installationAccessToken}`,
//     accept: "application/vnd.github.machine-man-preview+json",
//   },
//   title: "My installation’s first issue",
// });

// request("POST /repos/{owner}/{repo}/issues/{issue_number}/labels", {
//   owner: "paulosmallz",
//   repo: "new_repo",
//   issue_number: 5,
//   labels: ["needs-response"],
//   headers: {
//     authorization: `Bearer ${jwt}`,
//     accept: "application/vnd.github.machine-man-preview+json",
//   },
// })
//   .then((response) => console.log(response.data))
//   .catch((error) => console.log(error));
