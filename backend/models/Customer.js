const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: { 
    type: String,
    default: "customer"
 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  country: {
    type: String,
    maxLength: 100
  },
  state: {
    type: String,
    maxLength: 100
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;