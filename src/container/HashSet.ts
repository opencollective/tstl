//================================================================ 
/** @module std */
//================================================================
import { UniqueSet } from "../base/container/UniqueSet";
import { IHashSet } from "../base/container/IHashSet";
import { _Construct } from "../base/container/_IHashContainer";

import { SetElementList } from "../base/container/SetElementList";
import { _SetHashBuckets } from "../base/hash/_SetHashBuckets";

import { IForwardIterator } from "../iterator/IForwardIterator";
import { Pair } from "../utility/Pair";
import { Temporary } from "../base/Temporary";

/**
 * Unique-key Set based on Hash buckets.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class HashSet<Key>
    extends UniqueSet<Key, 
        HashSet<Key>,
        HashSet.Iterator<Key>,
        HashSet.ReverseIterator<Key>>
    implements IHashSet<Key, true, HashSet<Key>>
{
    /**
     * @hidden
     */
    public buckets_!: _SetHashBuckets<Key, true, HashSet<Key>>;

    /* =========================================================
        CONSTRUCTORS & SEMI-CONSTRUCTORS
            - CONSTRUCTORS
            - ASSIGN & CLEAR
    ============================================================
        CONSTURCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     * 
     * @param hash An unary function returns hash code. Default is {hash}.
     * @param equal A binary function predicates two arguments are equal. Default is {@link equal_to}.
     */
    public constructor(hash?: (key: Key) => number, equal?: (x: Key, y: Key) => boolean);

    /**
     * Initializer Constructor.
     * 
     * @param items Items to assign.
     * @param hash An unary function returns hash code. Default is {hash}.
     * @param equal A binary function predicates two arguments are equal. Default is {@link equal_to}.
     */
    public constructor(items: Key[], hash?: (key: Key) => number, equal?: (x: Key, y: Key) => boolean);

    /**
     * Copy Constructor.
     * 
     * @param obj Object to copy. 
     */
    public constructor(obj: HashSet<Key>);

    /**
     * Range Constructor.
     * 
     * @param first Input iterator of the first position.
     * @param last Input iterator of the last position.
     * @param hash An unary function returns hash code. Default is {hash}.
     * @param equal A binary function predicates two arguments are equal. Default is {@link equal_to}.
     */
    public constructor
    (
        first: Readonly<IForwardIterator<Key>>, 
        last: Readonly<IForwardIterator<Key>>, 
        hash?: (key: Key) => number, equal?: (x: Key, y: Key) => boolean
    );

    public constructor(...args: any[])
    {
        super(thisArg => new SetElementList(<Temporary>thisArg) as Temporary);

        _Construct<Key, Key, 
                HashSet<Key>,
                HashSet.Iterator<Key>,
                HashSet.ReverseIterator<Key>,
                Key>
        (
            this, HashSet, 
            (hash, pred) =>
            {
                this.buckets_ = new _SetHashBuckets(this, hash, pred);
            },
            ...args
        );
    }

    /* ---------------------------------------------------------
        ASSIGN & CLEAR
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public clear(): void
    {
        this.buckets_.clear();

        super.clear();
    }

    /**
     * @inheritDoc
     */
    public swap(obj: HashSet<Key>): void
    {
        // SWAP CONTENTS
        [this.data_, obj.data_] = [obj.data_, this.data_];
        SetElementList._Swap_associative(this.data_ as Temporary, obj.data_ as Temporary);

        // SWAP BUCKETS
        _SetHashBuckets._Swap_source(this.buckets_, obj.buckets_);
        [this.buckets_, obj.buckets_] = [obj.buckets_, this.buckets_];
    }

    /**
     * @hidden
     */
    protected _Get_iterator_type(): typeof SetElementList.Iterator
    {
        return SetElementList.Iterator;
    }

    /* =========================================================
        ACCESSORS
            - MEMBER
            - HASH
    ============================================================
        MEMBER
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public find(key: Key): HashSet.Iterator<Key>
    {
        return this.buckets_.find(key);
    }

    /**
     * @inheritDoc
     */
    public begin(): HashSet.Iterator<Key>;
    /**
     * @inheritDoc
     */
    public begin(index: number): HashSet.Iterator<Key>;
    public begin(index: number | null = null): HashSet.Iterator<Key>
    {
        if (index === null)
            return super.begin();
        else
            return this.buckets_.at(index)[0];
    }

    /**
     * @inheritDoc
     */
    public end(): HashSet.Iterator<Key>;
    /**
     * @inheritDoc
     */
    public end(index: number): HashSet.Iterator<Key>
    public end(index: number | null = null): HashSet.Iterator<Key>
    {
        if (index === null)
            return super.end();
        else
        {
            let bucket = this.buckets_.at(index);
            return bucket[bucket.length - 1].next();
        }
    }

    /**
     * @inheritDoc
     */
    public rbegin(): HashSet.ReverseIterator<Key>;
    /**
     * @inheritDoc
     */
    public rbegin(index: number): HashSet.ReverseIterator<Key>;
    public rbegin(index: number | null = null): HashSet.ReverseIterator<Key>
    {
        return this.end(index!).reverse();
    }

    /**
     * @inheritDoc
     */
    public rend(): HashSet.ReverseIterator<Key>;
    /**
     * @inheritDoc
     */
    public rend(index: number): HashSet.ReverseIterator<Key>;
    public rend(index: number | null = null): HashSet.ReverseIterator<Key>
    {
        return this.begin(index!).reverse();
    }

    /* ---------------------------------------------------------
        HASH
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public bucket_count(): number
    {
        return this.buckets_.size();
    }

    /**
     * @inheritDoc
     */
    public bucket_size(n: number): number
    {
        return this.buckets_.at(n).length;
    }

    /**
     * @inheritDoc
     */
    public load_factor(): number
    {
        return this.buckets_.load_factor();
    }

    /**
     * @inheritDoc
     */
    public hash_function(): (key: Key) => number
    {
        return this.buckets_.hash_function();
    }

    /**
     * @inheritDoc
     */
    public key_eq(): (x: Key, y: Key) => boolean
    {
        return this.buckets_.key_eq();
    }

    /**
     * @inheritDoc
     */
    public bucket(key: Key): number
    {
        return this.hash_function()(key) % this.buckets_.size();
    }

    /**
     * @inheritDoc
     */
    public max_load_factor(): number;
    /**
     * @inheritDoc
     */
    public max_load_factor(z: number): void;
    public max_load_factor(z: number | null = null): any
    {
        return this.buckets_.max_load_factor(z!);
    }

    /**
     * @inheritDoc
     */
    public reserve(n: number): void
    {
        this.buckets_.rehash(Math.ceil(n * this.max_load_factor()));
    }

    /**
     * @inheritDoc
     */
    public rehash(n: number): void
    {
        if (n <= this.bucket_count())
            return;

        this.buckets_.rehash(n);
    }
    
    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - POST-PROCESS
            - SWAP
    ============================================================
        INSERT
    --------------------------------------------------------- */
    /**
     * @hidden
     */
    protected _Insert_by_key(key: Key): Pair<HashSet.Iterator<Key>, boolean>
    {
        // TEST WHETHER EXIST
        let it: HashSet.Iterator<Key> = this.find(key);
        if (it.equals(this.end()) === false)
            return new Pair(it, false);

        // INSERT
        this.data_.push(key);
        it = it.prev();

        // POST-PROCESS
        this._Handle_insert(it, it.next());

        return new Pair(it, true);
    }

    /**
     * @hidden
     */
    protected _Insert_by_hint(hint: HashSet.Iterator<Key>, key: Key): HashSet.Iterator<Key>
    {
        // FIND DUPLICATED KEY
        let it: HashSet.Iterator<Key> = this.find(key);
        if (it.equals(this.end()) === true)
        {
            // INSERT
            it = this.data_.insert(hint, key);

            // POST-PROCESS
            this._Handle_insert(it, it.next());
        }
        return it;
    }

    /**
     * @hidden
     */
    protected _Insert_by_range<InputIterator extends Readonly<IForwardIterator<Key, InputIterator>>>
        (first: InputIterator, last: InputIterator): void
    {
        //--------
        // INSERTIONS
        //--------
        // PRELIMINARY
        let my_first: HashSet.Iterator<Key> = this.end().prev();

        // INSERT ELEMENTS
        for (; !first.equals(last); first = first.next())
        {
            // TEST WHETER EXIST
            if (this.has(first.value))
                continue;
            
            // INSERTS
            this.data_.push(first.value);
        }
        my_first = my_first.next();
        
        //--------
        // HASHING INSERTED ITEMS
        //--------
        // IF NEEDED, HASH_BUCKET TO HAVE SUITABLE SIZE
        if (this.size() > this.buckets_.capacity())
            this.reserve(Math.max(this.size(), this.buckets_.capacity() * 2));

        // POST-PROCESS
        this._Handle_insert(my_first, this.end());
    }

    /* ---------------------------------------------------------
        POST-PROCESS
    --------------------------------------------------------- */
    /**
     * @hidden
     */
    protected _Handle_insert(first: HashSet.Iterator<Key>, last: HashSet.Iterator<Key>): void
    {
        for (; !first.equals(last); first = first.next())
            this.buckets_.insert(first);
    }

    /**
     * @hidden
     */
    protected _Handle_erase(first: HashSet.Iterator<Key>, last: HashSet.Iterator<Key>): void
    {
        for (; !first.equals(last); first = first.next())
            this.buckets_.erase(first);
    }
}

export namespace HashSet
{
    //----
    // PASCAL NOTATION
    //----
    // HEAD
    export type Iterator<Key> = SetElementList.Iterator<Key, true, HashSet<Key>>;
    export type ReverseIterator<Key> = SetElementList.ReverseIterator<Key, true, HashSet<Key>>;

    // BODY
    export const Iterator = SetElementList.Iterator;
    export const ReverseIterator = SetElementList.ReverseIterator;

    //----
    // SNAKE NOTATION
    //----
    // HEAD
    export type iterator<Key> = Iterator<Key>;
    export type reverse_iterator<Key> = ReverseIterator<Key>;

    // BODY
    export const iterator = Iterator;
    export const reverse_iterator = ReverseIterator;
}
export import unordered_set = HashSet;