const express = require('express');
const PersonController = require('../controllers/personController');
const Person = require('../models/person');
const { pool } = require('../config/database');

const router = express.Router();
const personModel = new Person(pool);
const personController = new PersonController(personModel);

router.post('/', personController.createPerson.bind(personController));
router.get('/', personController.getAllPersons.bind(personController));
router.put('/:id', personController.updatePerson.bind(personController));
router.delete('/:id', personController.deletePerson.bind(personController));

module.exports = router;