// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { SignedTransaction, TransactionBlock } from '../../index.js';
import type { IdentifierString, WalletAccount } from '@wallet-standard/core';

/** The latest API version of the signTransactionBlock API. */
export type SuiSignTransactionBlockVersion = '1.0.0';

/**
 * A Wallet Standard feature for signing a transaction, and returning the
 * serialized transaction and transaction signature.
 */
export type SuiSignTransactionBlockFeature = {
	/** Namespace for the feature. */
	'bfc:signTransactionBlock': {
		/** Version of the feature API. */
		version: SuiSignTransactionBlockVersion;
		signTransactionBlock: SuiSignTransactionBlockMethod;
	};
};

export type SuiSignTransactionBlockMethod = (
	input: SuiSignTransactionBlockInput,
) => Promise<SuiSignTransactionBlockOutput>;

/** Input for signing transactions. */
export interface SuiSignTransactionBlockInput {
	transactionBlock: TransactionBlock;
	account: WalletAccount;
	chain: IdentifierString;
}

/** Output of signing transactions. */
export interface SuiSignTransactionBlockOutput extends SignedTransaction {}
