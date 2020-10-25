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
		<a href="/new-discussion" class="btn newDiscussion_btn">Nouvelle discussion</a>

		<h1>Fil d'actualité</h1>

		<!-- Will have max 90 characters -->
		`;
for (let discussion of this.parameters.discussions)
{
this.content += `

		<a href="/discussion/${discussion.getId()}" class="news_titles">${discussion.getTitle()}</a>
		`;
}
this.content += `

	</main>
`;
        return this.content;
    }
}
export { View };