import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.smart-inklyuziv.uz'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default http

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await http.get<T>(url, { params })
  return response.data
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await http.post<T>(url, body ?? {})
  return response.data
}
