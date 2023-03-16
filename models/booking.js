const { Schema, model } = require("mongoose");

// Booking Schema
const BookingSchema = new Schema(
  {
    bookingStart: { type: Date },
    bookingEnd: { type: Date },
    startHour: { type: Number },
    duration: { type: Number },
    purpose: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Booking", BookingSchema);
