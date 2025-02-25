import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContentService,
  ContentFilters,
  Content,
} from '../../services/content.service';
import { ToastrService } from 'ngx-toastr';
import { ContentDetailComponent } from './content-detail.component';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ContentDetailComponent],
})
export class ContentListComponent implements OnInit {
  content: Content[] = [];
  selectedContent: Content | null = null;
  totalItems = 0;
  filters: ContentFilters = {
    page: 1,
    pageSize: 15,
    type: '',
    search: '',
    sortBy: 'release_year',
    sortDirection: 'desc',
  };

  protected readonly Math = Math;

  constructor(
    private contentService: ContentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    this.contentService.getContent(this.filters).subscribe({
      next: (response) => {
        this.content = response.items;
        this.totalItems = response.total;
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to load content');
      },
    });
  }

  onFiltersChange(): void {
    this.filters.page = 1;
    this.loadContent();
  }

  toggleSortDirection(): void {
    this.filters.sortDirection =
      this.filters.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadContent();
  }

  changePage(page: number): void {
    this.filters.page = page;
    this.loadContent();
  }

  getTruncatedList(items: string[]): string {
    if (items == null || items.length === 0) return 'N/A';
    if (items.length <= 2) return items.join(', ');
    return `${items[0]}, ${items[1]}...`;
  }

  getNormalizedArray(arr: any[], key: string): any[] {
    return arr.map((item) => item[key]);
  }

  openDetail(content: Content): void {
    this.selectedContent = content;
  }
}
