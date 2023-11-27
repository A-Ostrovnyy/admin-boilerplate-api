module.exports = {
  async up(db, client) {
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    try {
      await db
        .collection('Product')
        .updateMany({isHidden: {$exists: false}}, {$set: {isHidden: false}});
    } catch (err) {
      console.log('Error during adding hidden field to product model');
    } finally {
      client.close();
    }
  },

  async down(db, client) {
    try {
      await db
        .collection('Product')
        .updateMany({isHidden: {$exists: true}}, {$unset: {isHidden: ''}});
    } catch (err) {
      console.log('Error during adding hidden field to product model');
    } finally {
      client.close();
    }
  },
};
