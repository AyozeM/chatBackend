const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);