const HttpError = require("../models/errorModel.js");
const User = require("../models/userModel.js");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path')
const{v4:uuid} =require('uuid');
const { info } = require("console");
// =======================================Regsiter=============================================
// post:api/users/register
// unprotected



const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    console.log('Received registration data:', { name, email, password, password2 });

    if (!name || !email || !password || !password2) {
      console.log('Missing required fields');
      return next(new HttpError('Fill in all fields!', 422));
    }

    const newEmail = email.toLowerCase();
    console.log('Converted email to lowercase:', newEmail);

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      console.log('Email already exists:', newEmail);
      return next(new HttpError('Email already exists!', 422));
    }

    if (password.trim().length < 6) {
      console.log('Password too short');
      return next(new HttpError('Password is too short! Must be at least 6 characters.', 422));
    }

    if (password !== password2) {
      console.log('Passwords do not match');
      return next(new HttpError('Passwords do not match!', 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    console.log('Generated hashed password');

    const newUser = new User({
      name,
      email: newEmail,
      password: hashedPass
    });

    await newUser.save();
    console.log('User registered successfully:', newUser);
    res.status(201).json(newUser);

  } catch (error) {
    console.error('Error in registerUser:', error);

    // Log database-related errors
    if (error.name === 'MongoError' || error.name === 'ValidationError') {
      console.error('Database Error:', error.message);
    }

    return next(new HttpError('User registration failed!', 500));
  }
};









// =======================================Login=============================================
// post:api/users/login
// protected

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError('Fill in all fields!', 422));
    }

    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError('Invalid Credentials!', 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError('Invalid Credentials!', 422));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, id, name });
  } catch (error) {
    return next(new HttpError('Login failed. Please check your credentials!', 422));
  }
};



// =======================================User Profile=============================================
// post:api/users/:id
// protected

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return next(new HttpError("user not found!"));

    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));

  }
}


// =======================================Chnage user avatar (profile pic)=============================================
// post:api/users/change-avatar
// protected

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image"));
    }
    
    const user = await User.findById(req.user.id);
    if (user.avatar) {
      fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      });
    }
    
    const { avatar } = req.files;
    if (avatar.size > 500000) {
      return next(new HttpError("Profile picture too big"));
    }
    
    let fileName = avatar.name;
    let newFilename = fileName.split('.')[0] + '-' + uuid() + '.' + fileName.split('.')[1];
    avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
      if (err) {
        return next(new HttpError(err));
      }
      const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });
      if (!updatedAvatar) {
        return next(new HttpError("Avatar could not be changed", 422));
      }
      res.status(200).json(updatedAvatar);
    });
  } catch (error) {
    return next(new HttpError(error));
  }
};



// =======================================Edit user details=============================================
// post:api/users/edit-user
// protected

const editUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes user ID is available in req.user
    const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate passwords if necessary
    if (newPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (newPassword) {
      user.password = newPassword; // Assume password hashing is handled in the User model
    }

    await user.save();

    res.status(200).json({
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =======================================Get authors=============================================
// post:api/users/authors
// unprotected

const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));

  }
}

module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }