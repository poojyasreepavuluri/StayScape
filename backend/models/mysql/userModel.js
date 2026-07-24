const db = require('../../config/mysql');

const createUser = async (name, email, hashedPassword, phone) => {
    const [result] = await db.query(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone]
    );
    return result.insertId;
};

const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, name, email, phone, created_at FROM users WHERE id = ?',
        [id]
    );
    return rows[0];
};

const updateUser = async (id, name, phone) => {
    await db.query(
        'UPDATE users SET name = ?, phone = ? WHERE id = ?',
        [name, phone, id]
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser
};