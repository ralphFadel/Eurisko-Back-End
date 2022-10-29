const { Error } = require('mongoose');
const Category = require('../models/category');
const Note = require('../models/note');

//fetching all categories by the logged in user
exports.getAllCategories = (req, res, next) => {

    Category.find({userId: req.userId})
    .then(category => {
        if(!category){
            const err = new Error('Could not find Categories!');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({
            message: 'Kindly find all categories below:',
            Categories: category});
    })
    .catch(err => console.log(err));
};

//creating a new category by the logged in user
exports.createCategory = (req, res, next) => {
    const category = new Category({
        title: req.body.title,
        description: req.body.description,
        notes: req.body.notes,
        userId: req.userId
    })
    category.
        save()
        .then( result =>{
            res.status(201).json({
                message: 'Category created successfully!, it does not have notes attached under it',
                Category: result
              });
        }).
        catch( err => {
            console.log(err);
        });
};

//fetching a single category by id by the logged in user
exports.getCategory = (req, res, next) => {
    Category.findOne({ userId: req.userId, _id : req.body.categoryId })
    .then(category => {
        if(!category){
            const err = new Error('Could not find Category!');
            err.statusCode=404;
            throw err;
        }
        Note.find({ _id : req.body.categoryId })
    })
    .then( notes => {
        if(!notes){
            const err = new Error('Category is Empty, why not add some notes under it!');
            err.statusCode=404;
            throw err;
        }
        res.status(200).json({
            message: 'Kindly find the your notes under the requested category below:',
            Notes: notes});
    })
    .catch(err => console.log(err));
};

//updating a category by the logged in user
exports.updateCategory = (req, res, next) => {

    const catId = req.body._id;
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.userId;

    Category.findById(catId)
    .then( category => {
        if(!category || category.userId!=userId){
            const err = new ('Category not Found!');
            err.statusCode=404;
            throw err;
        }
        category.title= title;
        category.description= description;
        return category.save();
    })
    .then( result =>{
        res.status(201).json({
            message: 'Category Updated successfully!',
            Category: result
          });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;    
        }
        next(err);
    })
}

//deleting a category by the logged in user
exports.deleteCategory = (req, res, next) => {

    const catId = req.body._id;
    const userId = req.userId;
    Category.findById(catId)
    .then( category => {
        //Check logged in user if he created the cat
        if(!category || category.userId!=userId){
            const err = new ('Category not Found!');
            err.statusCode=404;
            throw err;
        }
    return Category.findByIdAndRemove(catId);
    })
    .then( result =>{
        res.status(201).json({
            message: 'Category Deleted successfully!',
          });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;    
        }
        next(err);
    })
}