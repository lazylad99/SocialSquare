import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from 'express-validator';

/* RESGISTER USER */
export const register = async (req, res) => {

  // In case of errors, return Bad request along with errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      age,
    } = req.body;

    // Checking whether user with this email already exists

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "Sorry, user with this email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      age,
    });

    const savedUser = await newUser.save();
    const authToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res.status(201).json({ authToken, savedUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  // In case of errors, return Bad request along with errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid email or password " });

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const userData = { ...user.toObject(), password: undefined };
    res.status(200).json({ authToken, user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
