const usersDao = require("../daos/users")
const ticketsDao = require("../daos/tickets")
const utilSecurity = require("../utils/security")

module.exports = {
    signUpUserData,
    getSignInDetailsData,
    getUserData,
    signInUserData,
    signOutUserData,
    sendTicketFormData,
  };

async function signUpUserData(body) {
    const user = await usersDao.findOne({"email": body.email});
    // console.log(user);
    if (user) {
      return {success: false, error: "user already exist"};
    }
    const newUser = await usersDao.create(body);
    return {success: true, data: newUser};
}

async function getSignInDetailsData(queryFields) {
    const signinFields = {
      name : 1,
      salt: 1,
      iterations: 1
    } 
    if (!queryFields.hasOwnProperty("email")){
      return {success: false, error: "missing email"};
    }
    const userEmail = decodeURIComponent(queryFields.email);
    const signinFieldsRes = await usersDao.findOne({"email": userEmail}, signinFields);
    return {success: true, data: signinFieldsRes};
  }

async function getUserData(queryField) {
  try {
    // Use the `.select()` method to specify the fields you want to return
    const user = await usersDao.findOne({ _id: queryField }).select('firstName lastName email');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function signInUserData(body) {
  // console.log('Incoming Model - signInUserData body:', body); 
  if (!body.hasOwnProperty("email")) {
    return {success: false, error: "missing email"};
  }
  if (!body.hasOwnProperty("password")) {
    return {success: false, error: "missing password"};
  }
  const user = await usersDao.findOne({"email": body.email, "password": body.password});
  // console.log('Outgoing Model - signInUserData user:', user); 
  if (user == null || Object.keys(user).length == 0) {
    return {success: false, error: "Invalid email/password"};
  }
  
  const jwtPayload = {
    user: user._id,
    email: user.email,
    is_admin: user.is_admin
  };
  const token = utilSecurity.createJWT(jwtPayload);
  // console.log('Outgoing Model - signInUserData token:', token); 
  const expiry = utilSecurity.getExpiry(token);
  // console.log('Outgoing Model - signInUserData expiry:', expiry); 
  await usersDao.updateOne({"email": body.email}, {token: token, expire_at: expiry})
  // console.log({"email": body.email}, {token: token, expire_at: expiry}); 
  return {success: true, data: token}
}

async function signOutUserData(body) {
  if (!body.hasOwnProperty('email')) {
    return {success: false, error: "missing email"};
  }
  await usersDao.updateOne({"email": body.email}, {token: null, expire_at: null});
  return {success: true, data: "signout successful!"};
}

async function sendTicketFormData(body) {
  const newForm = await ticketsDao.create(body);
  return {success: true, data: newForm};
}