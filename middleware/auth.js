// to check whether a person has authorization token
// import jwt
const jwt=require("jsonwebtoken");
// import the secret key
const JWT_SECRET=process.env.JWT_SECRET


// create an auth  function
const auth =(req,res,next)=>{
    // extract auth headers
    const authHeader = req.headers.authorization;

    // split the  header into an array using the space
    // so far the header usually contains the keyword "bearer" concatinated with the token
    // after the split happens the "bearer" appears on index = 0 and the token appears on second index=1
    const token = authHeader && authHeader.split('')[1];
    //step 1 check whether the request sent by person contains a token or not
    if(!token){
        return res.status(401).json({message:"No token provided."})
    }

    //step 2 check whether the token is valid or not
    try {
        // verify the validity of the token using the jwt secret key
        const decoded = jwt.verify(token,JWT_SECRET);
        // attach the decoded payload to the request object
        req.user=decoded;
        // if it is valid proceed to the next step
        next()

    } catch (error) {
        // if  the token is invalid return a response
        res.status(403).json({message:"Invalid Token"})
    }
};

// Middleware shall be used to authorize access resources based on the users role
// Accepts any number of allowed roles(e.g 'admin','parent','teacher')
// usage: authorizeRoles('admin',teacher')
// ...params - accepts any number of arguments and automatically put them into an array
const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Access Denied: Insufficient permissions"})
        }
        // just allow the person
        next()
    }
}

//  export the two functions to make themm accessible all over
module.exports={auth,authorizeRoles};