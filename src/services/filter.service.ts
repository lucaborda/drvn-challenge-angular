// services/filter.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type CategoryResponse = {
  name: string;
  slug: string;
  url: string;
};

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _selectedCategory = signal<string | null>(null);
  private _availableCategories = signal<string[]>([]);

  selectedCategory = this._selectedCategory.asReadonly();
  availableCategories = this._availableCategories.asReadonly();

  hasFilter = computed(() => this.selectedCategory() !== null);

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  loadCategories() {
    this.http
      .get<CategoryResponse[]>(`https://dummyjson.com/products/categories`)
      .subscribe({
        next: (categories) =>
          this._availableCategories.set(categories.map((c) => c.slug)),
        error: (err) => console.error('Error loading categories', err),
      });
  }

  setCategory(category: string | null) {
    this._selectedCategory.set(category);
  }

  clearFilter() {
    this._selectedCategory.set(null);
  }
}
