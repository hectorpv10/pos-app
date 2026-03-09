import { Configure, InstantSearch } from 'react-instantsearch-hooks';

import { ReactNode } from 'react';
import searchClient from 'algolia/searchClient';

type Props = { children: ReactNode };
export default function ClientsInstantSearch({ children }: Props) {
	return (
		<InstantSearch searchClient={searchClient} indexName='dev_clients'>
			<Configure filters='' />
			{children}
		</InstantSearch>
	);
}
