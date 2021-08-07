const mongoose = require ('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema ({
    user: {type: String, required:false},
    mail: {type:String, required:false},
    tel: {type:String, required:false},
    pass: {type:String, required:false},
    facebookId:{type:String},
    date:{type:Date, default:Date.now}
});

module.exports = mongoose.model('User', userSchema);