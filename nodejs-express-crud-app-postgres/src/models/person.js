class Person {
    constructor(db) {
        this.db = db;
    }

    async save(name, age) {
        const query = 'INSERT INTO persons (name, age) VALUES ($1, $2) RETURNING *';
        const values = [name, age];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async getAll() {
        const query = 'SELECT * FROM persons';
        const result = await this.db.query(query);
        return result.rows;
    }

    async update(id, name, age) {
        const query = 'UPDATE persons SET name = $1, age = $2 WHERE id = $3 RETURNING *';
        const values = [name, age, id];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM persons WHERE id = $1 RETURNING *';
        const values = [id];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Person;