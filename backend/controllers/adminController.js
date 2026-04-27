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
      .json({ message: "Sucessfully fetch all pending flats", data: flats });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const approveFlatController = async (req, res) => {
  try {
    const flatId = Number(req.params.id);

    const flat = await prismaClient.flat.findUnique({
      where: {
        id: flatId,
      },
    });

    if (!flat) {
      return res.status(404).json({
        message: "flat not found",
      });
    }
    const updateStatusFlat = await prismaClient.flat.update({
      where: { id: flatId },
      data: { status: "approved" },
    });

    return res
      .status(200)
      .json({ message: "Flat Approved Sucessfully", data: updateStatusFlat });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const rejectFlatController = async (req, res) => {
  try {
    const flatId = Number(req.params.id);

    const flat = await prismaClient.flat.findUnique({
      where: {
        id: flatId,
      },
    });

    if (!flat) {
      return res.status(404).json({
        message: "flat not found",
      });
    }
    const rejectFlat = await prismaClient.flat.update({
      where: { id: flatId },
      data: { status: "rejected" },
    });
    return res
      .status(200)
      .json({ message: "Flat Rejected Sucessfully", data: rejectFlat });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
