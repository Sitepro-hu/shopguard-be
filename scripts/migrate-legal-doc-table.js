/**
 * LegalDocs tábla létrehozása (ha még nincs).
 * Futtatás: npm run db:migrate-legal-doc
 */
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: process.env.DB_DIALECT }
);

async function tableExists(name) {
  const [rows] = await sequelize.query(
    `SELECT 1 FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    { replacements: [process.env.DB_NAME, name] }
  );
  return Array.isArray(rows) && rows.length > 0;
}

async function run() {
  try {
    if (await tableExists("LegalDocs")) {
      console.log("⏭ LegalDocs table already exists");
      return;
    }
    await sequelize.query(`
      CREATE TABLE \`LegalDocs\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(255) NOT NULL,
        \`slug\` VARCHAR(255) NULL,
        \`content\` TEXT NULL,
        \`status\` ENUM('PUBLISHED', 'DRAFT', 'DELETED') DEFAULT 'DRAFT',
        \`displayOrder\` INT NOT NULL DEFAULT 1000,
        \`createdAt\` DATETIME NOT NULL,
        \`updatedAt\` DATETIME NOT NULL,
        PRIMARY KEY (\`id\`)
      )
    `);
    console.log("✅ LegalDocs table created");
  } catch (e) {
    console.error("Migration failed:", e.message);
    throw e;
  }
}

run()
  .finally(() => sequelize.close())
  .catch(() => process.exit(1));
