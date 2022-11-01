const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const { response, request } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");
const { url } = require('inspector');

cloudinary.config(process.env.CLOUDINARY_URL);


const upload = async (req = request, res = response) => {  
    try { //Debido a que la promesa del uploadFile() puede regresar un reject, ese reject lo manejamos con un try y catch
      const fileName = await uploadFile(req.files, undefined, 'imgs'); // Se pone undefined si no queremos utilizar esa propiedad y que utilice el valor que viene por defecto. Si no tiene un valor por defecto entonces ahi su valor si sera undefined y tirara un error  

      res.json({
        fileName
      })

    } catch (err) {
      res.status(400).json({
        err
      })
    }
};

const updateImage = async ( req = request, res = response ) => {
    const {id, collection} = req.params;

    let model;

    switch (collection) {
      case 'users':

        model = await User.findById( id );
        if ( !model ) {
          return res.status(400).json({
            msg: `User with id ${ id } doesn´t exist in DB`
          })
        }

        break;
      case 'products':

        model = await Product.findById( id );
        if ( !model ) {
          return res.status(400).json({
            msg: `Product with id ${ id } doesn´t exist in DB`
          })
        }
  
        break;
    
      default:
        res.status(500).json({ msg: 'This option collection is not added by developer'})
        break;
    }

    
    // Limpiar imagenes previas
    if( model.img ) {
      const pathImg = path.join(__dirname, '../uploads', collection, model.img);
      if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg); // Elimina el archivo
      }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;

    await model.save(); // Si te fijas aqui no usamos FindByIdAndUpdate(), usamos el save(), lo cual tambien es valido mientras lo que guar no sea una nueva instancia de la collecion 

    res.json({ model })
}

const updateImageCloudinary = async ( req = request, res = response ) => {
  const {id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':

      model = await User.findById( id );
      if ( !model ) {
        return res.status(400).json({
          msg: `User with id ${ id } doesn´t exist in DB`
        })
      }

      break;
    case 'products':

      model = await Product.findById( id );
      if ( !model ) {
        return res.status(400).json({
          msg: `Product with id ${ id } doesn´t exist in DB`
        })
      }

      break;
  
    default:
      res.status(500).json({ msg: 'This option collection is not added by developer'})
      break;
  }

  
  // Limpiar imagenes previas
  if( model.img ) {
    const UrlImgArr = model.img.split('/');
    const img = UrlImgArr[UrlImgArr.length - 1];
    const [ img_id_cloudinary ] = img.split('.');

    cloudinary.uploader.destroy( img_id_cloudinary );
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  model.img = secure_url;

  await model.save(); 

  res.json({ model })
}

const showImage = async ( req = request, res = response ) => {
  const {id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':

      model = await User.findById( id );
      if ( !model ) {
        return res.status(400).json({
          msg: `User with id ${ id } doesn´t exist in DB`
        })
      }

      break;
    case 'products':

      model = await Product.findById( id );
      if ( !model ) {
        return res.status(400).json({
          msg: `Product with id ${ id } doesn´t exist in DB`
        })
      }

      break;
  
    default:
      res.status(500).json({ msg: 'This option collection is not added by developer'})
      break;
  }
  
  // Limpiar imagenes previas

  if( model.img ) {
    return res.json({ img: model.img})
  } 

  const pathImg = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImg);
}

module.exports = {
    upload,
    updateImage,
    updateImageCloudinary,
    showImage
}