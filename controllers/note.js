const { Error } = require('mongoose');
const Note = require('../models/note');

//creating a note by the logged in user.
exports.createNote = (req, res, next) => {
    const note = new Note({
        title: req.body.title,
        noteBody: req.body.noteBody,
        categoryId: req.body.categoryId,
        tags: req.body.tags,
        userId: req.userId
    })
    note.save()
        .then(result => {
            res.status(201).json({
                message: 'Note created successfully!',
                Note: result
            });
        }).
        catch(err => {
            console.log(err);
        });
};

// returns all notes for the logged in user. 
exports.sortAllNotes = (req, res, next) => {
    Note.find({ userId: req.userId }).sort({updatedAt: 'desc'})
    .then(notes => {
        res.status(201).json({
            message: 'Your Notes:',
            Notes: notes
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;    
        }
        next(err);
    });
};

// returns all notes under the given category for the logged in user.
exports.filterByCategory = (req, res, next) => {

    Note.find({categoryId: req.params.catId, userId: req.userId})
    .then(notes => {
        if(!notes){
            const err = new Error('Notes not Found!');
            err.statusCode=404;
            throw err;
        }
        res.status(201).json({
            message: 'Your Notes:',
            Notes: notes
        });
    })
    .catch(err => console.log(err));
};

// returns all notes that have a certain tag. 
exports.searchByTag = (req, res, next) => {
    Note.find({ tags: req.params.key })
    .then(notes => {
        res.status(201).json({
            message: 'Your Notes:',
            Notes: notes
        });
    })
    .catch(err => console.log(err));
};

//updating a single note
exports.updateNote = (req, res, next) => {

    const noteId= req.body._id;
    const title= req.body.title;
    const noteBody= req.body.noteBody;
    const categoryId= req.body.categoryId;
    const tags= req.body.tags;
    const userId= req.userId;

    Note.findById(noteId)
    .then( note => {
        if(!note || note.userId!=userId){
            const err = new Error('Note not Found!');
            err.statusCode(404);
            throw err;
        }
        note.title= title;
        note.noteBody= noteBody;
        note.categoryId= categoryId;
        note.tags= tags;
        return note.save();
    })
    .then( result =>{
        res.status(201).json({
            message: 'Note Updated successfully!',
            Note: result
          });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;    
        }
        next(err);
    })
};

//deleting a single note.
exports.deleteNote = (req, res, next) => { //deletes the note.

    const noteId = req.body._id;
    const userId = req.userId;
    Note.findById(noteId)
    .then( note => {
        //Check logged in user if he created the cat
        if(!note || note.userId!=userId){
            const err = new Error('Note not Found!');
            err.statusCode(404);
            throw err;
        }
    return Note.findByIdAndRemove(noteId);
    })
    .then( result =>{
        res.status(201).json({
            message: 'Note Deleted successfully!',
          });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode=500;    
        }
        next(err);
    })
}