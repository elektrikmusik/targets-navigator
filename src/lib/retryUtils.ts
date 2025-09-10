/**
 * Retry utility with exponential backoff for database queries
 */

interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 8000, // 8 seconds
  exponentialBase: 2,
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain types of errors
      if (shouldNotRetry(error)) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === opts.maxAttempts) {
        throw lastError;
      }

      // Calculate delay for next attempt
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.exponentialBase, attempt - 1),
        opts.maxDelay,
      );

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Sleep for the specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determine if an error should not be retried
 */
function shouldNotRetry(error: unknown): boolean {
  // Type guard to check if error has code and message properties
  const isErrorWithCode = (err: unknown): err is { code?: string; message?: string } => {
    return typeof err === "object" && err !== null && ("code" in err || "message" in err);
  };

  if (!isErrorWithCode(error)) {
    return false;
  }

  // Don't retry authentication errors
  if (error.code === "PGRST301" || error.code === "42501") {
    return true;
  }

  // Don't retry permission errors
  if (error.message?.toLowerCase().includes("permission denied")) {
    return true;
  }

  // Don't retry syntax errors
  if (error.code === "42601" || error.code === "42P01") {
    return true;
  }

  return false;
}

/**
 * Check if an error is likely a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  // Type guard to check if error has code and message properties
  const isErrorWithCode = (err: unknown): err is { code?: string; message?: string } => {
    return typeof err === "object" && err !== null && ("code" in err || "message" in err);
  };

  if (!isErrorWithCode(error)) {
    return false;
  }

  return (
    error.code === "57014" || // PostgreSQL statement timeout
    (error.message?.toLowerCase().includes("timeout") ?? false) ||
    (error.message?.toLowerCase().includes("canceling statement due to statement timeout") ?? false)
  );
}
