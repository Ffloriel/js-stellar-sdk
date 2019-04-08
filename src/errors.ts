export class NetworkError extends Error {

  response: any;

  constructor(message: string, response: any) {
    super(message);
    this.response = response;
  }

  getResponse() {
    return this.response;
  }
}

export class NotFoundError extends NetworkError {}

export class BadRequestError extends NetworkError {}

export class BadResponseError extends NetworkError {}
