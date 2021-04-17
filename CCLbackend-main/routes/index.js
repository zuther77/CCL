var express = require('express');
var router = express.Router();
const multer = require("multer");
const sharp=require("sharp")
const upload = multer();
var path = require('path');
const controller = require("./controller.js");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
router.use(express.static(path.join(__dirname, 'public')));


function deleteFiles(files, callback){
  var i = files.length;
  files.forEach(function(filepath){
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post("/upload", upload.single("file"), async function(req, res, next) {
  const {
    file,
    body: { name,quality }
  } = req;

  const fileName = file.originalName;
  const onlyfilename=file.originalName.slice(0,-4);
  console.log(onlyfilename)
 console.log(req.file)
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );

  res.setHeader('Content-Type', 'image/*');

  /* await sharp(`${__dirname}/../public/images/${fileName}`).jpeg({
     mozjpeg: true 
  })
  .toFile(`${__dirname}/../public/images/${onlyfilename}-min.jpg`) */
  const avifquality=parseInt(req.body.quality)
  const out=await sharp(`${__dirname}/../public/images/${fileName}`).avif({
    quality:avifquality
  }).toFile(`${__dirname}/../public/images/${onlyfilename}.avif`)
  //res.send("File uploaded as " + fileName);
  let sizeInMB = (out.size / (1024*1024)).toFixed(2);
  const data={
    file:`http://localhost:9000/images/${onlyfilename}.avif`,
    size:sizeInMB,
    filename:`${onlyfilename}.avif`,

  }
  res.send(data)

  var files = [`${__dirname}/../public/images/${fileName}`, `${__dirname}/../public/images/${onlyfilename}.avif`];

 /*lse {
      co  await deleteFiles(files, function(err) {
    if (err) {
      console.log(err);
    } ensole.log('all files removed');
    }
  }); */
  setTimeout(
    () => {
      deleteFiles(files, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('all files removed');
        }
      });
    },10000);

    console.log(out)
 
});


router.post('/jpgCompress', upload.single("file"), async function(req, res, next)  {
  const {
    file,
    body: { name,quality }
  } = req;

  const fileName = file.originalName;
  const onlyfilename=file.originalName.slice(0,-4);

  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );

  res.setHeader('Content-Type', 'image/*');
  const jpgquality=parseInt(req.body.quality)
  const out=await sharp(`${__dirname}/../public/images/${fileName}`).jpeg({
    mozjpeg: true ,
    quality:jpgquality
  })
  .toFile(`${__dirname}/../public/images/${onlyfilename}min.jpg`) 
  let sizeInMB = (out.size / (1024*1024)).toFixed(2);
  const data={
    file:`http://localhost:9000/images/${onlyfilename}min.jpg`,
    filename:`${onlyfilename}min.jpg`,
    size:sizeInMB,
  }

  var files = [`${__dirname}/../public/images/${fileName}`, `${__dirname}/../public/images/${onlyfilename}min.jpg`];

  setTimeout(
    () => {
      deleteFiles(files, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('all files removed');
        }
      });
    },10000);

  res.send(data)
    console.log(out)
});


router.post('/toPng', upload.single("file"), async function(req, res, next)  {
  const {
    file,
    body: { name,quality }
  } = req;

  console.log(req)
  const fileName = file.originalName;
  const onlyfilename=file.originalName.slice(0,-4);

  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );

  res.setHeader('Content-Type', 'image/*');
    const pngquality=parseInt(req.body.quality);

  const out=await sharp(`${__dirname}/../public/images/${fileName}`).png({
    quality:pngquality
  }).toFile(`${__dirname}/../public/images/${onlyfilename}c.png`) 

  

  let sizeInMB = (out.size / (1024*1024)).toFixed(2);
  const data={
    file:`http://localhost:9000/images/${onlyfilename}c.png`,
    filename:`${onlyfilename}c.png`,
    size:sizeInMB,
  }

  var files = [`${__dirname}/../public/images/${fileName}`, `${__dirname}/../public/images/${onlyfilename}c.png`];
  setTimeout(
    () => {
      deleteFiles(files, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('all files removed');
        }
      });
    },10000);
  console.log(out)
  res.send(data)
});

/* router.post('/satValue', upload.single("file"), async function(req, res, next)  {
  const {
    file,
    body: { name,saturation}
  } = req;

  const saturationvalue=parseInt(req.body.saturation);
  const fileName = file.originalName;
  const onlyfilename=file.originalName.slice(0,-4);

  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );

  res.setHeader('Content-Type', 'image/*');

  const out=await sharp(`${__dirname}/../public/images/${fileName}`).modulate({
    saturation: saturationvalue,
  }).toFile(`${__dirname}/../public/images/${onlyfilename}-c.jpg`) 
  
  const data={
    file:`http://localhost:9000/images/${onlyfilename}-c.jpg`
  }
  console.log(out)
  res.send(data)
}); */

/* router.get('/download', async function(req, res)  {
  const {
    file,
    body: { name}
  } = req;
  console.log(req.body.name);
  const downloadfile = `${__dirname}/../public/images/${req.body.name}`;
  res.download(downloadfile); // Set disposition and send it.
}); */

router.get("/download/:name", controller.download);


module.exports = router;
