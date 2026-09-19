export interface ApiResponse<T = unknown> {
  success: boolean;
  status?: string | undefined;
  message?: string | undefined;
  data?: T | undefined;
  error?: {
    code: string;
    details?: unknown;
  } | undefined;
  timestamp: string;
}

export class ResponseWrapper {
  static success<T>(data: T, message?: string, statusText?: string): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };

    if (message !== undefined) {
      response.message = message;
    }

    if (statusText !== undefined) {
      response.status = statusText;
    } else if (message !== undefined) {
      response.status = message;
    }

    return response;
  }

  static error(message: string, code: string = 'ERROR', details?: unknown): ApiResponse<null> {
    const response: ApiResponse<null> = {
      success: false,
      status: 'error',
      message,
      error: {
        code
      },
      timestamp: new Date().toISOString()
    };

    if (details !== undefined && response.error) {
      response.error.details = details;
    }

    return response;
  }
}
