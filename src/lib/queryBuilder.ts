import type { FilterExpression, FilterGroup, FilterOperator } from "@/types/filtering";

export class FilterQueryBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private query: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private baseQuery: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(baseQuery: any) {
    this.baseQuery = baseQuery;
    this.query = baseQuery;
  }

  // Reset to base query
  reset(): FilterQueryBuilder {
    this.query = this.baseQuery;
    return this;
  }

  // Add a single filter expression
  addFilter(expression: FilterExpression): FilterQueryBuilder {
    const { field, operator, value } = expression;

    switch (operator) {
      case "equals":
        this.query = this.query.eq(field, value);
        break;
      case "not_equals":
        this.query = this.query.neq(field, value);
        break;
      case "contains":
        this.query = this.query.ilike(field, `%${value}%`);
        break;
      case "not_contains":
        this.query = this.query.not(field, "ilike", `%${value}%`);
        break;
      case "starts_with":
        this.query = this.query.ilike(field, `${value}%`);
        break;
      case "ends_with":
        this.query = this.query.ilike(field, `%${value}`);
        break;
      case "greater":
        this.query = this.query.gt(field, value);
        break;
      case "greater_equal":
        this.query = this.query.gte(field, value);
        break;
      case "less":
        this.query = this.query.lt(field, value);
        break;
      case "less_equal":
        this.query = this.query.lte(field, value);
        break;
      case "between":
        if (typeof value === "object" && value !== null && "min" in value && "max" in value) {
          this.query = this.query.gte(field, value.min).lte(field, value.max);
        }
        break;
      case "in":
        if (Array.isArray(value)) {
          this.query = this.query.in(field, value);
        }
        break;
      case "not_in":
        if (Array.isArray(value)) {
          this.query = this.query.not(field, "in", value);
        }
        break;
      case "is_null":
        this.query = this.query.is(field, null);
        break;
      case "is_not_null":
        this.query = this.query.not(field, "is", null);
        break;
    }

    return this;
  }

  // Add multiple filter expressions
  addFilters(expressions: FilterExpression[]): FilterQueryBuilder {
    expressions.forEach((expression) => this.addFilter(expression));
    return this;
  }

  // Add a filter group with logical operators
  addGroup(group: FilterGroup): FilterQueryBuilder {
    if (group.expressions.length === 0) return this;

    if (group.logic === "AND") {
      // For AND logic, apply all filters sequentially
      group.expressions.forEach((expression) => this.addFilter(expression));
    } else {
      // For OR logic, we need to use Supabase's or() method
      const orConditions = group.expressions.map((expr) => {
        const { field, operator, value } = expr;
        const condition = this.buildCondition(field, operator, value);
        return condition;
      });

      if (orConditions.length > 0) {
        this.query = this.query.or(orConditions.join(","));
      }
    }

    return this;
  }

  // Add multiple filter groups
  addGroups(groups: FilterGroup[]): FilterQueryBuilder {
    groups.forEach((group) => this.addGroup(group));
    return this;
  }

  // Add global search across multiple fields
  addGlobalSearch(searchTerm: string, fields: string[]): FilterQueryBuilder {
    if (!searchTerm.trim() || fields.length === 0) return this;

    const searchConditions = fields.map((field) => `${field}.ilike.%${searchTerm}%`);

    this.query = this.query.or(searchConditions.join(","));
    return this;
  }

  // Add sorting
  addSorting(sortBy: string, sortOrder: "asc" | "desc"): FilterQueryBuilder {
    if (sortBy) {
      this.query = this.query.order(sortBy, { ascending: sortOrder === "asc" });
    }
    return this;
  }

  // Add pagination
  addPagination(page: number, pageSize: number): FilterQueryBuilder {
    const offset = page * pageSize;
    this.query = this.query.range(offset, offset + pageSize - 1);
    return this;
  }

  // Build condition for OR logic
  private buildCondition(field: string, operator: FilterOperator, value: unknown): string {
    switch (operator) {
      case "equals":
        return `${field}.eq.${value}`;
      case "not_equals":
        return `${field}.neq.${value}`;
      case "contains":
        return `${field}.ilike.%${value}%`;
      case "not_contains":
        return `${field}.not.ilike.%${value}%`;
      case "starts_with":
        return `${field}.ilike.${value}%`;
      case "ends_with":
        return `${field}.ilike.%${value}`;
      case "greater":
        return `${field}.gt.${value}`;
      case "greater_equal":
        return `${field}.gte.${value}`;
      case "less":
        return `${field}.lt.${value}`;
      case "less_equal":
        return `${field}.lte.${value}`;
      case "between":
        if (typeof value === "object" && value !== null && "min" in value && "max" in value) {
          return `${field}.gte.${value.min},${field}.lte.${value.max}`;
        }
        return "";
      case "in":
        if (Array.isArray(value)) {
          return `${field}.in.(${value.join(",")})`;
        }
        return "";
      case "not_in":
        if (Array.isArray(value)) {
          return `${field}.not.in.(${value.join(",")})`;
        }
        return "";
      case "is_null":
        return `${field}.is.null`;
      case "is_not_null":
        return `${field}.not.is.null`;
      default:
        return "";
    }
  }

  // Get the built query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  build(): any {
    return this.query;
  }

  // Clone the builder
  clone(): FilterQueryBuilder {
    const cloned = new FilterQueryBuilder(this.baseQuery);
    cloned.query = this.query;
    return cloned;
  }
}

// Utility function to create optimized queries
export const createOptimizedQuery = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: any,
  expressions: FilterExpression[],
  groups: FilterGroup[] = [],
  globalSearch: string = "",
  searchFields: string[] = [],
  sortBy: string = "",
  sortOrder: "asc" | "desc" = "asc",
  page: number = 0,
  pageSize: number = 50,
) => {
  const builder = new FilterQueryBuilder(baseQuery);

  // Apply filters in order of selectivity (most selective first)
  const sortedExpressions = expressions.sort((a, b) => {
    const selectivityOrder = ["equals", "in", "not_in", "contains", "starts_with", "ends_with"];
    const aIndex = selectivityOrder.indexOf(a.operator);
    const bIndex = selectivityOrder.indexOf(b.operator);
    return aIndex - bIndex;
  });

  return builder
    .addFilters(sortedExpressions)
    .addGroups(groups)
    .addGlobalSearch(globalSearch, searchFields)
    .addSorting(sortBy, sortOrder)
    .addPagination(page, pageSize)
    .build();
};

// Query performance monitoring
export class QueryPerformanceMonitor {
  private static queries: Map<string, { startTime: number; endTime?: number }> = new Map();

  static startQuery(queryId: string): void {
    this.queries.set(queryId, { startTime: performance.now() });
  }

  static endQuery(queryId: string): number {
    const query = this.queries.get(queryId);
    if (!query) return 0;

    const endTime = performance.now();
    const duration = endTime - query.startTime;

    this.queries.set(queryId, { ...query, endTime });

    // Log slow queries
    if (duration > 1000) {
      console.warn(`Slow query detected: ${queryId} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static getQueryStats(): Array<{ queryId: string; duration: number }> {
    return Array.from(this.queries.entries())
      .map(([queryId, query]) => ({
        queryId,
        duration: query.endTime ? query.endTime - query.startTime : 0,
      }))
      .sort((a, b) => b.duration - a.duration);
  }
}
