import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Grocery } from '../../core/models/grocery.model';

@Component({
  selector: 'app-grocery-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-card.html',
  styleUrl: './grocery-card.scss',
})
export class GroceryCardComponent {

  @Input({ required: true }) item!: Grocery;
  @Output() view = new EventEmitter<Grocery>();
  @Output() delete = new EventEmitter<string>();

  readonly fallbackImage = 'assets/default-grocery.png';

  onView(): void {
    this.view.emit(this.item);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
