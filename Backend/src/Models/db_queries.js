import db from "../../config/db.js";

export async function findUserByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
}

export async function findUserById(id) {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
}

export async function get_test_id(test_name) {
    const result = await db.query("SELECT test_id FROM tests WHERE test_name = $1", [test_name]);
    return result.rows[0] || null;
}

export async function findUserByUsername(username) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0] || null;
}

export async function createUser({ email, name, username, password_hash, location, pincode, blood_group, trust_score }) {
    const result = await db.query(
        `INSERT INTO users (email, name, username, password_hash, location, pincode, blood_group, trust_score) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [email, name, username, password_hash, location, pincode, blood_group, trust_score]
    );
    return result.rows[0];
}

export async function completeUserProfileByEmail({ email, name, username, password_hash, location, pincode, blood_group, trust_score }) {
    const result = await db.query(
        `UPDATE users
         SET name = COALESCE(name, $2),
             username = $3,
             password_hash = $4,
             location = $5,
             pincode = $6,
             blood_group = $7,
             trust_score = $8
         WHERE email = $1
         RETURNING *`,
        [email, name, username, password_hash, location, pincode, blood_group, trust_score]
    );
    return result.rows[0] || null;
}

export async function getHealthTips() {
    const result = await db.query("SELECT * FROM health_tips ORDER BY RANDOM() LIMIT 5");
    return result.rows;
}

export async function updatePrice(test_id, pincode, price, user_id, hospitalName, hospitalTier) {
    const result = await db.query(
        `INSERT INTO user_raw_data_entries (user_id, test_id, pincode, price, hospital_name, hospital_tier)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, test_id, pincode, price, hospitalName, hospitalTier]
    );
    return result.rows[0];
}

export async function getPrice(test_id, pincode, hospitalTier) {
    const result = await db.query(
        `SELECT * FROM test_prices WHERE test_id = $1 AND pincode = $2 AND hospital_tier = $3 ORDER BY price ASC limit 1`,
        [test_id, pincode, hospitalTier]
    );
    return result.rows[0];
}

export async function updateuser(user_id, savings, cntsearch) {
    const result = await db.query(
        `UPDATE users SET savings = $1, cntsearch = $2 WHERE id = $3 RETURNING *`,
        [savings, cntsearch, user_id]
    );
    return result.rows[0];
}

export async function createUserActivity(user_id, activity_type, description) {
    const result = await db.query(
        `INSERT INTO user_activities (user_id, activity_type, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user_id, activity_type, description]
    );
    return result.rows[0];
}

export async function getUserActivities(user_id) {
    const result = await db.query(
        `SELECT * FROM user_activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10`,
        [user_id]
    );
    return result.rows;
}

export async function findMedicineByName(searchTerm) {
    const result = await db.query(
        "SELECT * FROM medicines WHERE name ILIKE $1 LIMIT 1",
        [`%${searchTerm}%`]
    );
    return result.rows[0] || null;
}
