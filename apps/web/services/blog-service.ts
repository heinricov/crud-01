const DEFAULT_BASE_URL = "http://localhost:4000";

type ID = number | string;

export interface Blog {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BaseResponse {
  statusCode: number;
  message: string;
  date: string;
}

export interface ListResponse extends BaseResponse {
  count: number;
  updatedAt: string | null;
  data: Blog[];
}

export interface OneResponse extends BaseResponse {
  data: Blog;
}

export interface CreatePayload {
  title: string;
  content: string;
}

export interface UpdatePayload {
  title?: string;
  content?: string;
}

class BlogService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
  }

  private async request<T>(
    path: string,
    init?: globalThis.RequestInit
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      ...init
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  async getAll(): Promise<ListResponse> {
    return this.request<ListResponse>("/blogs");
  }

  async getById(id: ID): Promise<OneResponse> {
    return this.request<OneResponse>(`/blogs/${id}`);
  }

  async create(payload: CreatePayload): Promise<OneResponse> {
    return this.request<OneResponse>("/blogs", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async update(id: ID, payload: UpdatePayload): Promise<OneResponse> {
    return this.request<OneResponse>(`/blogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  }

  async deleteById(id: ID): Promise<BaseResponse & { data: { id: number } }> {
    return this.request<BaseResponse & { data: { id: number } }>(
      `/blogs/${id}`,
      {
        method: "DELETE"
      }
    );
  }

  async deleteAll(): Promise<BaseResponse & { count: number }> {
    return this.request<BaseResponse & { count: number }>("/blogs", {
      method: "DELETE"
    });
  }
}

export const blogService = new BlogService();
export default BlogService;
