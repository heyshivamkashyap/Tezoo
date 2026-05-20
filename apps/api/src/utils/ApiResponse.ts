export class ApiResponse<T = null> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;

  constructor(statusCode: number, data?: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}
