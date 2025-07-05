const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Step 5: GetAll endpoint - Obtener todos los contactos
router.get('/contacts', async (req, res) => {
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
});

// Step 5: Get endpoint - Obtener un contacto por ID
router.get('/contacts/:id', async (req, res) => {
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
});

module.exports = router;