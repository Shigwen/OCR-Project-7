class WeakRefMap
{
	constructor()
	{
		this.references = {};
	}

	set(key, object)
	{
		this.references[key] = new WeakRef(object);
	}

	get(key)
	{
		if (!this.references[key])
		{
			return null;
		}

		this.references[key].deref();
	}
}

export { WeakRefMap };
