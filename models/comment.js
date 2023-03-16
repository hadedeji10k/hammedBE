const { Schema, model } = require("mongoose");

// Comment Schema
const CommentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", CommentSchema);
