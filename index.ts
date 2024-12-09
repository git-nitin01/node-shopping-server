/* eslint-disable prettier/prettier */
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { connectToHostedSQL } from "./src/config/mySql";
import connectToMongoDB from "./src/config/mongoDB";
import router from "./src/Router";
import setupSwagger from "./swagger";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 4000;

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app: Application = express();

// Middleware setup
const corsOptions = {
  origin: "*", // Update with your Swagger UI URL or frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow credentials if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Swagger setup
setupSwagger(app);

// Routes setup
app.use("/jk", router);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).send({ error: "Not found" });
});

// Firebase Admin SDK setup
const base64ServiceAccount = process.env
  .FIREBASE_SERVICE_ACCOUNT_BASE64 as string;
const serviceAccount = JSON.parse(
  Buffer.from(base64ServiceAccount, "base64").toString("utf-8"),
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to databases
const connectDatabases = async () => {
  try {
    const mysqlConnection = await connectToHostedSQL();
    console.log("MySQL Database connection established!");


    const mongoDBConnection = await connectToMongoDB();
    console.log("MongoDB connection established!");

    return { mysqlConnection, mongoDBConnection };

  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to databases");
  }
};

// Start server after connecting databases
Promise.all([connectDatabases()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express server started on PORT ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error(err.message);
    process.exit(1); // Exit process on error
  });

// Preflight request handling for CORS
app.options("*", cors(corsOptions));
