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
			<a href="/account" class="btn account_btn">Mon Compte</a>
			<a href="/new-discussion" class="btn left_btn">Nouvelle discussion</a>
		</menu-bloc>

		<h1>Fil d'actualité</h1>

		<ul>
			`;
for (let discussion of this.parameters.discussions)
{
this.content += `

			<li>
				<a href="/discussion/${discussion.getId()}" class="news_titles">${discussion.getTitle()}</a>

				`;
const USER = await discussion.getUser();
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