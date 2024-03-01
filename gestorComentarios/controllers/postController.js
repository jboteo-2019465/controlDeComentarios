import Post from '../models/post.js';
import Category from '../models/category.js';
import jwt from 'jsonwebtoken'

//Crear post
export const createPost = async (req, res) => {
    try {
        const { titulo, categoria, contenido, autor } = req.body;

        // Verificar si la categoría ya existe en la base de datos
        let existingCategory = await Category.findOne({ name: categoria });

        if (!existingCategory) {
            // Si la categoría no existe, crear una nueva
            existingCategory = new Category({ name: categoria });
            await existingCategory.save();
        }

        //Obtener token
        let token = req.headers.authorization
        //Decodificar token
        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id

        // Crear la publicación con la categoría existente o recién creada
        const post = new Post({
            titulo,
            categoria: existingCategory._id, 
            contenido,
            autor: id // Suponiendo que req.user contiene el usuario autenticado
        });

        await post.save();
        res.status(201).send({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

//Editar post
/*export const updatePost = async(req, res)=>{
    try {
        //obtener id del token
        let token = req.headers.authorization
        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let idUser = decodeToken.id

        const post = await Post.findOne({_id: req.params.postId});
        if (!post) {
            return res.status(404).send({ message: 'Post no encontrado.' });
        }
        if(idUser === post.autor){
            post.titulo = req.body.titulo || post.titulo;
            post.categoria = req.body.categoria || post.categoria;
            post.contenido = req.bosy.contenido || post.contenido;

            //Guardar cambios en la base de datos
            await post.save()
           
        }else{
            return res.status(404).send({ message: 'Post no autorizado para actualizar.' });
        }
        
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error al actualizar el post.' });
        
    }
}*/

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Buscar el post en la base de datos
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Verificar si el usuario que intenta editar es el autor del post
        if (post.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to update this post' });
        }

        // Actualizar los campos del post
        post.title = title;
        post.content = content;
        post.updatedAt = new Date(); // Actualizar la fecha de edición

        await post.save();

        res.send({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

//Elimiar post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el post en la base de datos
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Verificar si el usuario que intenta eliminar es el autor del post
        if (post.autor.toString() !== req.user.id) {
            return res.status(403).send({ message: 'You are not authorized to delete this post' });
        }

        // Eliminar el post de la base de datos
        await Post.findByIdAndDelete(id);

        res.send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
