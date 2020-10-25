import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mysql = require("mysql");

function escape(field)
{
	if (typeof field === "string")
	{
		return "`" + field.replace(/[^\w]/g, "") + "`";
	}

	if (field instanceof Array)
	{
		return field.map(escape).join(", ");
	}

	throw new Error("Invalid field type");
}

function secure(value)
{
	if (typeof value === "function")
	{
		throw new Error("Function used as value");
	}

	if (value == null)
	{
		return "NULL";
	}

	if (value instanceof Date)
	{
		return value.toISOString().substr(0, 19).replace("T", " ");;
	}

	if (value instanceof Array)
	{
		return value.map((subvalue) => secure(subvalue)).join(", ");
	}

	if (typeof value === "object")
	{
		throw new Error("Object used as value");
	}

	return JSON.stringify(value);
}

class Database
{
	constructor(config)
	{
		this.pool = mysql.createPool(config);
	}

	query(query_string, values, fields)
	{
		return new Promise(
			(accept, reject) =>
			{
				this.pool.getConnection(
					(error, connection) =>
					{
						if (error)
						{
							reject(error);
						}
						else
						{
							query_string = query_string.replace(
								/:(\w+)/g,
								(label, key) =>
								{
									if (fields && fields.hasOwnProperty(key))
									{
										return escape(fields[key]);
									}

									if (values && values.hasOwnProperty(key))
									{
										return secure(values[key]);
									}

									return label;
								}
							);

							connection.query(
								query_string,
								(error, results) =>
								{
									connection.release();

									if (error)
									{
										reject(error);
									}
									else
									{
										accept(results);
									}
								}
							);
						}
					}
				);
			}
		);
	}
};

export { Database };
