const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const accountsid = "AC7b3a5f6552f608f7478b55ce052e4103";
const authtoken = "1d9d99e5b163259aedb813797b5aa348";
var twilioclient = require("twilio")(accountsid, authtoken);

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: "Full name can't be empty",
  },
  email: {
    type: String,
    required: "Email can't be empty",
    unique: true,
  },
  phonenumber: {
    type: String,
    required: "Number can't be empty",
  },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be atleast 4 character long"],
  },
  saltSecret: String,
});

// Custom validation for email
userSchema.path("email").validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

// Events
userSchema.pre("save", function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash;
      this.saltSecret = salt;
      next();
    });
  });
});

userSchema.methods.sendMessage = function (message, cb) {
  var self = this;
  twilioclient.messages.create(
    {
      to: self.phonenumber,
      from: "+15628421190",
      body: "Succesfully registered",
    },
    function (err, response) {
      cb.call(self, err);
    }
  );
};

mongoose.model("User", userSchema);
