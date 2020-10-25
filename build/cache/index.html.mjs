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

<!-- <script defer src="/scripts/signup.js"></script>
<script defer src="/scripts/login.js"></script>
 -->

<main>

	<h1>${this.parameters.title}</h1>

	<form method="POST" action="/login" name="login">

		<label>
			Adresse Email :
			<input type="email" name="email" required value="michael.donati@hotmail.com" />
		</label>

		<label>
			Mot de passe :
			<input type="password" name="password" required />
		</label>

		<button type="submit" class="btn">Connectez-vous</button>

	</form>

	<h2>Vous n'avez pas encore de compte ? Créez-en un en remplissant le formulaire ci-dessous :</h2>


	<form method="POST" action="/signup" name="signup">

		<label>
			Adresse Email :
			<input type="email" name="email" required value="michael.donati@hotmail.com" />
		</label>

		<label>
			Mot de passe :
			<input type="password" name="password" required />
		</label>

		<label>
			Prénom :
			<input type="text" name="firstname" required value="Michael" />
		</label>

		<label>
			Nom :
			<input type="text" name="lastname" required value="Donati" />
		</label>

		<label>
			Poste dans l'entreprise :
			<input type="text" name="job" required value="Expert Comptable" />
		</label>

		<button type="submit" class="btn">Créez votre compte</button>

	</form>

</main>

`;
        return this.content;
    }
}
export { View };