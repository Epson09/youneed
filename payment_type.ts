import express from "express";

import fileUploadService from '../middlewares/uploader';

import {
    createPaymentType,
    getPaymentTypes
  
   
  } from "../controllers/transaction";
  const upload = fileUploadService.uploader('image');


  const router=express.Router();

  router.get("/", getPaymentTypes);
  router.post("/",upload.single('avatar'),createPaymentType);

  export default router;