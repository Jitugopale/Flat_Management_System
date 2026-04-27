import { hash } from "bcrypt";
import { prismaClient } from "../service/prisma.js";

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
