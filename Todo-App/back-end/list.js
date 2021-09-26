const mongoose=require('mongoose');
const Listchema=new mongoose.Schema({
    listId:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    todoid:{
        type:[Number],
        required:true,
    },
    userid:{
        type:Number,
        required: true,
    },
    lastModified:{
        type:Date,
        default: Date.now,
    }
});

module.exports=new mongoose.model("List", Listchema);