import { Router } from "express";
import * as offerController from "../controllers/offers.js";
import { validateJWT, validateRole } from "../middlewares/auth.js";
import { UserRole } from "../models/user.js";
import { validateUpdateOrderStatusRequest } from "../middlewares/validations.js";

const offerRouter = Router({ mergeParams: true });

offerRouter.route("/offers")
  .get(
    validateJWT,
    offerController.listOffers
  )
  .post(
    validateJWT,
    validateRole(UserRole.Provider),
    offerController.createOffer
  );

offerRouter.route("/offers/:id/status")
  .patch(
    validateJWT,
    validateRole(UserRole.User),
    validateUpdateOrderStatusRequest(),
    offerController.updateOfferStatus
  );

export default offerRouter;
