import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';

@Component({
  selector: 'app-grocery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groceryService = inject(GroceryService);

  readonly item = signal<Grocery | null>(null);

  isEditing = false;

  editedName = '';
  editedQuantity = 0;
  editedImage = '';

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    /* 🔑 FETCH DIRECTLY FROM API */
    this.groceryService.getById(id).subscribe({
      next: data => this.item.set(data),
      error: () => {
        alert('Grocery item not found');
        this.router.navigate(['/']);
      },
    });
  }

  /* ---------- NAVIGATION ---------- */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /* ---------- DELETE ---------- */
  deleteItem(): void {
    const current = this.item();
    if (!current) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${current.name}"?`
    );
    if (!confirmed) return;

    this.groceryService.delete(current.id);
    this.router.navigate(['/']);
  }

  /* ---------- EDIT ---------- */
  startEdit(): void {
    const current = this.item();
    if (!current) return;

    this.editedName = current.name;
    this.editedQuantity = current.quantity;
    this.editedImage = current.image || '';
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    const current = this.item();
    if (!current) return;

    if (!this.editedName.trim() || this.editedQuantity <= 0) {
      alert('Invalid values');
      return;
    }

    this.groceryService.update(current.id, {
      name: this.editedName.trim(),
      quantity: this.editedQuantity,
      image: this.editedImage.trim() || undefined,
    });

    /* Keep UI in sync instantly */
    this.item.set({
      ...current,
      name: this.editedName.trim(),
      quantity: this.editedQuantity,
      image: this.editedImage.trim() || undefined,
    });

    this.isEditing = false;
  }
}
