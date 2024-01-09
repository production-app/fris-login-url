require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const routes = require("./routes");
const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb" }));
app.use(cors({ origin: "*", credentials: true }));

app.use("/v1/", routes);

let server = undefined;

let onlineUser = [];

try {
  server = app.listen(PORT, async () => {
    await sequelize.authenticate();
    console.log("DB connected", PORT);
  });
} catch (error) {
  console.log("Error", error);
}

const addUsers = (email, socketId) => {
  !onlineUser.some((user) => user.email === email) &&
    onlineUser.push({ email, socketId });
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.sockekId !== socketId);
};

const getUser = (email) => {
  return onlineUser.find((user) => user.email === email);
};

io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    console.log(user);
    addUsers(user, socket.id);
  });
  console.log("Socket now conneted on", socket.id);

  socket.on("disconnect", () => {
    console.log("Someone just left");
  });
});
