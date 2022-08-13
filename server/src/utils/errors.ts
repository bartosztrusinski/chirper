interface IStatusCodeError extends Error {
  statusCode: number;
}

export abstract class StatusCodeError
  extends Error
  implements IStatusCodeError
{
  public abstract statusCode: number;
}

export class BadRequestError extends StatusCodeError {
  public statusCode = 400;
  public name = 'Bad Request Error';
}

export class NotFoundError extends StatusCodeError {
  public statusCode = 404;
  public name = 'Not Found Error';
}
