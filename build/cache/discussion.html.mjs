import { View as AbstractView } from "/Development/OCR-Projet-7/OCR-Project-7/build/main/Model/View.js";
class View extends AbstractView
{
    constructor(parameters)
    {
        super(parameters);
        this.layout = 'layouts/default.html';
    }
    async render()
    {
        this.content = `

	<main>

		<menu-bloc>
			<a href="/account" class="btn">Mon Compte</a>
			<a href="/new-message/${this.parameters.id}" class="btn">Poster une réponse</a>
			<a href="/timeline" class="btn">Retour au fil d'actualité</a>
		</menu-bloc>


		<h1>${this.parameters.title}</h1>

		<ul>
			`;
for (let message of this.parameters.messages)
{
this.content += `

			<li>
				<p class="message_content">${message.getContent()}</p>

				`;
const USER = await message.getUser();
this.content += `
				<p>Posté par ${USER.getFirstname()} ${USER.getLastname()}, ${USER.getJob()}</p>
			</li>

			`;
}
this.content += `
		</ul>

	</main>
`;
        return this.content;
    }
}
export { View };