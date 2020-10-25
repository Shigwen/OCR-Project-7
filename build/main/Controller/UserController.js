import { createGzip } from "zlib";

import { Request } from "../Model/Request.js";
import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";

import { User } from "../DataModel/User.js";

class UserController extends Controller
{
	constructor()
	{
		super();
	}

	async signupAction(request, response)
	{
		try
		{
			const POST = request.getRequest();
			SessionService.getSession(request, response);
			const USER = new User();

			USER.setPassword(POST.password);
			USER.setEmail(POST.email);
			USER.setFirstname(POST.firstname);
			USER.setLastname(POST.lastname);
			USER.setJob(POST.job);
			USER.setAdmin(false);
			await USER.save();

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
			response.statusCode = 500;
			response.end();
		}
	}

	async loginAction(request, response)
	{
		try
		{
			const POST = request.getRequest();
			const SESSION = SessionService.getSession(request, response);

			const USER = await User.getByEmail(POST.email);

			if (!USER || !USER.isPasswordValid(POST.password))
			{
				response.statusCode = 403;
				response.end();
				return;
			}

			// Ne pas oublier de rentrer la valeur de notre user ID dans la session pour s'en resservir un peu partout
			SESSION.set("userId", USER.getId());

			// On ne renvoie pas de json vu que la requête front vient directement du formulaire et qu'on change de page
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
			response.statusCode = 500;
			response.end();
		}
	}

	async logoutAction(request, response)
	{
		try
		{
			const SESSION = SessionService.getSession(request, response);
			SESSION.delete("userId");

			response.statusCode = 307;
			response.setHeader("Location", "/");
			response.setHeader("Content-Encoding", "gzip");
			const encoder = createGzip();
			encoder.pipe(response);
			encoder.end();
		}
		catch (error)
		{
			console.log(error);
			response.statusCode = 500;
			response.end();
		}
	}
}

export { UserController };
