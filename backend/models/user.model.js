const mongoose = require("mongoose");
// verrifie la structure correct du mail
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "noPp.png",
    },
    carPics: {
      type: [
        {
          img1: String,
          img2: String,
          img3: String,
          img4: String,
          img5: String,
          img6: String,
        },
      ],
    },
    carprimary: {
      type: [
        {
          brand: String,
          model: String,
          date: String,
          kilometer: Number,
          cvdin: Number,
          cvfisc: Number,
        },
      ],
    },
    carsecondary: {
      type: [
        {
          location: String,
          energy: String,
          gearbox: String,
          door: Number,
          places: Number,
          color: String,
        },
      ],
    },
    matchs: {
      type: [String],
    },
    likes: {
      type: [String],
    },
    liked: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// fonction qui se déclenche avant la sauvegarde dans la table $
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
