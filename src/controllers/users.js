//const login = (req,res) => res.send('hi');

const userCtrl ={};

userCtrl.newUser = (req,res)=>{
    res.send('Registrando usuario')
};
userCtrl.getUser = (req,res)=>{
    res.send('Buscando usuario')
};



module.exports = userCtrl;