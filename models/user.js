const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      // install validator email
      validate: [isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "min password length is 8"],
      // regEx- uppercase,lowercase, one number a special character
      validate: {
        validator: function (v) {
          const test =
            /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@.#$!%?&])[A-Za-z\d@.#$!%?&]+$/.test(
              v
            );
          return !test;
        },
      },
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);
// mongooose pre save hook- protect users password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("user", userSchema);
