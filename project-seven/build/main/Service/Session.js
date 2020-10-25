import { randomBytes } from "crypto";

// On crée notre classe session , qui sera appelé sur différentes pages du site.
class Session
{
	static Instances = {};
	static getSession(request, response)
	{
		let token = null;
		let session = null;

		// token = request.getCookie("session_token");
		// Ou : récupérer le header contenant les infos du cookie (qui n'existe pas forcément encore)
		const COOKIE_HEADER = request.getHeader("Cookie");
		// S'il existe...
		if (COOKIE_HEADER)
		{	// On fait en sorte d'obtenir uniquement les randomBytes générés pour la session (session_token).
			// On va d'abord en faire un tableau avec split : "a=1; b=c" devient ["a=1", "b=c"]...
			const COOKIES = COOKIE_HEADER.split("; ").reduce(
				(accumulator, item) =>
				{
					// ...puis transformer le égal en deux points : ["a=1", "b=c"] devient {a: "1", b: "c"} dans un objet
					const PAIRS = item.split("=");
					// On fait en sorte que l'accumulateur ait pour propriété une clef PAIRS indice 0 et une value PAIRS indice 1
					accumulator[PAIRS[0]] = PAIRS[1];
					return accumulator;
				},
				// La fonction reduce a ici deux paramètres, la fonction callback, et la valeur de départ (ici un objet vide).
				{}
			);
			// Donc, toujours si notre cookie existe, on récupère le session_token du cookie et on en fait notre "token".
			token = COOKIES.session_token;
		}

		// Si le token n'existe pas, autrement dit, 
		// s'il est toujours à "null" comme définit au début car le "if" précédent ne lui a pas donné son session_token en valeur
		if (!token)
		{
			// et on va créer le session_token avec notre randomBytes.
			token = randomBytes(8).toString("hex");
			// On a notre nouveau token, on crée donc notre header cookie de session avec setHeader.
			response.setHeader("Set-Cookie", `session_token=${token}; Secure; HttpOnly; Path=/; SameSite=Lax`);
		}
		// Si le token existait bel et bien, 
		else
		{
			//On le stock dans la session
			session = this.Instances[token];
		}

		// S'il n'y a pas de session en cours (session toujours = null)
		if (!session)
		{	
			// On en crée une, avec la classe map pour avoir un crud déjà tout prêt
			session = new Map();
			//On stock les données de notre session dans notre objet statique
			this.Instances[token] = session;
		}

		// On retient l'heure à chaque fois qu'une action est effectuée dans la session en cours (ça va servir par la suite)
		session.lastUsed = Date.now();

		// On renvoie la session
		return session;
	}
}

setInterval(
	() =>
	{
		// On crée un seuil de durée d'1h pour notre session
		const THRESHOLD = Date.now() - 60 * 60 * 1000;
		// On récupère les noms de propriétés pour notre this.Instances, et pour chaque "token"...
		Object.getOwnPropertyNames(this.Instances).forEach(
			(token) =>
			{	// On vérifie si notre SESSION[token] a été stamp il y a moins d'une heure
				if (this.Instances[token].lastUsed < THRESHOLD)
				{
					delete this.Instances[token];
				}
			}
		);
	},
	// On vérifie toutes les 5 minutes si la session n'a pas dépassé le seuil d'1h
	5 * 60 * 1000
);

export { Session };
