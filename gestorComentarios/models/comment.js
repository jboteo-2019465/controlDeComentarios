import  mongoose  from 'mongoose';

const commentSchema = new mongoose.Schema({
  contenido: { 
    type: String, 
    required: true 
},
  autor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  fecha: { 
    type: Date, 
    default: Date.now
 },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
