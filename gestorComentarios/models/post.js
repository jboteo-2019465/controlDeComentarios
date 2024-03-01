import  mongoose  from 'mongoose';

const postSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true 
},
  categoria: { 
    type: String, 
    required: true 
},
  contenido: 
  { type: String, 
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
comentarios: {
  type: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' }],
  default: []
}
});

const Post = mongoose.model('Post', postSchema);

export default Post;
