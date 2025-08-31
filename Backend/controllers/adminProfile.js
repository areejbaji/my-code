
// const User = require('../models/User');
// const Joi = require('joi');
// const cloudinary = require('../config/cloudinary');

// // Admin profile fetch karne ke liye
// const getAdminProfile = async (req, res, next) => {
//   try {
//     const adminId = req.user._id; // auth middleware se user id milti hai
//     const admin = await User.findById(adminId).select('-password -otp');
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//     res.json(admin);
//   } catch (error) {
//     next(error);
//   }
// };

// // Admin profile update karne ke liye
// const updateAdminProfile = async (req, res, next) => {
//   // Validation schema (sirf name aur email)
//   const schema = Joi.object({
//     name: Joi.string().min(2).max(50),
//     email: Joi.string().email()
//   });

//   const { error } = schema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   try {
//     const adminId = req.user._id;
//     const updateData = req.body;

//     // Email ko lowercase karna
//     if (updateData.email) updateData.email = updateData.email.toLowerCase();

//     // Avatar upload handle karna (agar file hai)
//     if (req.file) {
//       try {
//         const result = await cloudinary.uploader.upload(req.file.path, {
//           folder: "stylehub/admin",
//           transformation: [
//             { width: 200, height: 200, crop: "fill" },
//             { quality: "auto" }
//           ]
//         });
//         updateData.avatar = result.secure_url;
//       } catch (uploadError) {
//         return res.status(500).json({ message: "Avatar upload failed" });
//       }
//     }

//     const updatedAdmin = await User.findByIdAndUpdate(
//       adminId, 
//       updateData, 
//       { new: true, runValidators: true }
//     ).select('-password -otp');

//     if (!updatedAdmin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     res.json({ 
//       message: 'Profile updated successfully', 
//       profile: updatedAdmin 
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }
//     next(error);
//   }
// };

// module.exports = { getAdminProfile, updateAdminProfile };
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
    name: Joi.string().min(2).max(50)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const adminId = req.user._id;
    const { name } = req.body;
    
    let updateData = {};

    // Name ko firstName aur lastName mein split karo
    if (name) {
      const nameParts = name.trim().split(' ');
      updateData.firstName = nameParts[0];
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }

    // Avatar upload handle karna (agar file hai)
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "stylehub/admin",
          transformation: [
            { width: 200, height: 200, crop: "fill" },
            { quality: "auto" }
          ]
        });
        updateData.avatar = result.secure_url;
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return res.status(500).json({ message: "Avatar upload failed" });
      }
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