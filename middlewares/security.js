const utilSecurity = require("../utils/security");
const daoUser = require("../daos/users");

module.exports = {
    checkJWT,
    checkSignIn,
    checkPermission
};

// set req.user
async function checkJWT(req, res, next) {
  // Check for the token being sent in a header or as a query parameter
  let token = req.get("Authorization") || req.query.token;
  if (token) {
      token = token.replace("Bearer ", "");
      const tokenUser = await daoUser.findOne({"token": token})
      if (tokenUser == null || Object.keys(tokenUser).length == 0) {
        console.log("no token found!")
          req.user = null;
          return next();
      }
      req.user = utilSecurity.verifyJWT(token);
  } else {
    // No token was sent
    req.user = null;
  }
  return next();
};
  

// make use of req.user check if they are Signed in
function checkSignIn(req, res, next) {
  // Status code of 401 is Unauthorized
  if (!req.user) return res.status(401).json("Unauthorized");
  // A okay
  next();
};

// make use of req.user check if they are owner or if they are admin
function checkPermission(req, res, next) {
  // Status code of 401 is Unauthorized
  if (!req.user) return res.status(401).json("Unauthorized");

  // console.log("req.payload:", req.user.payload)
  // console.log("req.body:", req.body)
  
  // If the user is not the owner and is not an admin -> unauthorized
  if (req.user.payload.email && !req.user.payload.is_admin) {
    return res.status(401).json("Unauthorized");
  }
  
  next();
}
