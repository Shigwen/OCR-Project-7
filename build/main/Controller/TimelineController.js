import { createGzip } from "zlib";

import { Controller } from "../Model/Controller.js";
import { Templating } from "../Model/Templating.js";
import { Session as SessionService } from "../Service/Session.js";

import { Discussion } from "../DataModel/Discussion.js";
import { User } from "../DataModel/User.js";

class TimelineController extends Controller
{
	constructor()
	{
        super();
	}

	async timelineAction(request, response)
	{
		SessionService.getSession(request, response);
		const TEMPLATING = new Templating();

		// Limité à 50 (DiscussionController l.227)
		const DISCUSSIONS = await Discussion.getAll();

		let content = await TEMPLATING.render(`timeline.html`, {discussions: DISCUSSIONS});

        response.setHeader("Content-Type", "text/html");
        response.setHeader("Content-Encoding", "gzip");
        const encoder = createGzip();
        encoder.pipe(response);
        encoder.write(content);
        encoder.end();
    }
}

export { TimelineController };
