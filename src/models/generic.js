const { Schema, model } = require("mongoose");

const genericSchema = new Schema(
  {
    name: {
      type: String,
    },
    body: {},
  },
  { timestamps: true }
);

module.exports = model("genericrequest", genericSchema);
