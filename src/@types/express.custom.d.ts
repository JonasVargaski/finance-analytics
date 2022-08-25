/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    UserToken: {
      name: string
      id: string
      email: string
      ws: {
        online: boolean
        userId: string
        sessions: Array<ISession>
        broadcast(event: string, payload: unknown): void
        notify(event: string, payload: unknown): void
        to(usersId?: Array<string>): INotify
      }
    }
  }
}
