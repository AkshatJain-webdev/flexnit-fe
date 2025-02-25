import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Content } from '../../services/content.service';

@Component({
  selector: 'app-content-detail',
  templateUrl: './content-detail.component.html',
  styleUrls: ['./content-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ContentDetailComponent {
  @Input() content!: Content;
  @Output() close = new EventEmitter<void>();

  getNormalizedArray(arr: any[], key: string): any[] {
    return arr.map((item) => item[key]);
  }
}