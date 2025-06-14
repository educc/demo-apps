class PersonController {
    constructor(personModel) {
        this.personModel = personModel;
    }

    async createPerson(req, res) {
        const { name, age } = req.body;
        try {
            const newPerson = await this.personModel.save(name, age);
            res.status(201).json(newPerson);
        } catch (error) {
            res.status(500).json({ message: 'Error creating person', error });
        }
    }

    async getAllPersons(req, res) {
        try {
            const persons = await this.personModel.getAll();
            res.status(200).json(persons);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving persons', error });
        }
    }

    async updatePerson(req, res) {
        const { id } = req.params;
        const { name, age } = req.body;
        try {
            const updatedPerson = await this.personModel.update(id, name, age);
            if (updatedPerson) {
                res.status(200).json(updatedPerson);
            } else {
                res.status(404).json({ message: 'Person not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating person', error });
        }
    }

    async deletePerson(req, res) {
        const { id } = req.params;
        try {
            const deleted = await this.personModel.delete(id);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Person not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting person', error });
        }
    }
}

module.exports = PersonController;