import { createGzip } from "zlib";

import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";

class AccountController extends Controller
{
	constructor()
	{
        super();
	}

	async indexAction(request, response)
	{
		SessionService.getSession(request, response);
        const TEMPLATING = new Templating();
		let content = await TEMPLATING.render(`account.html`, {title: "Bienvenue sur le réseau social du groupe Groupomania"});

        response.setHeader("Content-Type", "text/html");
        response.setHeader("Content-Encoding", "gzip");
        const encoder = createGzip();
        encoder.pipe(response);
        encoder.write(content);
        encoder.end();
    }
}

export { AccountController };
