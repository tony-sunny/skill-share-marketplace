function OfferStatus({ status }: { status: string }) {
  let style = "";
  if (status === "pending") {
    style =
      "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold border border-yellow-300";
  } else if (status === "accepted") {
    style =
      "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold border border-green-300";
  } else {
    style =
      "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold border border-red-300";
  }
  return (
    <span className={style}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export { OfferStatus };
