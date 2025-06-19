import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    strName: String,
    strEmail: String,
    strMobile: String,
    strPassword: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
