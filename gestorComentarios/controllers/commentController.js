import Comment from '../models/comment.js';
import Post from '../models/post.js';
import jwt from 'jsonwebtoken'

export const createComment = async (req, res) => {
    try {
        const { contenido } = req.body;
        const { postId } = req.params; // Obtener el ID del post del parámetro de la URL

         //Obtener token
         let token = req.headers.authorization
         //Decodificar el token y obtener el id
         let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
         let userId = decodeToken.id

        // Crear el comentario
        const comment = new Comment({
            contenido,
            autor: userId,
        });

        // Guardar el comentario en la base de datos
        (await comment.save()).populate({
            path: 'autor',
            select: 'name -_id'
        });

        // Actualizar el post para incluir el comentario creado
        const post = await Post.findById(postId)
        
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }
        post.comentarios.push(comment._id);
        await post.save()
        let publicacion = {
            titulo: post.titulo,
            contenido: post.contenido
        }

        res.status(201).send({ message: 'Comment created successfully', comment, publicacion });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

//Editar comentario
export const updateComment = async (req, res) => {
    try {
        let { commentId } = req.params;
        console.log(commentId)
        let { contenido } = req.body;

        // Buscar el post en la base de datos
        let comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Verificar si el usuario que intenta editar es el autor del post
        if (comment.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to update this comment' });
        }

        
        comment.contenido = contenido;
        comment.updatedAt = new Date(); 

         (await comment.save()).populate({
            path: 'autor',
            select: 'name -_id'
        })

        res.send({ message: 'Comment updated successfully' });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

//Eliminar comentario
export const deleteComment = async (req, res) => {
    try {
        let { commentId } = req.params;

        // Buscar el post en la base de datos
        let comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Verificar si el usuario que intenta eliminar es el autor del post
        if (comment.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }

        // Eliminar el post de la base de datos
        await Comment.findByIdAndDelete(commentId);

        res.send({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
