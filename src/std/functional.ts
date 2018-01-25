﻿/// <reference path="API.ts" />

/// <reference path="functional/bit_operations.ts" />
/// <reference path="functional/comparisons.ts" />
/// <reference path="functional/hash.ts" />


// Standard Template Library: Function objects
// Function objects are objects specifically designed to be used with a syntax similar to that of functions.
//
// They are typically used as arguments to functions, such as predicates or comparison functions passed to standard algorithms.
//
// @reference http://www.cplusplus.com/reference/functional/
// @author Jeongho Nam <http://samchon.org>

namespace std
{
	/* ---------------------------------------------------------
		SWAP
	--------------------------------------------------------- */
	export function swap<T extends ISwappable<T>>(x: T, y: T)
	{
		x.swap(y);
	}
}
