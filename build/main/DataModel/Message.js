import { DatabaseService } from "../Service/Database.js";
import { Discussion } from "./Discussion.js";
import { User } from "./User.js";
import { WeakRefMap } from "../Service/WeakRefMap.js";

const CACHE = new WeakRefMap();

// DAO
class Message
{
	static createFromData(data)
	{
		if (!data.id)
		{
			throw new Error("Invalid data");
		}

		let message = CACHE.get(data.id);

		if (!message)
		{
			message = new this();

			message.id = data.id;
			message.creationDate = data.creation_date;
			message.userId = data.user_id;
			message.discussionId = data.discussion_id;
			message.content = data.content;
		}

		return message;
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

	getDiscussionId()
	{
		return this.discussionId;
	}

	setDiscussionId(discussionId)
	{
		this.discussionId = discussionId;
	}

	async getDiscussion()
	{
		const DISCUSSION = await Discussion.getById(this.discussionId);
		return DISCUSSION;
	}

	setDiscussion(discussion)
	{
		if (!discussion.id)
		{
			throw new Error("Discussion is not saved");
		}

		this.discussionId = discussion.id;
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
