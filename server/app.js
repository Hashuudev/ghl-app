const express = require("express");
const authRouter = require("./routes/auth.routes");
const customValueRouter = require("./routes/customValue.routes");
const industryRouter = require("./routes/industry.routes");
const aiChatRouter = require("./routes/aiChat.routes");
const Company = require("./models/company.model");
const { default: axios } = require("axios");
const { refreshAccessToken } = require("./utils/refreshAccessToken");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*", // Replace with your allowed origin(s)
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify the allowed methods
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/customValue", customValueRouter);
app.use("/api/v1/industries", industryRouter);
app.use("/api/v1/aiChat", aiChatRouter);

module.exports = app;
