import { TestBed } from '@angular/core/testing';

import { CategoryResponse, FilterService } from './filter.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('FilterService', () => {
  let service: FilterService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        FilterService,
      ],
    });

    service = TestBed.inject(FilterService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch categories and update availableCategories', async () => {
    const mockCategories: CategoryResponse[] = [
      { name: 'Category 1', slug: 'category-1', url: '/category-1' },
      { name: 'Category 2', slug: 'category-2', url: '/category-2' },
    ];

    const req = httpTesting.expectOne(
      'https://dummyjson.com/products/categories'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);

    expect(service.availableCategories()).toEqual(['category-1', 'category-2']);
  });
});
