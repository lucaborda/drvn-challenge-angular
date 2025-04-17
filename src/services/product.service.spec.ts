import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Product, ProductsResponse } from '../models/product.model';
import { firstValueFrom } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        ProductService,
      ],
    });

    service = TestBed.inject(ProductService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should bring product data', async () => {
    // GIVEN
    const mockResponse: ProductsResponse = {
      products: [
        {
          id: 1,
          title: 'Product 1',
          price: 100,
          description: 'This is product 1',
          weight: 11,
          warrantyInformation: 'test warranty',
          shippingInformation: 'test shipping info',
          dimensions: {
            height: 7,
            width: 14,
            depth: 11,
          },
          tags: [],
          discountPercentage: 7,
          rating: 7,
          stock: 7,
          brand: 'Test Brand',
          category: 'Test',
          thumbnail: 'Test thumbnail',
          images: ['test.jpg'],
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    };

    // WHEN
    const products$ = service.getProducts(0, 10);
    const productsPromise = firstValueFrom(products$);

    const req = httpTesting.expectOne(
      'https://dummyjson.com/products?skip=0&limit=10'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    // THEN
    expect(await productsPromise).toEqual(mockResponse);
  });

  it('should bring product data by id', async () => {
    // GIVEN
    const mockResponse: Product = {
      id: 1,
      title: 'Product 1',
      price: 100,
      description: 'This is product 1',
      weight: 11,
      warrantyInformation: 'test warranty',
      shippingInformation: 'test shipping info',
      dimensions: {
        height: 7,
        width: 14,
        depth: 11,
      },
      tags: [],
      discountPercentage: 7,
      rating: 7,
      stock: 7,
      brand: 'Test Brand',
      category: 'Test',
      thumbnail: 'Test thumbnail',
      images: ['test.jpg'],
    };

    // WHEN
    const product$ = service.getProductById('1');
    const productPromise = firstValueFrom(product$);

    const req = httpTesting.expectOne('https://dummyjson.com/products/1');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    // THEN
    expect(await productPromise).toEqual(mockResponse);
  });
});
