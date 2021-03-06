const mongoose = require('mongoose')

const ListSchema = mongoose.Schema({
    creator : {
        type : String,
        required : true
    },
    
    listName : {
        type : String,
        required : true
    },

    canShare : {
        type : Boolean,
        require : true
    },

    items : {
        type : Array,
        required : false
    }
})

module.exports = mongoose.model('listModel', ListSchema);