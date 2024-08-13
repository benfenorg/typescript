// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { styled } from './stitches.js';
import { Title } from './utils/Dialog.js';
import { BenFenLogoLight } from './utils/icons.js';
import { Truncate, Panel } from './utils/ui.js';
import { useWalletKit } from './WalletKitContext.js';

const Container = styled(Panel, {
	background: '$background',
	height: '100%',

	'@md': {
		background: '$backgroundAccent',
	},
});

const ListContainer = styled('div', {
	marginTop: '$6',
	display: 'flex',
	flexDirection: 'column',
	gap: '$1',
});

const WalletItem = styled('button', {
	background: 'none',
	display: 'flex',
	padding: '$2',
	gap: '$2',
	alignItems: 'center',
	cursor: 'pointer',
	color: '$textDark',
	border: 'none',
	fontWeight: '$button',
	fontSize: '$md',
	borderRadius: '$wallet',

	variants: {
		selected: {
			true: {
				background: '$background',
				boxShadow: '$wallet',
			},
		},
	},
});

const WalletIcon = styled('img', {
	flexShrink: 0,
	background: 'white',
	width: 28,
	height: 28,
	borderRadius: 6,
	objectFit: 'cover',
});

interface Props {
	selected: string | null;
	onChange(selected: string): void;
	connectWallet?: string;
}

export const SELECTED_GETTING_STARTED = '@@internal/getting-started';

export function WalletList({ selected, onChange, connectWallet }: Props) {
	const { wallets } = useWalletKit();

	return (
		<Container>
			<Title>{connectWallet || 'Connect a Wallet'}</Title>

			<ListContainer>
				{wallets.length === 0 ? (
					<WalletItem
						onClick={() => onChange(SELECTED_GETTING_STARTED)}
						selected={{ '@initial': false, '@md': true }}
					>
						<BenFenLogoLight className="w-7 h-7" />
						<Truncate>OpenBlock Wallet</Truncate>
					</WalletItem>
				) : (
					wallets.map((wallet) => (
						<WalletItem
							key={wallet.name}
							selected={wallet.name === selected}
							onClick={() => {
								onChange(wallet.name);
							}}
						>
							<WalletIcon src={wallet.icon} />
							<Truncate>{wallet.name}</Truncate>
						</WalletItem>
					))
				)}
			</ListContainer>
		</Container>
	);
}
