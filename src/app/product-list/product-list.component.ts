import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product, ProductsResponse } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    CurrencyPipe,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  pageSize = signal(10);
  pageIndex = signal(0);
  isLoading = signal(false);
  displayedColumns: string[] = [
    'id',
    'images',
    'title',
    'price',
    'rating',
    'stock',
    'brand',
  ];

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder-product.png';
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const skip = this.pageIndex() * this.pageSize();

    this.productService.getProducts(skip, this.pageSize()).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.totalProducts = response.total;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }
}
