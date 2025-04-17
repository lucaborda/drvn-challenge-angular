import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailComponent } from './product-detail.component';
import { Product } from '../../models/product.model';
import userEvent from '@testing-library/user-event';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';
import { render } from '@testing-library/angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { getByDisplayValue, screen } from '@testing-library/dom';

describe('ProductDetailComponent', () => {
  let productServiceMock: jest.Mocked<ProductService>;

  const user = userEvent.setup();

  const mockedResponse: Product = {
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
    tags: ['test tag'],
    discountPercentage: 7,
    rating: 7,
    stock: 7,
    brand: 'Test Brand',
    category: 'Test',
    thumbnail: 'Test thumbnail',
    images: ['test.jpg'],
  };

  beforeEach(async () => {
    productServiceMock = {
      getProductById: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  it('should display product information', async () => {
    // GIVEN
    productServiceMock.getProductById.mockReturnValue(of(mockedResponse));

    await render(ProductDetailComponent, {
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    // WHEN
    const shippingFolding = screen.getByText('Shipping');
    await user.click(shippingFolding);

    const productDescriptionDisplayed = screen.getByText('This is product 1');
    const productPriceDisplayed = screen.getByText('$100.00');
    const productWeightDisplayed = screen.getByText('11');
    const productStockDisplayed = screen.getByText('7 units');
    const productWarrantyDisplayed = screen.getByText('test warranty');
    const productShippingDisplayed = screen.getByText('test shipping info');
    const productDimensionsDisplayed = screen.getByText('14 x 7 x 11');
    const productTagsDisplayed = screen.getByText('test tag');
    const productBrandDisplayed = screen.getByText('Test Brand | Test');
    const productCategoryDisplayed = screen.getByText('Test');

    // THEN
    expect(productDescriptionDisplayed).toBeInTheDocument();
    expect(productPriceDisplayed).toBeInTheDocument();
    expect(productWeightDisplayed).toBeInTheDocument();
    expect(productStockDisplayed).toBeInTheDocument();
    expect(productWarrantyDisplayed).toBeInTheDocument();
    expect(productShippingDisplayed).toBeInTheDocument();
    expect(productDimensionsDisplayed).toBeInTheDocument();
    expect(productTagsDisplayed).toBeInTheDocument();
    expect(productBrandDisplayed).toBeInTheDocument();
    expect(productCategoryDisplayed).toBeInTheDocument();
  });

  it('should toggle to edit mode when clicking on edit button', async () => {
    // GIVEN
    productServiceMock.getProductById.mockReturnValue(of(mockedResponse));

    await render(ProductDetailComponent, {
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    // WHEN
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    // THEN
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should fill the form with product information when in edit mode', async () => {
    // GIVEN
    productServiceMock.getProductById.mockReturnValue(of(mockedResponse));

    await render(ProductDetailComponent, {
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    // WHEN
    const editButton = screen.getByRole('button', { name: 'Edit' });
    await user.click(editButton);

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const descriptionInput = screen.getByRole('textbox', {
      name: 'Description',
    });
    const priceInput = screen.getByRole('spinbutton', { name: 'Price' });
    const stockInput = screen.getByRole('spinbutton', { name: 'Stock' });

    await user.type(nameInput, 'Product 2');
    await user.type(descriptionInput, 'This is product 2');
    await user.type(priceInput, '21');
    await user.type(stockInput, '11');

    // THEN
    expect(nameInput).toHaveValue('Product 2');
    expect(descriptionInput).toHaveValue('This is product 2');
    expect(priceInput).toHaveValue(21);
    expect(stockInput).toHaveValue(11);
  });
});
