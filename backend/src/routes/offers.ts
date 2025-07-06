import { Router } from "express";
import * as offerController from "../controllers/offers";
import { authenticateAndAuthorizeReq, authenticateReq } from "../middlewares/auth";
import { UserRole } from "../models/user";
import { validateUpdateOrderStatusRequest } from "../middlewares/validations";

const offerRouter = Router({ mergeParams: true });

offerRouter
  .route("/offers")
  .get(authenticateReq, offerController.listOffers)
  .post(
    authenticateAndAuthorizeReq(UserRole.Provider),
    offerController.createOffer,
  );

offerRouter
  .route("/offers/:id/status")
  .patch(
    authenticateAndAuthorizeReq(UserRole.User),
    validateUpdateOrderStatusRequest(),
    offerController.updateOfferStatus,
  );

export default offerRouter;
