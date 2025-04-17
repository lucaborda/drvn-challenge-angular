import { SidebarComponent } from './sidebar.component';
import { FilterService } from '../../services/filter.service';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { screen } from '@testing-library/dom';
import { computed, signal, WritableSignal } from '@angular/core';

describe('SidebarComponent', () => {
  let filterServiceMock: jest.Mocked<Partial<FilterService>>;
  const user = userEvent.setup();

  beforeEach(() => {
    const availableCategories = signal<string[]>([]);
    const selectedCategory = signal<string | null>(null);
    filterServiceMock = {
      availableCategories: availableCategories.asReadonly(),
      selectedCategory: selectedCategory.asReadonly(),
      clearFilter: jest.fn(),
      setCategory: jest.fn((category: string | null) => {
        selectedCategory.set(category);
      }),
      loadCategories: jest.fn(),
      hasFilter: computed(() => selectedCategory() !== null),
    } as unknown as jest.Mocked<Partial<FilterService>>;
  });

  it('should display checkboxes for available categories', async () => {
    filterServiceMock.setCategory!(null);
    const availableCategories = signal(['category1', 'category2']);
    filterServiceMock.availableCategories = availableCategories.asReadonly();

    await render(SidebarComponent, {
      providers: [
        { provide: FilterService, useValue: filterServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    expect(screen.getByText('Category1')).toBeInTheDocument();
    expect(screen.getByText('Category2')).toBeInTheDocument();
  });

  it('should call setCategory when a category is clicked', async () => {
    const availableCategories = signal(['category1', 'category2']);
    const selectedCategory = signal<string | null>(null);

    filterServiceMock = {
      ...filterServiceMock,
      availableCategories: availableCategories.asReadonly(),
      selectedCategory: selectedCategory.asReadonly(),
      setCategory: jest.fn((category: string | null) => {
        selectedCategory.set(category);
      }),
    };

    await render(SidebarComponent, {
      providers: [
        { provide: FilterService, useValue: filterServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    await user.click(screen.getByText('Category1'));
    expect(filterServiceMock.setCategory).toHaveBeenCalledWith('category1');
  });
});
