const fs = require("fs");
const baseUrl = "http://localhost:9000/";

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath =__dirname+"/../public/images/";
    console.log(fileName)
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. "+fileName + err,
        });
      }
    });
  };

  module.exports = {
    download
  };