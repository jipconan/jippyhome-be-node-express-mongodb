const usersModel = require("../models/users");

module.exports = {
  signUpUser,
  getSignInDetails,
  getUser,
  signInUser,
  checkSignIn,
  checkPermission,
  signOutUser,
  sendTicketForm,
}

async function signUpUser(req, res) {
  try {
    // console.log('Incoming Controller - signUpUser req.body: ', req.body); 
    const user = await usersModel.signUpUserData(req.body);
    // console.log('Outgoing Controller - signUpUser user: ', user); 
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}

async function getSignInDetails(req, res) {
  try {
    // console.log('Incoming Controller - getSignInDetails req.query: ', req.query); 
    const signinDetails = await usersModel.getSignInDetailsData(req.query);
    // console.log('Outgoing Controller - getSignInDetails signinDetails: ', signinDetails); 
    if (signinDetails.success != true) {
      res.status(400).json({errorMsg: signinDetails.error})
      return
    }
    res.json(signinDetails.data)
  } catch (err) {
    res.status(500).json({ errorMsg: err.message });
  }
}

async function getUser(req, res) {
  try {
    const { user_id } = req.params;
    // console.log('Incoming Controller - getUser user_id:', user_id); 
    const data = await usersModel.getUserData(user_id);
    // console.log('Outgoing Controller - getUser data: ', data); 
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: data });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ errorMsg: err.message });
  }
}

async function signInUser(req, res) {
  try {
    // console.log('Incoming Controller - signInUser req.body:', req.body); 
    const token = await usersModel.signInUserData(req.body);
    // console.log("Outgoing Controller - signInUser token: ", token);
    if (!token.success) {
      res.status(400).json({errorMsg: token.error})
      return 
    }
    res.json(token)
  } catch (err) {
    res.status(500).json({ errorMsg: err.message });
  }
}

function checkSignIn (req, res) {
    // console.log("Incoming Controller - checkSignIn req.user: ", req.user);
    res.json({user: req.user});
}

function checkPermission (req, res) {
    // console.log("Incoming Controller - checkPermission req.body.email: ", req.body.email);
    res.json({user: req.user, body: req.body.email});
}

async function signOutUser(req, res) {
  try {
      const result = await usersModel.signOutUserData(req.body);
      // console.log("Incoming Controller - checkPermission result: ", result);
      if (!result.success) {
        res.status(400).json({errorMsg: result.error})
        return 
      }
      res.json(result.data)
  } catch (err) {
      res.status(500).json({ errorMsg: err.message });
  }
}

async function sendTicketForm(req, res) {
  try {
    // console.log('Incoming Controller - sendTicketForm req.body: ', req.body); 
    const form = await usersModel.sendTicketFormData(req.body);
    // console.log('Outgoing Controller - sendTicketForm user: ', form); 
    res.json({ form });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}