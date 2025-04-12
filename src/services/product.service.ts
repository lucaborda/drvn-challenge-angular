// services/product.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsResponse } from '../models/product.model';
import { Observable } from 'rxjs';

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
}
