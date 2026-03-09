import algoliasearch from 'algoliasearch';

// For development, use dev_ prefixed indices
export const algoliaIndices = {
  products: 'dev_products',
  clients: 'dev_clients',
};

export default algoliasearch('J6YMDU7HO8', 'b7e7f2238acfbe7ad0956608a0c0209a');
