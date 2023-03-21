const { Schema, model } = require("mongoose");

// Room Schema
const RoomSchema = new Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    capacity: Number,
    price: Number,
    assets: [String],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Room", RoomSchema);
