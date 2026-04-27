import { compare, hash } from "bcrypt";
import { prismaClient } from "../service/prisma.js";
import jwt from "jsonwebtoken"

export const registerController = async (req, res) => {
  const { name, email, password, phoneNo, address, pincode } = req.body;

  if (!name || !email || !password || !phoneNo || !address || !pincode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const hashPassword = await hash(password, 10);

  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      phoneNo,
      address,
      pincode,
    },
  });

  return res.status(201).json({
    message: "User Registered Successfully",
    user,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = await jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      message: "Admin LoggedIn Sucessfully",
      token,
      user,
    });
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Password" });
  }
  const token = await jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return res.status(200).json({
    message: "User LoggedIn Successfully",
    token,
    user,
  });
};
