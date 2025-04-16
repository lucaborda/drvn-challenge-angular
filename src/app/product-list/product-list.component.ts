import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { Product, ProductsResponse } from '../../models/product.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';
import { FilterService } from '../../services/filter.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
    MatSidenavModule,
    SidebarComponent,
    CurrencyFormatPipe,
    RouterModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private lastCategory: string | null = null;

  constructor() {
    effect(() => {
      const currentCategory = this.filterService.selectedCategory();

      if (currentCategory !== this.lastCategory) {
        this.pageIndex.set(0);
        this.lastCategory = currentCategory;
      }
      this.pageSize();
      this.pageIndex();
      this.loadProducts();
    });
  }

  pageSize = signal(10);
  pageIndex = signal(0);
  isLoading = signal(false);
  products = signal<Product[]>([]);
  totalProducts = signal(0);
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
  private filterService = inject(FilterService);
  public currencyService = inject(CurrencyService);

  ngOnInit(): void {
    this.loadProducts();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder-product.png';
  }

  private loadProducts() {
    this.isLoading.set(true);
    const skip = this.pageIndex() * this.pageSize();
    const category = this.filterService.selectedCategory();

    this.productService
      .getProductsByCategory(category, skip, this.pageSize())
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.totalProducts.set(response.total);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading.set(false);
        },
      });
  }

  changeCurrency(currency: 'USD' | 'EUR') {
    this.currencyService.setCurrency(currency);
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
