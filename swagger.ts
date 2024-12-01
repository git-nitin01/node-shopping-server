/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  orderSchemaDTO,
  orderInputSchemaDTO,
} from "./src/swaggerSchema/orderManagementSchema";
import { productSchemaDTO } from "./src/swaggerSchema/productSchema";
import {
  cartSchemaDTO,
  cartInputSchemaDTO,
} from "./src/swaggerSchema/cartManagementSchema";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JK",
      version: "1.0.0",
      description: "JK-Washing-Solutions",
    },
    servers: [
      {
        url: "http://localhost:4000/jk",
      },
    ],
    components: {
      schemas: {
        OrderDTO: orderSchemaDTO,
        ProductDTO: productSchemaDTO,
        orderInputDTO: orderInputSchemaDTO,
        cartDTO: cartSchemaDTO,
        cartInputDTO: cartInputSchemaDTO,
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, to specify the format of the token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // This applies the bearerAuth security scheme globally
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Adjust the path to your route files
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app: {
  use: (
    arg0: string,
    arg1: RequestHandler<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >[],
    arg2: RequestHandler<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >,
  ) => void;
}) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  // Add this line to allow Swagger UI to include the authentication token in API calls
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        authAction: {
          bearerAuth: {
            name: "bearerAuth",
            schema: {
              type: "http",
              in: "header",
              name: "Authorization",
              description: "",
            },
            value: "Bearer <JWT Token here>",
          },
        },
      },
    }),
  );
};

export default setupSwagger;
