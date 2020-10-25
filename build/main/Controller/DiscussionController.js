import { createGzip } from "zlib";
import { Hash, randomBytes } from "crypto";

import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";
import { Authentication as AuthenticationService } from "../Service/Authentication.js";
import { User } from "../DataModel/User.js";
import { Discussion } from "../DataModel/Discussion.js";
import { Message } from "../DataModel/Message.js";

class DiscussionController extends Controller
{
	constructor()
	{
		super();
	}

	async newAction(request, response)
	{
		try
		{
			const SESSION = SessionService.getSession(request, response);
			const IS_LOGGED = AuthenticationService.checkUser(SESSION, response);
			if (!IS_LOGGED)
			{
				return;
			}
			const TEMPLATING = new Templating();
			let content = await TEMPLATING.render(`new_discussion.html`);
			response.setHeader("Content-Type", "text/html");
			response.setHeader("Content-Encoding", "gzip");
			const encoder = createGzip();
			encoder.pipe(response);
			encoder.write(content);
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

	async showAction(request, response)
	{
		try
		{
			const SESSION = SessionService.getSession(request, response);
			const IS_LOGGED = AuthenticationService.checkUser(SESSION, response);

			if (!IS_LOGGED)
			{
				return;
			}

			// Contiendra les variables de la route dans routing.json, ici id
			const GET = request.getQuery();
			// const DISCUSSION = await Discussion.getById(GET.id);

			const DISCUSSION = await Discussion.getById(GET.id);

			if (!DISCUSSION)
			{
				return;
			}

			const MESSAGES = await DISCUSSION.getMessages();
			/*
			const MESSAGES = await DISCUSSION.getMessages(
				(a, b) =>
				{
					return b.getCreationDate() - a.getCreationDate();
				}
			);
			*/
			/*
			const MESSAGES = await DISCUSSION.getMessages(
				(a, b) =>
				{
					return b.getUpvote() - a.getUpvote();
				}
			);
			*/

			console.log("MessageController 75", MESSAGES);

			const TEMPLATING = new Templating();
			let content = await TEMPLATING.render(`discussion.html`, {messages: MESSAGES});

			response.setHeader("Content-Type", "text/html");
			response.setHeader("Content-Encoding", "gzip");
			const encoder = createGzip();
			encoder.pipe(response);
			encoder.write(content);
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

	async postAction(request, response)
	{
		try
		{
			const SESSION = SessionService.getSession(request, response);
			const IS_LOGGED = AuthenticationService.checkUser(SESSION, response);
			if (!IS_LOGGED)
			{
				return;
			}
			const POST = request.getRequest();
			const USER_ID = SESSION.get("userId");

			const NEW_DISCUSSION = new Discussion();

			NEW_DISCUSSION.setUserId(USER_ID);
			NEW_DISCUSSION.setFirstMessageId(null);
			NEW_DISCUSSION.setTitle(POST.title);
			await NEW_DISCUSSION.save();
			const NEW_DISCUSSION_ID = NEW_DISCUSSION.getId();

			const NEW_MESSAGE = new Message();

			NEW_MESSAGE.setUserId(USER_ID);
			NEW_MESSAGE.setDiscussionId(NEW_DISCUSSION_ID);
			NEW_MESSAGE.setContent(POST.content);
			await NEW_MESSAGE.save();

			NEW_DISCUSSION.setFirstMessageId(NEW_MESSAGE.getId());
			await NEW_DISCUSSION.save();

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
export { DiscussionController };
