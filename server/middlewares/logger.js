/**
 * HTTP request logger middleware.
 * Logs method, URL, status code, execution duration, and IP.
 */
export const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Wait for the response to finish before logging
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    let statusColor = "\x1b[32m"; // green for 2xx
    if (statusCode >= 400) statusColor = "\x1b[31m"; // red for 4xx/5xx
    else if (statusCode >= 300) statusColor = "\x1b[33m"; // yellow for 3xx

    const resetColor = "\x1b[0m";

    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusColor}${statusCode}${resetColor} (${duration}ms) - IP: ${ip}`
    );
  });

  next();
};

export default logger;
