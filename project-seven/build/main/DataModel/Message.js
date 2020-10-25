import { DatabaseService } from "../Service/Database.js";
import { Discussion } from "./Discussion.js";

// DAO
class Message
{
	static createFromData(data)
	{
		const MESSAGE = new this();

		MESSAGE.id = data.id;
		MESSAGE.creationDate = data.creation_date;
		MESSAGE.userId = data.user_id;
		MESSAGE.discussionId = data.discussion_id;
		MESSAGE.content = data.content;

		return MESSAGE;
	}

	static async getById(id)
	{
		const RESULTS = await DatabaseService.query(
			`
				SELECT
					*
				FROM
					messages
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

	async getDiscussion()
	{
		const DISCUSSION = await Discussion.getById(this.discussionId);
		return DISCUSSION;
	}

	async save()
	{
		if (this.id)
		{
			await DatabaseService.query(
				`
					UPDATE
						messages
					SET
						user_id = :user_id,
						discussion_id = :discussion_id,
						content = :content
					WHERE
						id = :id
				`,
				{
					id : this.id,
					user_id : this.userId,
					discussion_id : this.discussionId,
					content : this.content
				}
			);
		}
		else
		{
			const RESULT = await DatabaseService.query(
				`
					INSERT INTO
						messages (user_id, discussion_id, content)
					VALUES
						(:user_id, :discussion_id, :content)
				`,
				{
					user_id : this.userId,
					discussion_id : this.discussionId,
					content : this.content
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

	getDiscussionId()
	{
		return this.discussionId;
	}

	setDiscussionId(discussionId)
	{
		this.discussionId = discussionId;
	}

	getContent()
	{
		return this.content;
	}

	setContent(content)
	{
		this.content = content;
	}
}

export { Message };
