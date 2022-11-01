const { request, response } = require("express");
const { User, Category, Product } = require("../models");
const { ObjectId } = require('mongoose').Types;

const validCollections = [  
    'categories',
    'roles',
    'products',
    'users'
];

const searchUsers = async (term , res = response) => {

    if ( ObjectId.isValid( term ) ) {
        const user = await User.findById( term );

        return res.status(200).json({
            results: ( user ) ? [user] : []
        })
    }

    const regexp = new RegExp( term, 'i');

    const users = await User.find({ 
        $or: [ { name: regexp}, { email: regexp} ],
        $and: [ { state: true }]
     });

    res.status(200).json({
        results: users
    })
};

const searchCategories = async (term , res = response) => {

    if ( ObjectId.isValid( term ) ) {
        const category = await Category.findById( term );

        return res.status(200).json({
            results: ( category ) ? [category] : []
        })
    }

    const regexp = new RegExp( term, 'i');

    const categories = await Category.find({ name: regexp, state: true});

    res.status(200).json({
        results: categories
    })
};

const searchProducts = async (term , res = response) => {

    if ( ObjectId.isValid( term ) ) {
        const product = await Product.findById( term )
                                     .populate('category', 'name');

        return res.status(200).json({
            results: ( product ) ? [product] : []
        })
    }

    const regexp = new RegExp( term, 'i');

    const products = await Product.find({ name: regexp, state: true})
                                  .populate('category', 'name');

    res.status(200).json({
        results: products
    })
};

const search = async ( req = request, res = response) => {
    const { collection, term } = req.params;

    if ( !validCollections.includes(collection) ) {
        return res.status(400).json({
            msg: `${ collection } collection doesn´t exist`
        })
    }

    switch (collection) {
        case 'categories':            
            searchCategories(term, res);
        break;

        case 'products':
            searchProducts(term, res);
        break;

        case 'users':
            searchUsers(term, res);
        break;
    }

};

module.exports = {
    search
}