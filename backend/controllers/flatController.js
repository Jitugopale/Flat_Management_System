import { prismaClient } from "../service/prisma.js";

export const createFlatController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, address, price, description, amenities } = req.body;

    if (!title || !address || !price) {
      return res
        .status(400)
        .json({ message: "Title,address and price are required" });
    }

    if (!req.files || req.files.length === 0) {
      //if (!req.files || req.files.length === 0)

      //┌────────────────────────┬─────────────────────────────────────────────────────────────┐
      //│       Condition        │                           Meaning                           │
      //├────────────────────────┼─────────────────────────────────────────────────────────────┤
      //│ !req.files             │ req.files is undefined or null — no files field sent at all │
      //├────────────────────────┼─────────────────────────────────────────────────────────────┤
      //│ req.files.length === 0 │ Field was sent but empty — 0 files attached                 │
      //└────────────────────────┴─────────────────────────────────────────────────────────────┘
      return res
        .status(400)
        .json({ message: "please upload at least one image" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    //Express reads it from the incoming HTTP request:
    //Client sends:  http://localhost:3000/api/flats
    //Express sets req.protocol = "http"

    //req.get() is just a helper to read any request header
    //  GET /api/flats HTTP/1.1
    // Host: localhost:3000        ← browser/Postman sets this automatically
    // Content-Type: application/json

    // Express reads it via:
    // req.get("host")  // → "localhost:3000"

    //To build full image URLs to store in DB:
    // instead of storing just:
    //"uploads/42/images/1714200000.jpg"

    // you store the full accessible URL:
    //"http://localhost:3000/uploads/42/images/1714200000.jpg"

    const images = req.files.map(
      (f) => `${baseUrl}/uploads/${userId}/images/${f.filename}`,
    );
    //.map() loops over every uploaded file and converts it into a full URL string.
    //  Simple answer: Takes the array of uploaded files → returns array of full image URLs ready to store in the database.

    // array of uploaded files :
    //   Example:
    //   req.files after upload:
    //   [
    //     { filename: "1714200000-123.jpg", ... },
    //     { filename: "1714200001-456.jpg", ... },
    //   ]

    // After .map():
    //   images = [
    //     "http://localhost:3000/uploads/42/images/1714200000-123.jpg",
    //     "http://localhost:3000/uploads/42/images/1714200001-456.jpg",
    //   ]
    const flat = await prismaClient.flat.create({
      data: {
        user_id: userId,
        title,
        address,
        price: Number(price),
        description: description || "",
        images: images || [], //array of image urls
        amenities: amenities || [], //array of amenities ["Parking","Gym",many more]
        status: "pending",
      },
    });

    return res.status(201).json({
      message: "Flat Submitted Successfully",
      flat,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getApprovedFlatsController = async (req, res) => {
  try {
    const flats = await prismaClient.flat.findMany({
      where: { status: "approved" },
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

    return res.status(200).json({ message: "Fetch all approved flats", flats });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserFlatsController = async (req, res) => {
  const userId = req.user.id;

  const flats = await prismaClient.flat.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return res.status(200).json({ message: "Fetch Flats Sucessfully", flats });
};

export const markFlatSoldController= async(req,res)=>{
    try {
        const userId = req.user.id;
        const flatId = Number(req.params.id);
        const {sold_to_user_id} = req.body;

        if(!sold_to_user_id){
          return res.status(400).json({message:"buyerId is required"})
        }

        const flat = await prismaClient.flat.findFirst({
            where:{id:flatId,user_id:userId}
        })

        if(!flat){
            return res.status(404).json({message:"Flat not found or you are not owner"})
        }

        if(flat.status === "sold"){
            return res.status(400).json({message:"Flat is already sold"})
        }

        const updatedFlat = await prismaClient.flat.update({
            where:{id:flatId},
            data:{
                status:"sold",
                sold_to_user_id:sold_to_user_id || null,
                sold_date : new Date()
            }
        })

        return res.status(200).json({
            message:"Flat marked as sold sucessfully",
            flat:updatedFlat
        })
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}
