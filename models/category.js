const {Schema, model} = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // Con esto decimos que sera de tipo ObjectID, osea sera un registro de mongo
        ref: 'User', //Hace referencia al modelo del que se obtendra este registro
        required: true
    }
});

CategorySchema.methods.toJSON = function() {
    const {__v, ...data} = this.toObject();
    

    return data;
};

module.exports = model('Categorie', CategorySchema);