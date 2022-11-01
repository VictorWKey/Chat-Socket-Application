const { response, request } = require("express");
const { Product, Category } = require("../models");



const productsGet = async ( req = request, res = response ) => {
    const {limit = 10, from = 0} = req.query;

    const condition = { state: true};

    const [total, products] = await Promise.all([
        Product.count(condition),
        Product.find(condition)
                .limit(limit)
                .skip(from)
                .populate('user', 'name')
                .populate('category', 'name')
    ]);

    res.json({
        total,
        products
    })
};


const productGetById = async ( req = request, res = response ) => {
    const { id } = req.params;

    const productInDB = await Product.findById(id).populate('user', 'name').populate('category', 'name');

    res.json(productInDB);
};

const createProduct = async (req = request, res = response) => {
    const {state, user, ...body } = req.body;

    const productInDB = await Product.findOne({ name: body.name.toUpperCase() });

    if( productInDB ) {
        return res.status(400).json({
            msg: `The product ${ productInDB.name } exists in our database already`
        })
    }

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.userAuth._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);

};

const updateProduct = async ( req = request, res = response) => {
    const { id } = req.params;

    const { state, user, ...data} = req.body;

    if (data.name) data.name = data.name.toUpperCase();

    data.user = req.userAuth._id;


    const productUpdate = await Product.findByIdAndUpdate(id, data, {new: true}); // {new:true} asi que se grabe directamente luego luego el registro pero ya actualizado, de lo contrario lo grabaria en la variable antes de ser actualizado


    res.json(productUpdate)
};

const deleteProduct = async ( req = request, res = response) => {
    const { id } = req.params;

    const productyDelete = await Product.findByIdAndUpdate(id, {state: false}, {new: true});

    res.json(productyDelete);
};

module.exports = {
    createProduct, 
    productsGet,
    productGetById,
    updateProduct,
    deleteProduct
}