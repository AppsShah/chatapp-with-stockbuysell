const socket = io("http://localhost:3000");

const form = document.getElementById("send-container");
const messageinp = document.getElementById("messageinp");
const messageContainer = document.querySelector(".container");
const username = prompt("Enter your name to login");
const newdata = (data) => data;
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};
const joining = (name) => {
  append(`${name} joined the chat`, "right");
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted");
  const message = messageinp.value;
  append(`you:${message}`, "right");
  socket.emit("send", message);
  console.log(message);
  if (message == "STOCKLIST") {
    socket.emit("sharewatch");
    socket.emit("sendsharedata");
    console.log(newdata);
    // append(newdata,"left")
    append("you have send stocklist to group", "right");
  }
  if (message == "REMAINLIST") {
    socket.emit("shareremain");
    append("you have send stock remain list to group", "right");
  }
  console.log(message.includes("BUY"));
  if (message.includes("BUY") || message.includes("SELL")) {
    socket.emit("sharebuysell", message);
  }
  messageinp.value = "";
});
socket.emit("new-user-joined", username);
socket.on("user-joined", joining);
socket.on("recieve", (data) => {
  append(`${data.name}:${data.message}`, "left");
});
socket.on("recievesharedata", newdata);

// socket.on("stocklistself",(data)=>{
//     console.log("inside stocklistitself")
//     append(data,"left")
// })

socket.on("listofshare", async (data) => {
  append(
    `adani:${data.adani} tata:${data.tata} meta:${data.meta} google:${data.google}`,
    "left"
  );
});

socket.on("remainsharelist", async (data) => {
  append(
    `adani:${data.ADANI} tata:${data.TATA} meta:${data.META} google:${data.GOOGLE}`,
    "right"
  );
});

socket.on("successfullybuysell", async (data) => {
  append(`${data}`, "right");
});
socket.on("leave", (user) => {
  // console.log(user)
  append(`${user} left chat room`, "left");
});
