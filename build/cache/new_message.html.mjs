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

	<form method="POST" action="/post-message/${this.parameters.id}" name="postMessage">

		<label>
			<h1>Rédigez votre réponse (maximum 2000 caractères)</h1>
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