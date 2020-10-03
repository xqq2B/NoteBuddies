

const bcrypt = require('bcrypt');
const helpers = {};

helpers.encryptPassword=async (password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
};

helpers.matchPassword= async (password, savedPassword)=>{
    try{
        console.log(savedPassword);
       return await bcrypt.compare(password,savedPassword);
    }catch(err){
        console.log(err);
    }
    
};

module.exports = helpers;