const { Schema, model } = require('mongoose');

const Shortened = new Schema({
   original_url: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        ,
        'Please provide a valid URL with HTTP or HTTPS',
      ],
      required: [true, 'No url provided'],
      unique: true,
      trim: true,
    },
    short_url: {
      type: Number,
    }
})

Shortened.statics.all = async function(name) {
    const result = await this.find();
    return result.length;
  };

module.exports = model('Shortened', Shortened);