import { Request, Response, logger } from 'firebase-functions';

export { corsBuilder };

type Handler = (req: Request, resp: Response<any>) => void | Promise<void>;
type ReqWrapper = (handler: Handler) => Handler;

// Usage:
// const cors = corsBuilder(['https://example.com']);
// const wrappedHandler = cors((req, resp) => {...));  OR
// const wrappedHandler = cors(async (req, resp) => {...});

function corsBuilder(origins: string[]): ReqWrapper {
  return (handler: Handler): Handler => {
    return corsWrapper(origins, handler);
  };
}

function corsWrapper(origins: string[], handler: Handler): Handler {

  return (req: Request, resp: Response<any>): void | Promise<void> => {
    // Request from non-supported origin - just return non-CORS response
    if (!origins.includes(req.headers.origin!)) {
      logger.error(`Request from non-supported origin: ${req.headers.origin}`);
      return handler(req, resp);
    }

    resp.set('Access-Control-Allow-Origin', req.headers.origin);
    resp.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      // Send response to OPTIONS requests
      resp.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      resp.set('Access-Control-Allow-Headers', 'Bearer, Content-Type');
      resp.set('Access-Control-Max-Age', '3600');
      resp.status(204).send('');
      return;
    }

    return handler(req, resp);
  };
}
