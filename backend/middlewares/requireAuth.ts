import jwt, { Secret } from "jsonwebtoken";
import { User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET as Secret;

    if (!JWT_SECRET) {
      throw new Error("JWT secret is not defined.");
    }

    const { _id } = jwt.verify(token, JWT_SECRET) as { _id: string };

    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Request is not authorized" });
  }
};

export default requireAuth;
