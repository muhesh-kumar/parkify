class HttpError extends Error {
  code: number;
  status: number | undefined;

  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
  }
}

export default HttpError;
