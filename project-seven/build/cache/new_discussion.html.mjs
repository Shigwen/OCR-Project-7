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
<!-- <script defer src="/scripts/postDiscussion.js"></script> -->
<main>
	<form method="POST" action="/post-discussion" name="postDiscussion">
		<label>
			<h1>Choisissez un titre (maximum 90 caractères)</h1>
			<input type="text" name="title" required maxlength="90" />
		</label>
		<label>
			<h1>Rédigez votre article (maximum 2000 caractères)</h1>
			<textarea name="content" required maxlength="2000" spellcheck="true"></textarea>
		</label>
		<button type="submit" class="btn"> Postez votre message </button>
	</form>
</main>
`;
        return this.content;
    }
}
export { View };