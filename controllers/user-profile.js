const nodemailer = require("nodemailer");
const User = require("../models/user");
const Subscribers = require("../models/subscribers");

const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
const validateEmail = require("../utils/validateEmail");
const emailSender = require("../utils/emailSender");

// REGISTER AN ADMIN
const registerAdmin = async (data, res) => {
  try {
    const isUserTaken = await validateEmail(data.email);
    if (isUserTaken) {
      return res.status(400).json({
        message: "This E-mail is already chosen by a user",
        success: false,
      });
    }

    const verificationCode = Math.floor(Math.random() * 100000);
    const hashedPassword = await bcrypt.hash(data.password, 16);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      role: "admin",
      password: hashedPassword,
      verificationCode,
    });

    await newUser.save();

    let token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "User registered successfully",
      result: {
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      },
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// REGISTER A USER
const registerUser = async (data, res) => {
  const { firstName, lastName, email, password, username } = data;
  try {
    const isUserTaken = await validateEmail(email);
    if (isUserTaken) {
      return res.status(400).json({
        message: "This E-mail is already chosen by a user! User already exist",
        success: false,
      });
    }

    const verificationCode = Math.floor(Math.random() * 100000);
    const hashedPassword = await bcrypt.hash(password, 16);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      role: "user",
      password: hashedPassword,
      verificationCode,
    });

    await newUser.save();

    let token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "User registered successfully",
      result: {
        userId: newUser._id,
        role: newUser.role,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      },
      token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// LOGIN A USER
const loginUser = async (data, res) => {
  try {
    let { email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "User not found with this E-mail",
        success: false,
      });
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(404).json({
        type: "Invalid Credentials",
        message: "Password Incorrect",
        success: false,
      });

    if (passwordMatch) {
      let token = await jwt.sign(
        {
          userId: user._id,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      let userDetails = {
        result: {
          userId: user._id,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        },
        token,
        message: "User Logged In successfully",
      };

      return res.status(200).json({
        ...userDetails,
        success: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      type: error,
      message: "Something went wrong",
      success: false,
    });
  }
};

// EMAIL VERIFICATION
const verifyEmail = async (data, res) => {
  try {
    let { verificationCode } = data;

    const user = User.findOne({ verificationCode });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Verification Code",
        success: false,
      });
    }

    if (user.isEmailVerified) {
      return res.status(404).json({
        message: "User is already verified",
        success: false,
      });
    }

    await user.update({ isEmailVerified: true });
    return res.status(201).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (data, res) => {
  try {
    let { email } = data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this E-mail",
        success: false,
      });
    }

    // const passwordResetCode = crypto.randomInt(1000, 10000);
    const passwordResetCode = Math.floor(Math.random() * 100000).toString();

    const hashedPasswordResetCode = await bcrypt.hash(passwordResetCode, 16);

    const isEmailSent = await emailSender(email, passwordResetCode);

    // await user.update({ passwordResetCode: hashedPasswordResetCode })
    if (isEmailSent) {
      if (hashedPasswordResetCode) {
        user.passwordResetCode = hashedPasswordResetCode;
        await user.save();
      }
      return res.status(201).json({
        message: "Verification code sent to user email",
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Verification code not sent to user email",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      emailMessage: "Verification code not sent to user email",
      message: error.message,
      success: false,
    });
  }
};

// RESET PASSWORD
const resetUserPassword = async (data, res) => {
  try {
    let { code, email, password } = data;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this E-mail",
        success: false,
      });
    }

    let isCodeMatch = await bcrypt.compare(
      code.toString(),
      user.passwordResetCode
    );

    if (isCodeMatch) {
      const hashedPassword = await bcrypt.hash(password, 16);

      // await user.update({ password: hashedPassword }, { passwordResetCode: ""})

      if (hashedPassword) {
        user.password = hashedPassword;
        user.passwordResetCode = "";
        await user.save();
      }

      return res.status(201).json({
        message: "Password reset successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Invalid verification code",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// CHANGE PASSWORD
const changeUserPassword = async (data, req, res) => {
  try {
    let userId = req.body.id;
    let { oldPassword, newPassword } = data;

    const user = await User.findById(userId);

    let oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (oldPasswordMatch) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({ password: newHashedPassword });

      return res.status(201).json({
        message: "Password change successfully",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Old password is incorrect",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// GET A USER
const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId || req.user._id).exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User fetched Successfully!",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    let userId = req.params.id || req.user._id;

    const user = await User.findByIdAndUpdate(userId, req.body);

    return res.status(201).json({
      message: "User updated successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const subscribe = async (req, res) => {
  try {
    const { name, email } = req.body;

    const isSubscribed = await Subscribers.findOne({ email });
    if (isSubscribed) {
      return res.status(400).json({
        message: "This E-mail has already subscribed",
        success: false,
      });
    }

    const newSubscribe = new Subscribers({
      name,
      email,
    });

    await newSubscribe.save();
    return res.status(201).json({
      message: "Email subscribed successfully",
      data: newSubscribe,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const unSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const unSubscribe = await Subscribers.findOneAndDelete({ email });

    if (unSubscribe) {
      return res.status(201).json({
        message: "Email unsubscribed successfully",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Subscriber not found!",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const sendContact = async (req, res) => {
  try {
    const { name, email, body } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailInfo = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "GoodNews' Contact form Submission",
      html: `
          <h2> This is to notify that a user has just contacted GoodNews</h2> <br>
          <h3>The contact name: ${name}</h3>
          <h3>The contact email: ${email}</h3>
          <h3>The contact message: </h3>
          <p>${body} </p>
          
          `,
    };

    transporter.sendMail(mailInfo, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return res.status(201).json({
          message: "Contact form sent successfully",
          data: info,
          success: true,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  subscribe,
  unSubscribe,
  getOneUser,
  updateUser,
  sendContact,
  registerAdmin,
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetUserPassword,
  changeUserPassword,
};
