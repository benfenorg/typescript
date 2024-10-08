// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 *  ######################################
 *  ### DO NOT EDIT THIS FILE DIRECTLY ###
 *  ######################################
 *
 * This file is generated from:
 * /crates/bfc-open-rpc/spec/openrpc.json
 */

import type { GetAllCoinsParams } from '../../../client/index.js';
import type { UseSuiClientQueryOptions } from '../useSuiClientQuery.js';
import type { UseSuiClientInfiniteQueryOptions } from '../useSuiClientInfiniteQuery.js';
import { useSuiClientQuery } from '../useSuiClientQuery.js';
import { useSuiClientInfiniteQuery } from '../useSuiClientInfiniteQuery.js';

export function useAllCoins(
	params: GetAllCoinsParams,
	options?: UseSuiClientQueryOptions<'getAllCoins'>,
) {
	return useSuiClientQuery(
		{
			method: 'getAllCoins',
			params,
		},
		options,
	);
}

export function useAllCoinsInfinite(
	params: GetAllCoinsParams,
	options?: UseSuiClientInfiniteQueryOptions<'getAllCoins'>,
) {
	return useSuiClientInfiniteQuery(
		{
			method: 'getAllCoins',
			params,
		},
		options,
	);
}
