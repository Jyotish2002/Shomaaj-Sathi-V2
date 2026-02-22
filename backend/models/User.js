const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  mobile: String,
  address: String,
  wardNumber: Number,
  photo: String, // URL to profile photo
  aadharPhoto: String, // URL to aadhar photo
  language: String, // User's preferred language (en, hi, bn)
  district: String, // User's district
  municipality: String, // User's municipality
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  isVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Transform _id to id when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.googleId; // Don't expose googleId to frontend
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
