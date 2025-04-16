// services/product.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductsResponse } from '../models/product.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com';
  private http = inject(HttpClient);

  getProducts(
    skip: number = 0,
    limit: number = 10
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {
      params: {
        skip: skip.toString(),
        limit: limit.toString(),
      },
    });
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(
    category: string | null,
    skip: number = 0,
    limit: number = 10
  ) {
    if (!category) {
      return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {
        params: { skip, limit },
      });
    }

    return this.http
      .get<ProductsResponse>(`${this.apiUrl}/products/category/${category}`)
      .pipe(
        map((response) => ({
          products: response.products.slice(skip, skip + limit),
          total: response.products.length,
          skip,
          limit,
        })),
        catchError((error) => {
          console.error('Error loading products by category', error);
          return of({
            products: [],
            total: 0,
            skip,
            limit,
          } as ProductsResponse);
        })
      );
  }
}
