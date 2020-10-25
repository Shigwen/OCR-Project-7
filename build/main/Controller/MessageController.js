import { createGzip } from "zlib";
import { Hash, randomBytes } from "crypto";

import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";
import { Authentication as AuthenticationService } from "../Service/Authentication.js";
import { User } from "../DataModel/User.js";
import { Discussion } from "../DataModel/Discussion.js";
import { Message } from "../DataModel/Message.js";

class MessageController extends Controller
{
	constructor()
	{
		super();
	}

	async postAction(request, response)
	{
		try
		{
			const SESSION = SessionService.getSession(request, response);

			const POST = request.getRequest();
			const USER_ID = SESSION.get("userId");

			const NEW_DISCUSSION = new Discussion();

			NEW_DISCUSSION.setUserId(USER_ID);
			NEW_DISCUSSION.setFirstMessageId(null);
			NEW_DISCUSSION.setTitle(POST.title);
			await NEW_DISCUSSION.save();

			const NEW_MESSAGE = new Message();

			NEW_MESSAGE.setUserId(USER_ID);
			NEW_MESSAGE.setDiscussionId(NEW_DISCUSSION.getId());
			NEW_MESSAGE.setContent(POST.content);
			NEW_MESSAGE.save();
			NEW_DISCUSSION.setFirstMessageId(NEW_MESSAGE.getId);
			NEW_DISCUSSION.save();

			response.statusCode = 303;
			response.setHeader("Location", "/timeline");
			response.setHeader("Content-Encoding", "gzip");
			const encoder = createGzip();
			encoder.pipe(response);
			encoder.end();
		}
		catch (error)
		{
			console.log(error);
			response.statusCode = 303;
			response.setHeader("Location", "/");
			response.setHeader("Content-Encoding", "gzip");
			const encoder = createGzip();
			encoder.pipe(response);
			encoder.end();
		}
	}
}
export { MessageController };
