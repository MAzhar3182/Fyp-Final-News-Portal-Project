import jwt from "jsonwebtoken";
import UserModel from "../models/User";

var checkUserAuth = async (req, res, next) => {
    // Get Token from Header
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(' ')[1];

            // Verify Token
            const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Get User From Token
            req.user = await UserModel.findById(userId).select("-password");
            next();
        } catch (error) {
            res.status(401).send({ "status": "Failed", "message": "Unauthorized User" });
        }
    } else {
        res.status(401).send({ "status": "Failed", "message": "Unauthorized User, No Token" });
    }
};
export default checkUserAuth;
