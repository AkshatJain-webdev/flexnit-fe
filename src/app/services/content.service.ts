import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Content {
  id: number;
  type: number;
  title: string;
  director: string;
  cast: string[];
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  categories: { _id: string; name: string }[];
  description: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContentFilters {
  type?: 'TV' | 'Movie' | '';
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private http: HttpClient) {}

  getContent(filters: ContentFilters): Observable<PaginatedResponse<Content>> {
    let params = new HttpParams().set('page', filters.page.toString());

    if (!!filters.type) {
      params = params.set('type', Number(filters.type));
    }
    if (!!filters.search) {
      params = params.set('search', filters.search);
    }
    if (!!filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
      params = params.set('sortDir', filters.sortDirection || 'asc');
    }

    return this.http.get<PaginatedResponse<Content>>(
      environment.apiUrl.concat('/api/v1/shows'),
      {
        params,
      }
    );
  }
}
