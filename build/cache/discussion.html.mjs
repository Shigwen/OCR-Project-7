import { View as AbstractView } from "/Development/OCR-Projet-7/project-seven/build/main/Model/View.js";
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

		<a href="/account" class="btn account_btn">Mon Compte</a>
		<a href="/timeline" class="btn newDiscussion_btn">Retour au fil d'actualité</a>

		`;
for (let message of this.parameters.messages)
{
this.content += `

		<p class="news_titles">${message.getContent()}</p>
		`;
}
this.content += `

	</main>
`;
        return this.content;
    }
}
export { View };