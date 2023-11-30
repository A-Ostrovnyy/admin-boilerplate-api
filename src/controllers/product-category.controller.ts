import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ProductCategory} from '../models';
import {ProductCategoryRepository, TagRepository} from '../repositories';

export class ProductCategoryController {
  constructor(
    @repository(ProductCategoryRepository)
    public productCategoryRepository: ProductCategoryRepository,
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) {}

  @post('/product-categories')
  @response(200, {
    description: 'ProductCategory model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProductCategory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductCategory, {
            title: 'NewProductCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    productCategory: Omit<ProductCategory, 'id'>,
  ): Promise<ProductCategory> {
    return this.productCategoryRepository.create(productCategory);
  }

  @get('/product-categories/count')
  @response(200, {
    description: 'ProductCategory model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProductCategory) where?: Where<ProductCategory>,
  ): Promise<Count> {
    return this.productCategoryRepository.count(where);
  }

  @get('/product-categories')
  @response(200, {
    description: 'Array of ProductCategory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProductCategory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProductCategory) filter?: Filter<ProductCategory>,
  ): Promise<ProductCategory[]> {
    // TODO: research how to use aggregate method
    const productCategories = await this.productCategoryRepository.find(filter);
    // TODO: consider to create util function
    await Promise.all(
      productCategories.map(async productCategory => {
        try {
          productCategory.tags = await this.tagRepository.find({
            where: {
              _id: {
                in: productCategory.tagIds,
              },
            },
          });
        } catch (err) {
          console.log(
            `Error during aggregating tags for product ${productCategory.id}`,
          );
        }
      }),
    );
    return productCategories;
  }

  @patch('/product-categories')
  @response(200, {
    description: 'ProductCategory PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductCategory, {partial: true}),
        },
      },
    })
    productCategory: ProductCategory,
    @param.where(ProductCategory) where?: Where<ProductCategory>,
  ): Promise<Count> {
    return this.productCategoryRepository.updateAll(productCategory, where);
  }

  @get('/product-categories/{id}')
  @response(200, {
    description: 'ProductCategory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProductCategory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ProductCategory, {exclude: 'where'})
    filter?: FilterExcludingWhere<ProductCategory>,
  ): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findById(
      id,
      filter,
    );

    try {
      productCategory.tags = await this.tagRepository.find({
        where: {
          _id: {
            in: productCategory.tagIds,
          },
        },
      });
    } catch (err) {
      console.log(
        `Error during aggregating tags for product ${productCategory.id}`,
      );
    }

    return productCategory;
  }

  @patch('/product-categories/{id}')
  @response(204, {
    description: 'ProductCategory PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductCategory, {partial: true}),
        },
      },
    })
    productCategory: ProductCategory,
  ): Promise<void> {
    await this.productCategoryRepository.updateById(id, productCategory);
  }

  @put('/product-categories/{id}')
  @response(204, {
    description: 'ProductCategory PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() productCategory: ProductCategory,
  ): Promise<void> {
    await this.productCategoryRepository.replaceById(id, productCategory);
  }

  @del('/product-categories/{id}')
  @response(204, {
    description: 'ProductCategory DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productCategoryRepository.deleteById(id);
  }
}
