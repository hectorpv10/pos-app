const admin = require('./functions/node_modules/firebase-admin');
const algoliasearch = require('./functions/node_modules/algoliasearch');
const serviceAccount = require('./service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const algoliaClient = algoliasearch('J6YMDU7HO8', '73916a35ad6fdba8edeb44d022cb5426');
const clientsIndex = algoliaClient.initIndex('dev_clients');

async function indexClients() {
  try {
    const snapshot = await admin.firestore().collection('clients').get();
    const clients = [];

    snapshot.forEach(doc => {
      clients.push({
        objectID: doc.id,
        ...doc.data(),
      });
    });

    await clientsIndex.saveObjects(clients);
    console.log(`✓ Indexed ${clients.length} clients to Algolia`);
    process.exit(0);
  } catch (error) {
    console.error('Error indexing clients:', error);
    process.exit(1);
  }
}

indexClients();
