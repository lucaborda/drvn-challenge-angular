// product-detail.component.ts
import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../models/product.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyFormatPipe } from '../../pipes/currency.pipe';
import { CurrencyService } from '../../services/currency.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyFormatPipe,
    RouterModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  public currencyService = inject(CurrencyService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  editMode = signal(false);
  productForm!: FormGroup;
  isSaving = signal(false);

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.route.params.subscribe((params) => {
      this.loadProduct(params['id']);
    });
    this.initForm();
  }

  private initForm() {
    if (this.fb) {
      this.productForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
      });
    }
  }

  toggleEdit() {
    this.editMode.update((mode) => !mode);
    if (this.editMode() && this.product()) {
      this.productForm.patchValue({
        title: this.product()?.title,
        description: this.product()?.description,
        price: this.product()?.price,
        stock: this.product()?.stock,
      });
    }
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);

    const mockSuccess = Math.random() > 0.2;

    setTimeout(() => {
      if (mockSuccess) {
        const updatedProduct = {
          ...this.product()!,
          ...this.productForm.value,
        };
        this.product.set(updatedProduct);

        this.snackBar.open('¡Product has been updated!', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar',
        });
      } else {
        this.snackBar.open(
          'Error updating the product, try again later.',
          'Close',
          {
            duration: 3000,
            panelClass: 'error-snackbar',
          }
        );
      }

      this.isSaving.set(false);
      this.editMode.set(false);
    }, 1000);
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
