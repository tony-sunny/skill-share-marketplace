type Options = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  needAuth?: boolean;
  body?: Record<string, string | number | boolean | null>;
  parseResponse?: boolean;
};

const API_BASE_URL = "http://localhost:4000/api/v1";

export const queryAPI = async <T>(
  endpoint: string,
  options?: Options,
): Promise<T | null> => {
  const {
    method = "GET",
    needAuth = false,
    body,
    parseResponse = true,
  } = options || {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (needAuth) {
    const token = localStorage.getItem("auth_token");
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  if (parseResponse) {
    return response.json();
  } else {
    return null;
  }
};

export type LoginResponse = {
  token: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type Skill = {
  id: number;
  category: string;
  experience?: string;
  nature_of_work: string;
  hourly_rate: number;
};

export type SkillResponse = {
  skills: Skill[];
  pagination: Pagination;
};

export type Task = {
  id: number;
  user_id: number;
  category: string;
  name: string;
  description?: string;
  expected_start_date?: string;
  expected_hours?: number;
  hourly_rate?: number;
  rate_currency?: string;
};

export type TaskResponse = {
  tasks: Task[];
  pagination: Pagination;
};

export type TaskByIdResponse = {
  task: Task;
};

export type OfferResponse = {
  offers: {
    id: number;
    status: string;
    task: Task;
    provider?: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      role_type: string;
    };
  }[];
};
