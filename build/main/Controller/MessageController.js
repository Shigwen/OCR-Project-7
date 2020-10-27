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

			const GET = request.getQuery();

			let content = await TEMPLATING.render(`new_message.html`, {id: GET.id});

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

			const POST = request.getRequest();
			const USER_ID = SESSION.get("userId");
			const GET = request.getQuery();

			const NEW_MESSAGE = new Message();

			NEW_MESSAGE.setUserId(USER_ID);
			NEW_MESSAGE.setDiscussionId(GET.id);
			NEW_MESSAGE.setContent(POST.content);
			NEW_MESSAGE.save();

			response.statusCode = 303;
			response.setHeader("Location", `/discussion/${GET.id}`);
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
