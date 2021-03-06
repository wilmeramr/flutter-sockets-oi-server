const { io } = require("../index");
const Band = require("../models/band");
const Bands = require("../models/bands");

const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Metalica"));
bands.addBand(new Band("Heroes"));

//Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");

  client.emit("active-bands", bands.getBand());

  client.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log(payload);
    io.emit("mensaje", { admin: "Nuevo mensaje" });
  });

  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBand());
  });

  client.on("add-band", (payload) => {
    const newBand = new Band(payload.name);
    bands.addBand(newBand);
    io.emit("active-bands", bands.getBand());
  });
  client.on("delete-band", (payload) => {
    bands.deleteBand(payload.id);
    io.emit("active-bands", bands.getBand());
  });

  client.on("emitir-nuevo", (payload) => {
    client.broadcast.emit("nuevo-mensaje", payload); // emitie a todo menos al que envio
  });
  client.on("emitir-mensaje", (payload) => {
    client.broadcast.emit("emitir-mensaje", payload); // emitie a todo menos al que envio
  });
});
