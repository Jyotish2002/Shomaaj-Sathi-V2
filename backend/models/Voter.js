const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  epicNumber: { type: String, required: true, unique: true },
  name: String,
  fatherName: String,
  email: String,
  mobile: String,
  address: String,
  wardNumber: Number,
  district: String,
  municipality: String,
  photo: String // URL to profile photo if available
});

voterSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Voter', voterSchema);
