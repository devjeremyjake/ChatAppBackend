// requiring dependencies
const express = require("express");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// adding folders files
const Config = require("./config/conn");

// activating Express
const app = express();

// including the CORS middle ware
app.use(cors());

// Socket.io
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieparser());
app.use(logger("dev"));

// DATABASE CONNECTION (FROM CONN.JS).
mongoose.Promise = global.Promise;
mongoose.connect(Config.url, { useNewUrlParser: true });

//require from socket streams.js.
require("./socket/streams")(io);

// REQUIRING FILES FROM ROUTES PAGE.
const auth = require("./Routes/authRoutes");
const posts = require("./Routes/postRoutes");
const users = require("./Routes/userRoutes");
const friends = require("./Routes/friendsRoutes");
const message = require("./Routes/messageRoutes");

// USING THE ROUTES FROM ABOVE.
app.use("/api", auth);
app.use("/api", posts);
app.use("/api", users);
app.use("/api", friends);
app.use("/api", message);

// testing server connection
server.listen(3030, () => {
  console.log("Listening on port 3030");
});
