import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'


export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

export const register = async (req, res) => {
    try {
        let data = req.body
        let { username, email } = req.body
        let userExists = await User.findOne({
            $or: [
                {
                    username
                },
                {
                    email
                }
            ]
        })
        if (userExists) {
            return res.status(500).send({ message: 'Username or/and email in use' })
        }
        data.password = await bcrypt.hash(data.password, 10);
        let user = new User(data)
        await user.save();

        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user' });

    }

}

// inicio de sesión de usuarios
export const login = async (req, res) => {
    try {
        // Capturar los datos del formulario (body)
        let { usernameoremail, password } = req.body;

        // Buscar al usuario en la base de datos (puede ser maestro o estudiante)
        let user = await User.findOne({ 
            $or: [
                { username: usernameoremail },
                { email: usernameoremail }
            ]
        }) 

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Verificar la contraseña
        let isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        // Generar token de autenticación
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });

        // Responder con un mensaje de éxito y el token
        res.json({ message: `Login successful. Welcome ${user.username}`, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

//Editar perfil
export const update = async (req, res)=>{
    try {
        //Obtener token
        let token = req.headers.authorization
        //Decodificar el token y obtener el id
        let decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        let id = decodeToken.id
        

        //Buscar usuario por su id
        const user = await User.findById(id);
        if(!user){
            return res.status(404).send({message: 'User not found'})
        }
        let passwrodValid = req.body.password
        if(!passwrodValid){
            return res.status(404).send({message: 'old password missing'})

        }
        let isPasswordValid = await bcrypt.compare(passwrodValid, user.password);

        console.log(isPasswordValid)
        
        //Actualizar los datos en la base de datos
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        user.surname = req.body.surname || user.surname;
        user.telefono = req.body.telefono || user.telefono;
        if(isPasswordValid){
            user.password = req.body.newPassword || user.password;
        }else{
            return res.status(404).send({message: 'invalid password'})

        }
        //Guardar los cambios en la base de datos
        await user.save()
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error al actualizar el perfil.' });
        
    }
}