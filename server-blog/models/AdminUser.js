const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    username: { type: String },
    password: {
      type: String,
      select: false,
      set(val) {
        return require('bcryptjs').hashSync(val, 10)
      },
    },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } },
)

module.exports = mongoose.model('AdminUser', schema)
