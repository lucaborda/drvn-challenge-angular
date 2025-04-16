// sidebar.component.ts
import { Component, inject, computed } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  filterService = inject(FilterService);
  isLoading = computed(
    () => this.filterService.availableCategories().length === 0
  );

  toggleCategory(category: string) {
    if (this.filterService.selectedCategory() === category) {
      this.filterService.clearFilter();
    } else {
      this.filterService.setCategory(category);
    }
  }
}
