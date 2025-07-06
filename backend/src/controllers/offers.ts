import type { Request, Response } from "express";
import { constants } from "node:http2";
import * as offerModel from "../models/offer";
import type { RequestWithSession } from "../middlewares/auth";
import { UserRole } from "../models/user";

export const createOffer = async (req: RequestWithSession, res: Response) => {
  try {
    await offerModel.createOffer({
      task_id: req.body.task_id,
      provider_id: req.session?.id,
      status: offerModel.OfferStatus.Pending,
    });
    res.status(constants.HTTP_STATUS_CREATED).end();
  } catch (e) {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "Create offer failed", details: e });
  }
};

export const updateOfferStatus = async (req: Request, res: Response) => {
  try {
    await offerModel.updateOfferStatus(Number(req.params.id), req.body.status);
    res.status(constants.HTTP_STATUS_NO_CONTENT).end();
  } catch (e) {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "Update offer failed", details: e });
  }
};

export const listOffers = async (req: RequestWithSession, res: Response) => {
  try {
    const role = req.session?.role;
    let offers;
    if (role === UserRole.User) {
      offers = await offerModel.listOffersForUser(req.session?.id!);
    } else {
      offers = await offerModel.listOffersFromProvider(req.session?.id!);
    }
    const mappedOffers = offers.map((offer) => ({
      id: offer.id,
      status: offer.status,
      task: {
        id: offer.task_id,
        category: offer.task_category,
        name: offer.task_name,
        description: offer.task_description,
        expected_start_date: offer.task_expected_start_date
          ?.toISOString()
          .split("T")[0],
        expected_hours: offer.task_expected_hours,
        hourly_rate: offer.task_hourly_rate,
        rate_currency: offer.task_rate_currency,
        status: offer.task_status,
      },
      provider: {
        id: offer.user_id,
        first_name: offer.user_first_name,
        last_name: offer.user_last_name,
        email: offer.user_email,
        role_type: offer.user_role_type,
      },
    }));
    res.status(constants.HTTP_STATUS_OK).json({ offers: mappedOffers });
  } catch (e) {
    res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .json({ error: "List offers failed", details: e });
  }
};
