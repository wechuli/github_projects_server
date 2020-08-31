const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.github_auth_token,
});
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

module.exports = {
  delay,
  octokit,
};
