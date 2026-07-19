import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, default: "" },
    lastName: { type: String, required: true, trim: true },
    vadan: { type: String, required: true, enum: ["Dhol", "Tasha"] },
    contactNumber: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
  },
  { timestamps: true }
);

// Virtual full name, also used for sorting on the client
studentSchema.virtual("fullName").get(function () {
  return [this.firstName, this.middleName, this.lastName]
    .filter(Boolean)
    .join(" ");
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

export default mongoose.model("Student", studentSchema);
