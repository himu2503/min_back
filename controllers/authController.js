// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role
      });

    res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found"
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });
    }

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (
      await bcrypt.compare(
        newPassword,
        user.password
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        10
      );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};