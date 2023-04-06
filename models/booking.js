const { Schema, model } = require("mongoose");

// Booking Schema
const BookingSchema = new Schema(
  {
    bookingStart: { type: Date },
    bookingEnd: { type: Date },
    purpose: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

module.exports = model("Booking", BookingSchema);
