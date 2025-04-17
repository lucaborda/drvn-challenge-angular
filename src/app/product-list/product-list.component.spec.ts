import { ProductListComponent } from './product-list.component';
import { render } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductsResponse } from '../../models/product.model';
import { RouterModule } from '@angular/router';

describe('ProductListComponent', () => {
  let productServiceMock: jest.Mocked<ProductService>;

  const user = userEvent.setup();

  const mockedResponse: ProductsResponse = {
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

  beforeEach(async () => {
    productServiceMock = {
      getProductsByCategory: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  it('should display products in table', async () => {
    // GIVEN
    productServiceMock.getProductsByCategory.mockReturnValue(
      of(mockedResponse)
    );

    await render(ProductListComponent, {
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        RouterModule,
      ],
    });

    // WHEN
    const productOnTable = screen.getByText('Product 1');

    // THEN
    expect(productOnTable).toBeInTheDocument();
  });

  it('should redirect to product detail page when clicking on a product', async () => {
    // GIVEN
    productServiceMock.getProductsByCategory.mockReturnValue(
      of(mockedResponse)
    );

    await render(ProductListComponent, {
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    // WHEN
    const productOnTableLink = screen.getByRole('link', {
      name: 'Product 1',
    });

    // THEN
    expect(productOnTableLink.getAttribute('href')).toEqual('/products/1');
  });
});
