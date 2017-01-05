/// <reference path="../../API.ts" />

/// <reference path="_HashBuckets.ts" />

namespace std.base
{
	/**
	 * @hidden
	 */
	export class SetHashBuckets<T>
		extends _HashBuckets<SetIterator<T>>
	{
		private set_: IHashSet<T>;
		
        public constructor(set: IHashSet<T>)
		{
			super();

			this.set_ = set;
		}

		public find(val: T): SetIterator<T>
		{
			let index = std.hash(val) % this.size();
			let bucket = this.at(index);

			for (let i: number = 0; i < bucket.size(); i++)
				if (std.equal_to(bucket.at(i).value, val))
					return bucket.at(i);

			return this.set_.end();
		}
	}
}