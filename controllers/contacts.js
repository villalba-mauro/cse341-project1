const { ObjectId } = require('mongodb');

/**
 * @desc    Obtener todos los contactos
 * @route   GET /contacts
 * @access  Public
 */
const getAll = async (req, res) => {
  try {
    console.log('📋 Solicitando todos los contactos...');
    
    // Acceder a la base de datos desde la variable global
    const contactsCollection = global.db.collection('contacts');
    
    // Obtener todos los documentos de la colección contacts
    const contacts = await contactsCollection.find({}).toArray();
    
    console.log(`✅ Se encontraron ${contacts.length} contactos`);
    
    // Retornar los contactos en formato JSON con status 200
    res.status(200).json(contacts);
    
  } catch (error) {
    console.error('❌ Error obteniendo todos los contactos:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener contactos',
      message: error.message 
    });
  }
};

/**
 * @desc    Obtener un contacto por ID
 * @route   GET /contacts/:id
 * @access  Public
 */
const getSingle = async (req, res) => {
  try {
    // Obtener el ID desde los parámetros de la URL
    const contactId = req.params.id;
    
    console.log(`🔍 Buscando contacto con ID: ${contactId}`);
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!ObjectId.isValid(contactId)) {
      console.log('⚠️ ID inválido proporcionado');
      return res.status(400).json({ 
        error: 'ID de contacto inválido',
        message: 'El ID debe ser un ObjectId válido de MongoDB'
      });
    }
    
    // Acceder a la base de datos desde la variable global
    const contactsCollection = global.db.collection('contacts');
    
    // Buscar el contacto por ID en la base de datos
    const contact = await contactsCollection.findOne({ 
      _id: new ObjectId(contactId) 
    });
    
    // Si no se encuentra el contacto, retornar error 404
    if (!contact) {
      console.log('❌ Contacto no encontrado');
      return res.status(404).json({ 
        error: 'Contacto no encontrado',
        message: `No existe un contacto con el ID: ${contactId}`
      });
    }
    
    console.log(`✅ Contacto encontrado: ${contact.firstName} ${contact.lastName}`);
    
    // Retornar el contacto encontrado
    res.status(200).json(contact);
    
  } catch (error) {
    console.error('❌ Error obteniendo contacto por ID:', error.message);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener contacto',
      message: error.message 
    });
  }
};

/**
 * @desc    Crear un nuevo contacto
 * @route   POST /contacts
 * @access  Public
 */
const createContact = async (req, res) => {
  try {
    console.log('➕ Creando nuevo contacto...');
    
    // Extraer los datos del cuerpo de la petición
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        message: 'Todos los campos son obligatorios: firstName, lastName, email, favoriteColor, birthday',
        received: req.body
      });
    }
    
    // Crear el objeto del nuevo contacto
    const newContact = {
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      email: email.trim().toLowerCase(),
      favoriteColor: favoriteColor.trim(),
      birthday: birthday.trim()
    };
    
    // Acceder a la colección de contactos
    const contactsCollection = global.db.collection('contacts');
    
    // Insertar el nuevo contacto en la base de datos
    const result = await contactsCollection.insertOne(newContact);
    
    console.log(`✅ Contacto creado con ID: ${result.insertedId}`);
    
    // Retornar el ID del nuevo contacto creado
    res.status(201).json({
      message: 'Contacto creado exitosamente',
      contactId: result.insertedId
    });
    
  } catch (error) {
    console.error('❌ Error creando contacto:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor al crear contacto',
      message: error.message
    });
  }
};

/**
 * @desc    Actualizar un contacto existente
 * @route   PUT /contacts/:id
 * @access  Public
 */
const updateContact = async (req, res) => {
  try {
    // Obtener el ID desde los parámetros de la URL
    const contactId = req.params.id;
    
    console.log(`✏️ Actualizando contacto con ID: ${contactId}`);
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        error: 'ID de contacto inválido',
        message: 'El ID debe ser un ObjectId válido de MongoDB'
      });
    }
    
    // Extraer los datos del cuerpo de la petición
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;
    
    // Validar que todos los campos requeridos estén presentes
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        message: 'Todos los campos son obligatorios: firstName, lastName, email, favoriteColor, birthday'
      });
    }
    
    // Crear el objeto con los datos actualizados
    const updatedContact = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(), 
      favoriteColor: favoriteColor.trim(),
      birthday: birthday.trim()
    };
    
    // Acceder a la colección de contactos
    const contactsCollection = global.db.collection('contacts');
    
    // Actualizar el contacto en la base de datos
    const result = await contactsCollection.updateOne(
      { _id: new ObjectId(contactId) },
      { $set: updatedContact }
    );
    
    // Verificar si se encontró y actualizó el contacto
    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: 'Contacto no encontrado',
        message: `No existe un contacto con el ID: ${contactId}`
      });
    }
    
    console.log(`✅ Contacto actualizado exitosamente`);
    
    // Retornar status 204 (No Content) para indicar éxito sin contenido
    res.status(204).send();
    
  } catch (error) {
    console.error('❌ Error actualizando contacto:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor al actualizar contacto',
      message: error.message
    });
  }
};

/**
 * @desc    Eliminar un contacto
 * @route   DELETE /contacts/:id
 * @access  Public
 */
const deleteContact = async (req, res) => {
  try {
    // Obtener el ID desde los parámetros de la URL
    const contactId = req.params.id;
    
    console.log(`🗑️ Eliminando contacto con ID: ${contactId}`);
    
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        error: 'ID de contacto inválido',
        message: 'El ID debe ser un ObjectId válido de MongoDB'
      });
    }
    
    // Acceder a la colección de contactos
    const contactsCollection = global.db.collection('contacts');
    
    // Eliminar el contacto de la base de datos
    const result = await contactsCollection.deleteOne({
      _id: new ObjectId(contactId)
    });
    
    // Verificar si se encontró y eliminó el contacto
    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: 'Contacto no encontrado',
        message: `No existe un contacto con el ID: ${contactId}`
      });
    }
    
    console.log(`✅ Contacto eliminado exitosamente`);
    
    // Retornar status 200 para indicar eliminación exitosa
    res.status(200).json({
      message: 'Contacto eliminado exitosamente',
      deletedId: contactId
    });
    
  } catch (error) {
    console.error('❌ Error eliminando contacto:', error.message);
    res.status(500).json({
      error: 'Error interno del servidor al eliminar contacto',
      message: error.message
    });
  }
};

// Exportar todas las funciones para usarlas en las rutas
module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};