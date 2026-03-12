// src/types/d1.d.ts などに置く
export interface D1Database {
  prepare(query: string): {
    all(): Promise<{ results: any[] }>;
    get(): Promise<any>;
    run(): Promise<void>;
  };
}