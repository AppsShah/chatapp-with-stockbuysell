const mongoclient = require("../db/connection");

//create list
const sharepriceupdate = (data) =>
  mongoclient
    .db("sharesdata")
    .collection("sharedetails")
    .updateOne(
      { dataid: "1" },
      {
        $set: {
          adani: data.adani,
          tata: data.tata,
          meta: data.meta,
          google: data.google,
          date: new Date(),
        },
      }
    );

const sharepriceremain = (query) =>
  mongoclient
    .db("sharesdata")
    .collection("sharehave")
    .updateOne({ shareremainid: "1" }, { ...query });

const sharepriceupdatefind = () =>
  mongoclient
    .db("sharesdata")
    .collection("sharedetails")
    .findOne({ dataid: "1" });

const sharepriceremainfind = () =>
  mongoclient
    .db("sharesdata")
    .collection("sharehave")
    .findOne({ shareremainid: "1" });

module.exports = {
  sharepriceupdate,
  sharepriceremain,
  sharepriceremainfind,
  sharepriceupdatefind,
};
