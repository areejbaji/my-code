 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const { error: validationError } = validateUser(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError.details[0].message });
  }

  try {
    const formattedEmail = email.toLowerCase();
    const formattedName = name.toLowerCase();

    const existingUser = await User.findOne({ email: formattedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'This email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: formattedName,
        email: formattedEmail,
      password: hashedPassword,
      // role: role === 'admin' ? 'admin' : 'user',
    });

    await user.save();

    res.status(200).json({ message: 'User registered successfully', status: true });
  } catch (error) {
    next(error);
  }
};

function validateUser(data) {
  const userSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
  });

  return userSchema.validate(data);
}

// Named export
module.exports =  {registerUser} ;
  