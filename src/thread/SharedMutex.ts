//================================================================ 
/** @module std */
//================================================================
import { ILockable } from "./ILockable";
import { _ISharedLockable } from "../base/thread/_ISharedLockable";

import { SharedTimedMutex } from "./SharedTimedMutex";

/**
 * Shared mutex.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class SharedMutex implements ILockable, _ISharedLockable
{
	/**
     * @hidden
     */
    private mutex_: SharedTimedMutex;

    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    public constructor()
    {
        this.mutex_ = new SharedTimedMutex();
    }

	/* ---------------------------------------------------------
		WRITE LOCK
	--------------------------------------------------------- */
	/**
     * @inheritDoc
     */
    public lock(): Promise<void>
    {
        return this.mutex_.lock();
    }

    /**
     * @inheritDoc
     */
    public try_lock(): Promise<boolean>
    {
        return this.mutex_.try_lock();
    }

    /**
     * @inheritDoc
     */
    public unlock(): Promise<void>
    {
        return this.mutex_.unlock();
    }

	/* ---------------------------------------------------------
		READ LOCK
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public lock_shared(): Promise<void>
	{
		return this.mutex_.lock_shared();
	}

	/**
	 * @inheritDoc
	 */
	public try_lock_shared(): Promise<boolean>
	{
		return this.mutex_.try_lock_shared();
	}

	/**
	 * @inheritDoc
	 */
	public unlock_shared(): Promise<void>
	{
		return this.mutex_.unlock_shared();
	}
}

export type shared_mutex = SharedMutex;
export const shared_mutex = SharedMutex;