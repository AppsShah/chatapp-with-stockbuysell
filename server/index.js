const Koa = require("koa");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const { sharepricestorejob } = require("./crone-jobs/sharepricestorejob");
const {
  sharepriceupdatefind,
  sharepriceremain,
  sharepriceremainfind,
} = require("./db/query");
// const { canuserbuy } = require("./validator/canuserbuy");
const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const users = {};
io.on("connection", (socket) => {
  // console.log("Inside connection")
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    // console.log(users)
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("sendsharedata", async (message) => {
    const data = await sharepriceupdatefind();
    socket.broadcast.emit("recievesharedata", data);
  });
  //stock list
  socket.on("sharewatch", async () => {
    // console.log("in remainig share .....")
    const data = await sharepriceupdatefind();
    // console.log(data)
    socket.broadcast.emit("listofshare", data);
    // socket.broadcast.emit("stocklistself",data)
  });
  //shareremain
  socket.on("shareremain", async () => {
    const data = await sharepriceremainfind();
    console.log(data);
    socket.broadcast.emit("remainsharelist", data);
  });

  socket.on("sharebuysell", async (details) => {
    console.log(details);
    const arr = details.split(" ");
    // if(arr[0]=="BUY"|| arr[0]=="SELL"){
    //     socket.broadcast.emit("successfullybuysell","Enter proper BUY or SELL")
    //     return 0
    // }
    const namedata = await sharepriceupdatefind();
    const remaindata = await sharepriceremainfind();
    const keys = Object.keys(namedata);
    if (!arr[1]) {
      socket.broadcast.emit("successfullybuysell", "NO stock found");
      return 0;
    }
    if (!keys.includes(arr[1].toLowerCase())) {
      socket.broadcast.emit("successfullybuysell", "NO stock found");
      return 0;
    }
    if (isNaN(arr[2])) {
      socket.broadcast.emit(
        "successfullybuysell",
        "please Enter number of shares"
      );
      return 0;
    }
    // console.log(remaindata[arr[1]])
    if (remaindata[arr[1]] <= parseInt(arr[2]) && arr[0] == "BUY") {
      socket.broadcast.emit("successfullybuysell", "Stocks are not available");
      return 0;
    }
    let query = { $inc: {} };
    if (arr[0] == "BUY") {
      // query.$inc={...query.$inc,parseInt(arr[2])}
      Object.assign(query.$inc, { [arr[1]]: -parseInt(arr[2]) });
      console.log(query);
    } else if (arr[0] == "SELL") {
      Object.assign(query.$inc, { [arr[1]]: +parseInt(arr[2]) });
      console.log(query);
    }
    const data = await sharepriceremain(query);
    console.log(data);
    socket.broadcast.emit(
      "successfullybuysell",
      "stock buy or sell successfully"
    );
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

// console.log("till cronn job")
cron.schedule("*/15 * * * *", sharepricestorejob);

httpServer.listen(3000);
