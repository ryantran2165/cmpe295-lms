const userModel = require('../models/user.model');

// Signup
exports.signup = async(userReqData, result) => {
    const username = userReqData.username;
    const email = userReqData.email;
    const password = userReqData.password;
    const firstName = userReqData.firstName;
    const lastName = userReqData.lastName;
    const role = userReqData.role;

    try {
        await userModel.create({
            username,
            email,
            password,
            firstName,
            lastName,
            role
        });

        // User signup successful
        result(null, {status: true, message:"User Created", user:{username, email, role}});
    }
    catch(err){
        result(null, {status: false, message:"User already exists", user:{username, email}}, err);
    }
}

// Login
exports.login = async(userReqData, result) => {
    const username = userReqData.username;
    const password = userReqData.password;

    try{
        const user = await userModel.findOne({username:username});

        const validate = await user.isValid(password);

        // Wrong password
        if(!validate){
            result(null, {status:false, message:"Wrong password", user:{username}});
        }
        // Valid password
        else{
            result(null, {status:true, message:"login successful", user:{username}});
        }
    }
    catch(err){
        // No such user
        result(null, {status: false, message:"No such user exists", user:{username}}, err);

    }
}