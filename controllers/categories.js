const { response, request } = require("express");
const { Category } = require("../models");

const categoriesGet = async ( req = request, res = response ) => {
    const {limit = 10, from = 0} = req.query;

    const condition = { state: true};

    const [total, categories] = await Promise.all([
        Category.count(condition),
        Category.find(condition)
                .limit(limit)
                .skip(from)
                .populate('user', 'name')
    ]);

    res.json({
        total,
        categories
    })
};

const categoryGetById = async ( req = request, res = response ) => {
    const { id } = req.params;

    const categoryInDB = await Category.findById(id).populate('user', 'name');

    res.json(categoryInDB);
};

const createCategories = async ( req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryInDB = await Category.findOne({ name });

    if ( categoryInDB ) {
        return res.status(400).json({
            msg: `The category ${ categoryInDB.name } exists in our database already`
        })
    }

    const data = {
        name,
        user: req.userAuth._id
    };

    const category = new Category( data );
    await category.save();

    res.status(201).json( category );
};

const updateCategory = async ( req = request, res = response) => {
    const { id } = req.params;

    const { state, user, ...data} = req.body;
    data.name = data.name.toUpperCase();
    data.user = req.userAuth._id;


    const categoryUpdate = await Category.findByIdAndUpdate(id, data, {new: true}, {new: true}); // {new:true} asi que se grabe directamente luego luego el registro pero ya actualizado, de lo contrario lo grabaria en la variable antes de ser actualizado


    res.json(categoryUpdate)
};

const deleteCategory = async ( req = request, res = response) => {
    const { id } = req.params;

    const categoryDelete = await Category.findByIdAndUpdate(id, {state: false}, {new: true});

    res.json(categoryDelete);
};

module.exports = {
    createCategories,
    categoriesGet,
    categoryGetById,
    updateCategory,
    deleteCategory
}