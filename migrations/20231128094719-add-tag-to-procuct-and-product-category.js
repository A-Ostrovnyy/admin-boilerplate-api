module.exports = {
  async up(db, client) {
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    const updateCollection = async collection => {
      try {
        await db
          .collection(collection)
          .updateMany({tagIds: {$exists: false}}, {$set: {tagIds: []}});
      } catch (err) {
        console.log(
          `Error during adding tagIds field to ${collection} models: ${err}`,
        );
      }
    };
    // ? rewrite using promise.allSettled
    await updateCollection('Product');
    await updateCollection('ProductCategory');
    client.close();
  },

  async down(db, client) {
    const restoreCollection = async collection => {
      try {
        await db.collection(collection).updateMany({}, {$unset: {tagIds: ''}});
      } catch (err) {
        console.log(
          `Error during adding tagIds field to ${collection} models: ${err}`,
        );
      }
    };
    // ? rewrite using promise.allSettled
    await restoreCollection('Product');
    await restoreCollection('ProductCategory');
    client.close();
  },
};
