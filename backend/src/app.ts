import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import cors from "cors";
import router from "./routes/index";

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  }),
);

app.use(router);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.json(),
  }),
);

export default app;
