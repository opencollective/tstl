//================================================================ 
/** @module std.base */
//================================================================
import { _MapTree } from "./_MapTree";
import { _XTreeNode } from "./_XTreeNode";

import { UniqueMap } from "../container/UniqueMap";
import { MapElementList } from "../container/MapElementList";

/**
 * @hidden
 */
export class _UniqueMapTree<Key, T, 
        Source extends UniqueMap<Key, T, 
            Source,
            MapElementList.Iterator<Key, T, true, Source>,
            MapElementList.ReverseIterator<Key, T, true, Source>>>
    extends _MapTree<Key, T, true, Source>
{
    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    public constructor(source: Source, comp: (x: Key, y: Key) => boolean)
    {
        super(source, comp,
            function (x: MapElementList.Iterator<Key, T, true, Source>, y: MapElementList.Iterator<Key, T, true, Source>): boolean
            {
                return comp(x.first, y.first);
            }
        );
    }

    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    public nearest_by_key(key: Key): _XTreeNode<MapElementList.Iterator<Key, T, true, Source>> | null
    {
        // NEED NOT TO ITERATE
        if (this.root_ === null)
            return null;

        //----
        // ITERATE
        //----
        let ret: _XTreeNode<MapElementList.Iterator<Key, T, true, Source>> | null = this.root_;
        
        while (true) // UNTIL MEET THE MATCHED VALUE OR FINAL BRANCH
        {
            let it: MapElementList.Iterator<Key, T, true, Source> = ret.value;
            let my_node: _XTreeNode<MapElementList.Iterator<Key, T, true, Source>> | null = null;
            
            // COMPARE
            if (this.key_comp()(key, it.first))
                my_node = ret.left;
            else if (this.key_comp()(it.first, key))
                my_node = ret.right;
            else
                return ret; // MATCHED VALUE

            // FINAL BRANCH? OR KEEP GOING
            if (my_node === null)
                break;
            else
                ret = my_node;
        }
        return ret; // DIFFERENT NODE
    }

    public upper_bound(key: Key): MapElementList.Iterator<Key, T, true, Source>
    {
        // FIND MATCHED NODE
        let node: _XTreeNode<MapElementList.Iterator<Key, T, true, Source>> | null = this.nearest_by_key(key);
        if (node === null)
            return this.source().end();

        // MUST BE it.first > key
        let it: MapElementList.Iterator<Key, T, true, Source> = node.value;
        if (this.key_comp()(key, it.first))
            return it;
        else
            return it.next();
    }
}