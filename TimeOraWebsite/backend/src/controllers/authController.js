import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiResponse from '../utils/apiResponse.js';
import crypto from 'crypto';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return ApiResponse.error(res, 'User already exists with this email address.', 400);
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      return ApiResponse.success(res, 'User registered successfully.', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }, 201);
    } else {
      return ApiResponse.error(res, 'Invalid user data provided.', 400);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      return ApiResponse.success(res, 'Login successful.', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      return ApiResponse.error(res, 'Invalid email or password.', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return ApiResponse.success(res, 'User profile retrieved.', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        addresses: user.addresses,
        wishlist: user.wishlist
      });
    } else {
      return ApiResponse.error(res, 'User not found.', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.addresses) {
        user.addresses = req.body.addresses;
      }

      const updatedUser = await user.save();

      return ApiResponse.success(res, 'Profile updated successfully.', {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
        token: generateToken(updatedUser._id)
      });
    } else {
      return ApiResponse.error(res, 'User not found.', 404);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Request reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.error(res, 'No user found with that email address.', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to database fields
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiration to 1 hour
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    // Dev utility: Output to terminal and send back in API payload for testing
    console.log(`[PASSWORD RESET DEV MODE] Token: ${resetToken}`);

    return ApiResponse.success(res, 'Password reset token generated.', {
      resetToken,
      message: 'For demonstration purposes, the token is provided here in the response payload. Please use it in POST /api/auth/reset-password/:token'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    // Hash token to compare with database value
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return ApiResponse.error(res, 'Invalid or expired password reset token.', 400);
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return ApiResponse.success(res, 'Password reset successful. You may now login.', {});
  } catch (error) {
    next(error);
  }
};
