export interface ApiResponse<T = null> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
