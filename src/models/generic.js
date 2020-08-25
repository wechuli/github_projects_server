const { Schema, model } = require("mongoose");

const genericSchema = new Schema(
  {
    name: {
      type: String,
    },
    body: {},
  },
  { timestamps: true, strict: false }
);

module.exports = model("genericrequest", genericSchema);
