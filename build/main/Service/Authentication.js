
class Authentication
{
	static checkUser(session, response)
	{
		if (session.has("userId"))
		{
			return true;
		}
		else
		{
			response.statusCode = 307;
			response.setHeader("Location", "/");
			response.end();
			return false;
		}
	}
}

export { Authentication };
