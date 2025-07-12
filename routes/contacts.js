const express = require('express');
const router = express.Router();

// Importar el controlador de contactos
const contactsController = require('../controllers/contacts');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del contacto generado por MongoDB
 *           example: "507f1f77bcf86cd799439011"
 *         firstName:
 *           type: string
 *           description: Nombre del contacto
 *           example: "Juan"
 *         lastName:
 *           type: string
 *           description: Apellido del contacto
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del contacto
 *           example: "juan.perez@email.com"
 *         favoriteColor:
 *           type: string
 *           description: Color favorito del contacto
 *           example: "azul"
 *         birthday:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del contacto
 *           example: "1990-05-15"
 *     ContactInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         firstName:
 *           type: string
 *           description: Nombre del contacto
 *           example: "Juan"
 *         lastName:
 *           type: string
 *           description: Apellido del contacto
 *           example: "Pérez"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del contacto
 *           example: "juan.perez@email.com"
 *         favoriteColor:
 *           type: string
 *           description: Color favorito del contacto
 *           example: "azul"
 *         birthday:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del contacto
 *           example: "1990-05-15"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Tipo de error
 *         message:
 *           type: string
 *           description: Descripción detallada del error
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Obtiene todos los contactos
 *     tags: [Contacts]
 *     description: Retorna una lista con todos los contactos almacenados en la base de datos
 *     responses:
 *       200:
 *         description: Lista de contactos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/contacts', contactsController.getAll);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Obtiene un contacto por ID
 *     tags: [Contacts]
 *     description: Busca y retorna un contacto específico usando su ID único
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del contacto (ObjectId de MongoDB)
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contacto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: ID de contacto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Contacto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/contacts/:id', contactsController.getSingle);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crea un nuevo contacto
 *     tags: [Contacts]
 *     description: Crea un nuevo contacto con todos los campos requeridos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contacto creado exitosamente"
 *                 contactId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *       400:
 *         description: Faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/contacts', contactsController.createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Actualiza un contacto existente
 *     tags: [Contacts]
 *     description: Actualiza completamente un contacto existente con nuevos datos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del contacto a actualizar
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       204:
 *         description: Contacto actualizado exitosamente (sin contenido)
 *       400:
 *         description: ID inválido o faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Contacto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/contacts/:id', contactsController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Elimina un contacto
 *     tags: [Contacts]
 *     description: Elimina permanentemente un contacto de la base de datos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID único del contacto a eliminar
 *         schema:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Contacto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contacto eliminado exitosamente"
 *                 deletedId:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *       400:
 *         description: ID de contacto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Contacto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/contacts/:id', contactsController.deleteContact);

module.exports = router;