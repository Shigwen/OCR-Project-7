import { Hash, randomBytes } from "crypto";
import { DatabaseService } from "../Service/Database.js";
import { WeakRefMap } from "../Service/WeakRefMap.js";

const CACHE = new WeakRefMap();

// DAO
class User
{
	static createFromData(data)
	{
		if (!data.id)
		{
			throw new Error("Invalid data");
		}

		let user = CACHE.get(data.id);

		if (!user)
		{
			user = new this();

			user.id = data.id;
			user.email = data.email;
			user.salt = Buffer.from(data.salt, "hex");
			user.hash = data.hash;
			user.firstname = data.firstname;
			user.lastname = data.lastname;
			user.job = data.job;
			user.admin = data.admin ? true : false;
			user.creationDate = data.creation_date;

			CACHE.set(data.id, user);
		}

		return user;

		/*
		const USER_1 = await User.getById(1);
		USER_1.setJob("Comptable");
		const USER_2 = await User.getById(1);
		console.log(USER_2.getJob()); // "Comptable" aussi
		*/
	}

	static async getById(id)
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					*
				FROM
					users
				WHERE
					id = :id
				LIMIT
					1
			`,
			{
				id: id
			}
		);

		if (!RESULTS[0])
		{
			return null;
		}

		return this.createFromData(RESULTS[0]);
	}

	static async getByEmail(email)
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					*
				FROM
					users
				WHERE
					email = :email
				LIMIT
					1
			`,
			{
				email: email
			}
		);

		if (!RESULTS[0])
		{
			return null;
		}

		return this.createFromData(RESULTS[0]);
	}

	async save()
	{
		if (this.id)
		{
			await DatabaseService.query(
				`
					UPDATE
						users
					SET
						email = :email,
						salt = :salt,
						hash = :hash,
						firstname = :firstname,
						lastname = :lastname,
						job = :job,
						admin = :admin
					WHERE
						id = :id
				`,
				{
					id: this.id,
					email: this.email,
					salt: this.salt.toString("hex"),
					hash: this.hash,
					firstname: this.firstname,
					lastname: this.lastname,
					job: this.job,
					admin: this.admin
				}
			);
		}
		else
		{
			const RESULT = await DatabaseService.query(
				`
					INSERT INTO
						users (email, salt, hash, firstname, lastname, job, admin)
					VALUES
						(:email, :salt, :hash, :firstname, :lastname, :job, :admin)
				`,
				{
					email: this.email,
					salt: this.salt.toString("hex"),
					hash: this.hash,
					firstname: this.firstname,
					lastname: this.lastname,
					job: this.job,
					admin: this.admin
				}
			);

			this.id = RESULT.insertId;
		}
	}

	getId()
	{
		return this.id;
	}

	getEmail()
	{
		return this.email;
	}

	setEmail(email)
	{
		this.email = email;
	}

	isPasswordValid(password)
	{
		const ENCRYPTOR = new Hash("sha256");
		ENCRYPTOR.update(this.salt.toString("binary") + password);
		const HASH = ENCRYPTOR.digest().toString("hex");
		return this.hash === HASH;
	}

	setPassword(password)
	{
		const SALT = randomBytes(32);
		const ENCRYPTOR = new Hash("sha256");
		ENCRYPTOR.update(SALT.toString("binary") + password);
		const HASH = ENCRYPTOR.digest().toString("hex");

		this.salt = SALT;
		this.hash = HASH;
	}

	getFirstname()
	{
		return this.firstname;
	}

	setFirstname(firstname)
	{
		this.firstname = firstname;
	}

	getLastname()
	{
		return this.lastname;
	}

	setLastname(lastname)
	{
		this.lastname = lastname;
	}

	getJob()
	{
		return this.job;
	}

	setJob(job)
	{
		this.job = job;
	}

	isAdmin()
	{
		return this.admin;
	}

	setAdmin(flag)
	{
		this.admin = flag;
	}

	getCreationDate()
	{
		return this.creationDate;
	}
}

export { User };
