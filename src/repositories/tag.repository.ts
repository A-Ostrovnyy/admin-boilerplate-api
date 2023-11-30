import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Tag, TagRelations} from '../models/tag.model';

export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype.id,
  TagRelations
> {
  constructor(@inject('datasources.mongo') dataSource: MongoDataSource) {
    super(Tag, dataSource);
  }
}
