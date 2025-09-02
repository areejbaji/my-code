
const User = require('../models/User');
const Joi = require('joi');
const cloudinary = require('../config/cloudinary');

// Admin profile fetch karne ke liye
const getAdminProfile = async (req, res, next) => {
  try {
    const adminId = req.user._id; // auth middleware se user id milti hai
    const admin = await User.findById(adminId).select('-password -otp');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin profile update karne ke liye  
const updateAdminProfile = async (req, res, next) => {
  // Simple validation
  const schema = Joi.object({
    name: Joi.string().min(2).max(50),
    avatar: Joi.string().uri().optional()  // validate avatar as URL if provided
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const adminId = req.user._id;
    const { name, avatar } = req.body;
    
    let updateData = {};

    // Name ko firstName aur lastName mein split karo
     if (name) {
      updateData.name = name.trim();
    }

    // Update avatar URL if provided
    if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      adminId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password -otp');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ 
      message: 'Profile updated successfully', 
      profile: updatedAdmin 
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAdminProfile, updateAdminProfile };