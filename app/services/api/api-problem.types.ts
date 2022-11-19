export type ApiProblemCode =
  | 'CLIENT_ERROR'
  | 'SERVER_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CONNECTION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export type ApiProblemMessage = string | unknown

export type ApiProblem =
  | { kind: 'timeout'; message: ApiProblemMessage; temporary: true }
  | { kind: 'cannot-connect'; message: ApiProblemMessage; temporary: true }
  | { kind: 'server'; message: ApiProblemMessage }
  | { kind: 'unauthorized'; message: ApiProblemMessage }
  | { kind: 'forbidden'; message: ApiProblemMessage }
  | { kind: 'not-found'; message: ApiProblemMessage }
  | { kind: 'rejected'; message: ApiProblemMessage }
  | { kind: 'unknown'; message: ApiProblemMessage, temporary: true }
  | { kind: 'bad-data' }
