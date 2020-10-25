import { DatabaseService } from "../Service/Database.js";
import { Message } from "./Message.js";

// DAO
class Discussion
{
	static createFromData(data)
	{
		const DISCUSSION = new this();

		DISCUSSION.id = data.id;
		DISCUSSION.creationDate = data.creation_date;
		DISCUSSION.userId = data.user_id;
		DISCUSSION.firstMessageId = data.first_message_id;
		DISCUSSION.title = data.title;

		return DISCUSSION;
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

	getFirstMessageId()
	{
		return this.firstMessageId;
	}

	setFirstMessageId(firstMessageId)
	{
		this.firstMessageId = firstMessageId;
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

	static async getAllDiscussions()
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					id, title
				FROM
					discussions
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
