import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['public', 'authenticated', 'admin', 'superadmin'],
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Role = mongoose.model('Role', roleSchema);

export { Role };
