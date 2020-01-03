// importando express e path (padrao node)
const express = require("express");
const path = require("path");

// criando server
const app = express();
// informando websocket passando o createServer com instancia express
const server = require("http").createServer(app);
// definindo protocolo wss pro websocket (estava http)
const io = require("socket.io")(server);

// definindo pasta para arquivos publicos da app
// definindo que a pasta public (a partir da raiz do app) será a pasta padrão
app.use(express.static(path.join(__dirname, "public")));
// definindo localização das views
app.set("views", path.join(__dirname, "public"));
// definindo engine para html, pois node usa por padrão EJS
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// setando rota padrão para index.html
app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

// escuta quando houver nova conexao ao socket
io.on("connection", socket => {
  console.log(`Socket conectado ! ID: ${socket.id}`);

  socket.on("sendMessage", data => {
    messages.push(data);
    // avisar front que mensagem foi atualizada
    // socket.emit() apenas um
    socket.emit("previousMessages", messages);
    // socket.on() ouvir
    // socket.broadcast.emit() todos
    socket.broadcast.emit("receivedMessage", data);
  });
});

server.listen(3000);
