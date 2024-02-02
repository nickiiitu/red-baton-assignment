const user = require("../models/userModel");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { password, email } = req.body;
  try {
    const userExists = await user.findOne({ email });
    const b = await bcrypt.compare(password, userExists.password);
    if (!b) {
      res.status(404);
      throw new Error({ message: "Incorrect Password" });
    }
    res.status(200).send(userExists);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await user.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error({ message: "User Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const NewPassword = await bcrypt.hash(password, salt);

    const newUser = await user.create({
      name,
      email,
      password: NewPassword,
    });
    delete newUser.password;
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports = { login, signup };
