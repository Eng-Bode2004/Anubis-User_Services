const mongoose = require ('mongoose')

const User_Schema = new mongoose.Schema({

    phone_Number:{
        type:String,
        unique:true,
        sparse: true,
        trim: true,
        partialFilterExpression: { phone_Number: { $type: "string" } },
    },

    email:{
        type:String,
        unique:true,
        sparse: true,
        trim: true,
        partialFilterExpression: { email: { $type: "string" } },
    },

    username:{
        type:String,
        required:true,
        unique:true,
        minlength:7,
    },


    password:{
        type:String,
        required:true,
        minlength:12,
    },


    isPhone_Verified:{
        type:Boolean,
        default:false,
    },

    isEmail_Verified:{
        type:Boolean,
        default:false,
    },


    is_active:{
        type:Boolean,
    },


    Role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role',
    },


    Profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile',
    },

})

module.exports = new mongoose.model('Users',User_Schema)