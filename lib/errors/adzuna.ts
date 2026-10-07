export class AdzunaConfigError extends Error {
  constructor(message = "Adzuna credentials are not configured") {
    super(message);
    this.name = "AdzunaConfigError";
  }
}

export class AdzunaApiError extends Error {
  public status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "AdzunaApiError";
    this.status = status;
  }
}
