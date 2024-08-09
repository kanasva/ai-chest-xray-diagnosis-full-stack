export function getRootErrorMsg(error: Error): string {
  let currentError: any = error;

  while (currentError.cause) {
    currentError = currentError.cause;
  }

  return currentError.message;
}
