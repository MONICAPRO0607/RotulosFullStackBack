const { generarLlave } = require("../../utils/jwt");
const Cliente = require("../models/clientes");
const bcrypt = require("bcrypt");

const getCliente = async (req, res, next) => {
  try {
    const clientes = await Cliente.find().populate("pedido");
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(400).json("Error al obtener clientes");
  }
};

const getClienteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id).populate("pedido");
    return res.status(200).json(cliente);
  } catch (error) {
    return res.status(400).json("Error al obtener cliente");
  }
};

const registerCliente = async (req, res, next) => {
  try {
    const clienteDuplicated = await Cliente.findOne({ email: req.body.email });
    if (clienteDuplicated) {
      return res.status(400).json("Usuario ya existente");
    };

    const newCliente = new Cliente({
      nombre: req.body.nombre,
      telefono: req.body.telefono,  
      direccion: req.body.direccion, 
      email: req.body.email,
      password: req.body.password,
      rol: "user"
    });
    
    const cliente = await newCliente.save();
    return res.status(201).json(cliente);
  } catch (error) {
    return res.status(400).json("Error al registrar cliente");
  };
};

const loginCliente = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cliente = await Cliente.findOne({ email });

    if (!cliente) {
        return res.status(400).json("Usuario o contraseña incorrectos")
    };

    const match = await bcrypt.compare(password, cliente.password);
    if (match) {
      const token = generarLlave(cliente._id);
      return res.status(200).json({ token, cliente });
    };

    return res.status(400).json("Usuario o contraseña incorrectos");

  } catch (error) {
    return res.status(400).json("Error");
  }
};

const updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id) {
        return res.status(400).json("No puedes modificar a alguien que no seas tu mismo")
    }

       const clienteActualizado = await Cliente.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json(clienteActualizado);
  } catch (error) {
    return res.status(400).json("Error al actualizar cliente");
  }
};

module.exports = { getCliente, getClienteById, registerCliente, loginCliente, updateCliente };


