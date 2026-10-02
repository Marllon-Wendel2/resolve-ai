// Interface para o que vem da URL (tudo string)
export interface QueryParams {
  limit?: string;
  offset?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  orderBy?: 'asc' | 'desc';
}

// Sua interface de filtro para o Service
export interface Filter {
  category?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
