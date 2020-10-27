import { createGzip } from "zlib";

import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";
import { Authentication as AuthenticationService } from "../Service/Authentication.js";

import { User } from "../DataModel/User.js";

class AccountController extends Controller
{
	constructor()
	{
        super();
	}

	async accountAction(request, response)
	{
		const SESSION = SessionService.getSession(request, response);
		const IS_LOGGED = AuthenticationService.checkUser(SESSION, response);

		if (!IS_LOGGED)
		{
			return;
		}

		const USER_ID = SESSION.get("userId");
		const USER = await User.getById(USER_ID);

		const TEMPLATING = new Templating();
		let content = await TEMPLATING.render(`account.html`, {title: `Bonjour ${USER.firstname}`, user:USER});

        response.setHeader("Content-Type", "text/html");
        response.setHeader("Content-Encoding", "gzip");
        const encoder = createGzip();
        encoder.pipe(response);
        encoder.write(content);
        encoder.end();
    }
}

export { AccountController };
