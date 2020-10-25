import { Database } from "../../../lib/Database.js";

const DATABASE = new Database({
	host: "127.0.0.1",
	user: "root",
	database: "groupomania_social_network"
});

export { DATABASE as DatabaseService };