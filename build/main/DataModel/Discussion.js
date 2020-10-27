import { DatabaseService } from "../Service/Database.js";
import { Message } from "./Message.js";
import { User } from "./User.js";
import { WeakRefMap } from "../Service/WeakRefMap.js";

const CACHE = new WeakRefMap();

// DAO
class Discussion
{
	static createFromData(data)
	{
		if (!data.id)
		{
			throw new Error("Invalid data");
		}

		let discussion = CACHE.get(data.id);

		if (!discussion)
		{
			discussion = new this();

			discussion.id = data.id;
			discussion.creationDate = data.creation_date;
			discussion.userId = data.user_id;
			discussion.firstMessageId = data.first_message_id;
			discussion.title = data.title;

			//potential upgrade here
		}

		return discussion;
	}

	static async getById(id)
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					*
				FROM
					discussions
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

	async save()
	{
		if (this.id)
		{
			await DatabaseService.query(
				`
					UPDATE
						discussions
					SET
						user_id = :user_id,
						first_message_id = :first_message_id,
						title = :title
					WHERE
						id = :id
				`,
				{
					id : this.id,
					user_id : this.userId,
					first_message_id : this.firstMessageId,
					title : this.title
				}
			);
		}
		else
		{
			const RESULT = await DatabaseService.query(
				`
					INSERT INTO
						discussions (user_id, first_message_id, title)
					VALUES
						(:user_id, :first_message_id, :title)
				`,
				{
					user_id : this.userId,
					first_message_id : this.firstMessageId,
					title : this.title
				}
			);

			this.id = RESULT.insertId;
		}
	}

	getId()
	{
		return this.id;
	}

	getCreationDate()
	{
		return this.creationDate;
	}

	getUserId()
	{
		return this.userId;
	}

	setUserId(userId)
	{
		this.userId = userId;
	}

	async getUser()
	{
		const USER = await User.getById(this.userId);
		return USER;
	}

	setUser(user)
	{
		if (!user.id)
		{
			throw new Error("User is not saved");
		}

		this.userId = user.id;
	}

	getFirstMessageId()
	{
		return this.firstMessageId;
	}

	setFirstMessageId(firstMessageId)
	{
		this.firstMessageId = firstMessageId;
	}

	async getFirstMessage()
	{
		const MESSAGE = await Message.getById(this.firstMessageId);
		return MESSAGE;
	}

	setFirstMessage(message)
	{
		if (!message.id)
		{
			throw new Error("Message is not saved");
		}

		this.firstMessageId = message.id;
	}

	getTitle()
	{
		return this.title;
	}

	setTitle(title)
	{
		this.title = title;
	}

	async getMessages(sortFunction)
	{
		const RESULTS = await DatabaseService.query(
			`
			SELECT
				*
			FROM
				messages
			WHERE
				discussion_id = :id
			ORDER BY
				id ASC
			`,
			{
				id: this.id
			}
		);

		if (!RESULTS.length)
		{
			return [];
		}

		const MESSAGES = RESULTS.map(
			(data) =>
			{
				return Message.createFromData(data);
			}
		);

		if (sortFunction)
		{
			const FIRST_MESSAGE = MESSAGES.shift();
			MESSAGES.sort(sortFunction);
			MESSAGES.unshift(FIRST_MESSAGE);
		}

		return MESSAGES;
	}

	static async getAll()
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					*
				FROM
					discussions
				ORDER BY
					id DESC
				LIMIT
					50
			`
		);

		if (!RESULTS.length)
		{
			return null;
		}

		const DISCUSSIONS = RESULTS.map(
			(discussion) =>
			{
				return this.createFromData(discussion);
			}
		);

		return DISCUSSIONS;
	}
}

export { Discussion };
