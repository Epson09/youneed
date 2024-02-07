import e, { Request, Response } from "express";

import { PrismaClient, User } from "@prisma/client";
import * as dotenv from "dotenv";

import fileUploader from "../middlewares/uploader";

import {
  PaymentTypeDto,
  checkErrors,
} from "../middlewares/validations/user-validator";
dotenv.config();

const prisma = new PrismaClient();

const getPaymentTypes = async (req: Request, res: Response) => {
  try {
    const types = await prisma.paymentType.findMany({
      select: {
        name: true,
        image: true,
      },
    });
    res.status(200).json(types);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des types de paiément",
    });
  }
};



  const createPaymentType = async (req: Request, res: Response) => {
  try {
  
   // fileUploader.updateSingleFileField("avatar", "image");
    let type = new PaymentTypeDto();
    type.name = req.body;

    fileUploader.uploader("image").single("avatar")(req, res,(err)=>{
      if (err) {
        console.error("Error uploading file:", err);
        throw new Error("Error uploading file");
      }
      console.log("File uploaded successfully:", req.file);


      res.status(201).json({ message: "Payment type created successfully" });
  
    });
   
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du type de paiement" });
    throw new Error("Erreur lors de l'ajout du type de paiement");
  }

};

export {
  getPaymentTypes,
  createPaymentType,

  //addRoles,
};
