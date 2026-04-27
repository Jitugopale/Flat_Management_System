import { prismaClient } from "../service/prisma.js";

export const getPendingFlatsController = async (req, res) => {
  try {
    const flats = await prismaClient.flat.findMany({
      where: { status: "pending" },
      orderBy: { created_at: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            phoneNo: true,
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Sucessfully fetch all pending flats", flats });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
