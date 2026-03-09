const admin = require('./functions/node_modules/firebase-admin');
const algoliasearch = require('./functions/node_modules/algoliasearch');
const serviceAccount = require('./service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const algoliaClient = algoliasearch('J6YMDU7HO8', '73916a35ad6fdba8edeb44d022cb5426');
const productsIndex = algoliaClient.initIndex('dev_products');

async function indexProducts() {
  try {
    const snapshot = await admin.firestore().collection('products').get();
    const products = [];

    snapshot.forEach(doc => {
      products.push({
        objectID: doc.id,
        ...doc.data(),
      });
    });

    await productsIndex.saveObjects(products);
    console.log(`✓ Indexed ${products.length} products to Algolia`);
    process.exit(0);
  } catch (error) {
    console.error('Error indexing products:', error);
    process.exit(1);
  }
}

indexProducts();
