const mongoose = require ('mongoose');
const {Schema} = mongoose;

const noteSchema = new Schema ({
    title: {type: String, required:true},
    message: {type:String, required:true},
    date:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Note', noteSchema);