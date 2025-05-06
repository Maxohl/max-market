  const express = require("express");
  const cors = require("cors");
  const dbConnection = require("./db");
  const signupRoute = require("./routes/signupRoute");
  const loginRoute = require("./routes/loginRoute");
  const profileRoute = require("./routes/profileRoute");
  const productRoute = require("./routes/productRoute"); 
  const checkoutRoute = require("./routes/checkoutRoute");
  const ordersRoute = require("./routes/ordersRoute");
  const topCategories = require("./routes/topCatRoute");

  const app = express();
  app.use(express.json()); // Parse JSON bodies

  // Define allowed origins
  const allowedOrigins = ["http://localhost:5173"];

  // CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials
  };

  // Enable CORS
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  // Routes middlewares
  app.use("/signup", signupRoute);
  app.use("/login", loginRoute);
  app.use("/profile", profileRoute);
  app.use("/product", productRoute); 
  app.use("/checkout", checkoutRoute);
  app.use("/orders", ordersRoute);
  app.use("/top-categories", topCategories);

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
