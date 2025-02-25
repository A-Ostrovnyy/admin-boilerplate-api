import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Tag} from './tag.model';

@model({settings: {strict: false}})
export class ProductCategory extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectID'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => ProductCategory)
  categoryId: string;

  @property.array(String, {
    itemType: 'string',
    required: false,
    mongodb: {dataType: 'ObjectID'},
  })
  tagIds?: string[];

  @property.array(Tag, {
    itemType: Tag,
  })
  tags?: Tag[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductCategory>) {
    super(data);
  }
}

export interface ProductCategoryRelations {
  // describe navigational properties here
}

export type ProductCategoryWithRelations = ProductCategory &
  ProductCategoryRelations;
