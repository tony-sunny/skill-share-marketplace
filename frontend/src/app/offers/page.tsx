"use client";
import { useEffect, useState } from "react";
import { RequireAuth } from "../../lib/require-auth";
import { OfferResponse, queryAPI } from "@/lib/api";
import { toast } from "sonner";

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferResponse["offers"]>([]);

  const updateOfferStatus = async (offerId: number, status: "accepted" | "rejected") => {
    try {
      await queryAPI(`offers/${offerId}/status`, {
        method: "PATCH",
        body: { status },
        needAuth: true,
        parseResponse: false,
      });
      toast.success(`Offer ${status}`);
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status } : o));
    } catch {
      toast.error("Failed to update offer");
    }
  };


  useEffect(() => {
    queryAPI<OfferResponse>("offers", { needAuth: true })
      .then((data) => {
        setOffers(data?.offers || []);
      })
      .catch(() => {
        toast.error("Failed to get offers");
      });
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Offers</h2>

        <ul className="mb-6">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                Task {offer.task.name} {offer.provider?.first_name ? `Provider: ${offer.provider?.first_name} ${offer.provider?.last_name}` : ""} (
                {offer.status})
              </span>
              {(offer.status === "pending" || offer.status === "rejected") && (
                <span className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => updateOfferStatus(offer.id, "accepted")}
                  >
                    Accept
                  </button>
                </span>
              )}
              {(offer.status === "pending" || offer.status === "accepted") && (
                <span className="flex gap-2">

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => updateOfferStatus(offer.id, "rejected")}
                  >
                    Reject
                  </button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </RequireAuth>
  );
}
