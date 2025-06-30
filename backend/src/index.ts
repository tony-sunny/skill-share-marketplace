import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";
if (process.env.NODE_ENV === "development") {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
}

import app from "./app.js";

app.listen(4000, () => {
  console.log("Backend server running on port 4000");
});
