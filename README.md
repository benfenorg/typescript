# Docs site

For more complete docs, visit the [Sui Typescript SDK docs](https://bfc-typescript-docs.vercel.app/)

# Sui TypeScript SDK

This is the Sui TypeScript SDK built on the Sui
[JSON RPC API](https://github.com/MystenLabs/sui/blob/main/doc/src/build/json-rpc.md). It provides
utility classes and functions for applications to sign transactions and interact with the Sui
network.

WARNING: Note that we are still iterating on the RPC and SDK API before TestNet, therefore please
expect frequent breaking changes in the short-term. We expect the API to stabilize after the
upcoming TestNet launch.

## Working with DevNet

The SDK will be published to [npm registry](https://www.npmjs.com/package/@benfen/bfc.js) with the
same bi-weekly release cycle as the DevNet validators and
[RPC Server](https://github.com/MystenLabs/sui/blob/main/doc/src/build/json-rpc.md). To use the SDK
in your project, you can do:

```bash
$ npm install @benfen/bfc.js
```

You can also use your preferred npm client, such as yarn or pnpm.

## Working with local network

Note that the `latest` tag for the [published SDK](https://www.npmjs.com/package/@benfen/bfc.js)
might go out of sync with the RPC server on the `main` branch until the next release. If you're
developing against a local network, we recommend using the `experimental`-tagged packages, which
contain the latest changes from `main`.

```bash
npm install @benfen/bfc.js@experimental
```

Refer to the [JSON RPC](https://github.com/MystenLabs/sui/blob/main/doc/src/build/json-rpc.md) topic
for instructions about how to start a local network and local RPC server.

## Building Locally

To get started you need to install [pnpm](https://pnpm.io/), then run the following command:

```bash
# Install all dependencies
$ pnpm install
# Run the build for the TypeScript SDK
$ pnpm sdk build
```

> All `pnpm` commands are intended to be run in the root of the Sui repo. You can also run them
> within the `sdk/typescript` directory, and remove change `pnpm sdk` to just `pnpm` when running
> commands.

## Type Doc

You can view the generated [Type Doc](https://typedoc.org/) for the
[current release of the SDK](https://www.npmjs.com/package/@benfen/bfc.js) at
http://typescript-sdk-docs.s3-website-us-east-1.amazonaws.com/.

For the latest docs for the `main` branch, run `pnpm doc` and open the
[doc/index.html](doc/index.html) in your browser.

## Testing

To run unit tests

```
pnpm sdk test:unit
```

To run E2E tests against local network

```
pnpm sdk prepare:e2e

// This will run all e2e tests
pnpm sdk test:e2e

// Alternatively you can choose to run only one test file
npx vitest txn-builder.test.ts
```

Troubleshooting:

If you see errors like `ECONNRESET or "socket hang up"`, run `node -v` to make sure your node
version is `v18.x.x`. Refer to this
[guide](https://blog.logrocket.com/how-switch-node-js-versions-nvm/) to switch node version.

Some more follow up here is if you used homebrew to install node, there could be multiple paths to
node on your machine.
https://stackoverflow.com/questions/52676244/node-version-not-updating-after-nvm-use-on-mac

To run E2E tests against DevNet

```
VITE_FAUCET_URL='https://faucet.devnet.sui.io:443/gas' VITE_FULLNODE_URL='https://fullnode.devnet.sui.io' pnpm sdk exec vitest e2e
```

## Connecting to Sui Network

The `SuiClient` class provides a connection to the JSON-RPC Server and should be used for all
read-only operations. The default URLs to connect with the RPC server are:

- local: http://127.0.0.1:9000
- DevNet: https://fullnode.devnet.sui.io

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

// create a client connected to devnet
const client = new SuiClient({ url: getFullnodeUrl('devnet') });

// get coins owned by an address
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

For local development, you can run `cargo run --bin bfc-test-validator` to spin up a local network
with a local validator, a fullnode, and a faucet server. Refer to
[this guide](https://docs.sui.io/build/sui-local-network) for more information.

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

// create a client connected to devnet
const client = new SuiClient({ url: getFullnodeUrl('localnet') });

// get coins owned by an address
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

You can also construct your own in custom connections, with the URL for your own fullnode

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

// create a client connected to devnet
const client = new SuiClient({
	url: 'https://fullnode.devnet.sui.io',
});

// get coins owned by an address
await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

## Getting coins from the faucet

You can request sui from the faucet when running against devnet, testnet, or localnet

```typescript
import { requestSuiFromFaucetV0, getFaucetHost } from '@benfen/bfc.js/faucet';

await requestSuiFromFaucetV0({
	host: getFaucetHost('testnet'),
	recipient: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

## Writing APIs

For a primer for building transactions, refer to
[this guide](https://docs.sui.io/build/prog-trans-ts-sdk).

### Transfer Object

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
import { Ed25519Keypair } from '@benfen/bfc.js/keypairs/ed25519';
import { TransactionBlock } from '@benfen/bfc.js/transactions';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});

const tx = new TransactionBlock();
tx.transferObjects(
	[tx.object('0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2')],
	tx.pure('0x1d20dcdb2bca4f508ea9613994683eb4e76e9c4ed371169677c1be02aaf0b12a'),
);
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});
console.log({ result });
```

### Transfer Sui

To transfer `1000` MIST to another address:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
import { Ed25519Keypair } from '@benfen/bfc.js/keypairs/ed25519';
import { TransactionBlock } from '@benfen/bfc.js/transactions';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});

const tx = new TransactionBlock();
const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
tx.transferObjects([coin], tx.pure(keypair.getPublicKey().toSuiAddress()));
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});
console.log({ result });
```

### Merge coins

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
import { Ed25519Keypair } from '@benfen/bfc.js/keypairs/ed25519';
import { TransactionBlock } from '@benfen/bfc.js/transactions';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});

const tx = new TransactionBlock();
tx.mergeCoins(tx.object('0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2'), [
	tx.object('0x127a8975134a4824d9288722c4ee4fc824cd22502ab4ad9f6617f3ba19229c1b'),
]);
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});
console.log({ result });
```

### Move Call

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
import { Ed25519Keypair } from '@benfen/bfc.js/keypairs/ed25519';
import { TransactionBlock } from '@benfen/bfc.js/transactions';
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const packageObjectId = '0x...';
const tx = new TransactionBlock();
tx.moveCall({
	target: `${packageObjectId}::nft::mint`,
	arguments: [tx.pure('Example NFT')],
});
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});
console.log({ result });
```

### Publish Modules

To publish a package:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
import { Ed25519Keypair } from '@benfen/bfc.js/keypairs/ed25519';
import { TransactionBlock } from '@benfen/bfc.js/transactions';
const { execSync } = require('child_process');
// Generate a new Ed25519 Keypair
const keypair = new Ed25519Keypair();
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const { modules, dependencies } = JSON.parse(
	execSync(`${cliPath} move build --dump-bytecode-as-base64 --path ${packagePath}`, {
		encoding: 'utf-8',
	}),
);
const tx = new TransactionBlock();
const [upgradeCap] = tx.publish({
	modules,
	dependencies,
});
tx.transferObjects([upgradeCap], tx.pure(await client.getAddress()));
const result = await client.signAndExecuteTransactionBlock({
	signer: keypair,
	transactionBlock: tx,
});
console.log({ result });
```

## Reading APIs

### Get Owned Objects

Fetch objects owned by the address
`0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231`

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const objects = await client.getOwnedObjects({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

### Get Object

Fetch object details for the object with id
`0xe19739da1a701eadc21683c5b127e62b553e833e8a15a4f292f4f48b4afea3f2`

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';
const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const txn = await client.getObject({
	id: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	// fetch the object content field
	options: { showContent: true },
});
// You can also fetch multiple objects in one batch request
const txns = await client.multiGetObjects({
	ids: [
		'0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
		'0x9ad3de788483877fe348aef7f6ba3e52b9cfee5f52de0694d36b16a6b50c1429',
	],
	// only fetch the object type
	options: { showType: true },
});
```

### Get Transaction

Fetch transaction details from transaction digests:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const txn = await client.getTransactionBlock({
	digest: '9XFneskU8tW7UxQf7tE5qFRfcN4FadtC2Z3HAZkgeETd=',
	// only fetch the effects field
	options: {
		showEffects: true,
		showInput: false,
		showEvents: false,
		showObjectChanges: false,
		showBalanceChanges: false,
	},
});

// You can also fetch multiple transactions in one batch request
const txns = await client.multiGetTransactionBlocks({
	digests: [
		'9XFneskU8tW7UxQf7tE5qFRfcN4FadtC2Z3HAZkgeETd=',
		'17mn5W1CczLwitHCO9OIUbqirNrQ0cuKdyxaNe16SAME=',
	],
	// fetch both the input transaction data as well as effects
	options: { showInput: true, showEffects: true },
});
```

### Get Checkpoints

Get latest 100 Checkpoints in descending order and print Transaction Digests for each one of them.

```typescript
client.getCheckpoints({ descendingOrder: true }).then(function (checkpointPage: CheckpointPage) {
	console.log(checkpointPage);

	checkpointPage.data.forEach((checkpoint) => {
		console.log('---------------------------------------------------------------');
		console.log(
			' -----------   Transactions for Checkpoint:  ',
			checkpoint.sequenceNumber,
			' -------- ',
		);
		console.log('---------------------------------------------------------------');
		checkpoint.transactions.forEach((tx) => {
			console.log(tx);
		});
		console.log('***************************************************************');
	});
});
```

Get Checkpoint 1994010 and print details.

```typescript
client.getCheckpoint({ id: '1994010' }).then(function (checkpoint: Checkpoint) {
	console.log('Checkpoint Sequence Num ', checkpoint.sequenceNumber);
	console.log('Checkpoint timestampMs ', checkpoint.timestampMs);
	console.log('Checkpoint # of Transactions ', checkpoint.transactions.length);
});
```

### Get Coins

Fetch coins of type `0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC`
owned by an address:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const coins = await client.getCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	coinType: '0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC',
});
```

Fetch all coin objects owned by an address:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const allCoins = await client.getAllCoins({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
});
```

Fetch the total coin balance for one coin type, owned by an address:

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
// If coin type is not specified, it defaults to 0x2::sui::SUI
const coinBalance = await client.getBalance({
	owner: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	coinType: '0x65b0553a591d7b13376e03a408e112c706dc0909a79080c810b93b06f922c458::usdc::USDC',
});
```

### Events API

Querying events created by transactions sent by account
`0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231`

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const events = client.queryEvents({
	query: { Sender: toolbox.address() },
	limit: 2,
});
```

Subscribe to all events created by transactions sent by account
`0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231`

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
// calls RPC method 'bfcx_subscribeEvent' with params:
// [ { Sender: '0xbff6ccc8707aa517b4f1b95750a2a8c666012df3' } ]
const unsubscribe = await client.subscribeEvent({
	filter: {
		Sender: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231',
	},
	onMessage(event) {
		// handle subscription notification message here. This function is called once per subscription message.
	},
});

// later, to unsubscribe:
await unsubscribe();
```

Subscribe to all events created by a package's `nft` module

```typescript
import { SuiClient, getFullnodeUrl } from '@benfen/bfc.js/client';

const client = new SuiClient({
	url: getFullnodeUrl('testnet'),
});
const somePackage = '0x...';
const devnetNftFilter = {
	MoveModule: { package: somePackage, module: 'nft' },
};
const devNftSub = await client.subscribeEvent({
	filter: devnetNftFilter,
	onMessage(event) {
		// handle subscription notification message here
	},
});
```
