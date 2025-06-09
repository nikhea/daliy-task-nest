/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('RequestLogger');

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl, ip, headers, body, query, params } = req;

    // Generate unique request ID for tracking
    const requestId = this.generateRequestId();
    req['requestId'] = requestId;

    // Log incoming request
    this.logger.log(`[${requestId}] Incoming Request`, {
      method,
      url: originalUrl,
      ip: this.getClientIp(req),
      ipx: ip,
      userAgent: headers['user-agent'],
      contentType: headers['content-type'],
      contentLength: headers['content-length'],
      authorization: headers['authorization'] ? '[REDACTED]' : undefined,
      cookies:
        Object.keys(req.cookies || {}).length > 0
          ? '[COOKIES_PRESENT]'
          : undefined,
      query: Object.keys(query).length > 0 ? query : undefined,
      params: Object.keys(params).length > 0 ? params : undefined,
      body: this.sanitizeBody(body),
      timestamp: new Date().toISOString(),
    });

    // Capture original response methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override response methods to log response
    res.send = function (body: any) {
      res.locals.responseBody = body;
      return originalSend.call(this, body);
    };

    res.json = function (body: any) {
      res.locals.responseBody = body;
      return originalJson.call(this, body);
    };

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      this.logger.log(`[${requestId}] Response Sent`, {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('content-length'),
        responseBody: this.sanitizeResponseBody(
          res.locals.responseBody,
          statusCode,
        ),
        timestamp: new Date().toISOString(),
      });
    });

    // Log errors
    res.on('error', (error) => {
      this.logger.error(`[${requestId}] Response Error`, {
        method,
        url: originalUrl,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    });

    next();
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string) ||
      (req.headers['x-real-ip'] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown'
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Limit body size in logs
    const bodyString = JSON.stringify(sanitized);
    if (bodyString.length > 1000) {
      return '[BODY_TOO_LARGE]';
    }

    return sanitized;
  }

  private sanitizeResponseBody(body: any, statusCode: number): any {
    // Don't log response body for successful requests to reduce noise
    if (statusCode >= 200 && statusCode < 300) {
      return '[SUCCESS_RESPONSE]';
    }

    // Log error responses but sanitize sensitive data
    if (body && typeof body === 'object') {
      const bodyString = JSON.stringify(body);
      if (bodyString.length > 500) {
        return '[ERROR_RESPONSE_TOO_LARGE]';
      }
      return body;
    }

    return body;
  }
}
