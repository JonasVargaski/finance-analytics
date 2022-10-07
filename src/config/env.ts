import dotenv from 'dotenv';

dotenv.config();

process.env.TZ = 'UTC';

enum eEnvironment {
  APP_URL = 'APP_URL',
  APP_SECRET = 'APP_SECRET',
  APP_PORT = 'APP_PORT',
}

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`The environment variable ${name} has not been filled`);
  return value;
}

class Environments {
  public readonly APP_URL: string;
  public readonly APP_SECRET: string;
  public readonly APP_PORT: number;

  constructor() {
    this.APP_URL = getEnvironmentVariable(eEnvironment.APP_URL);
    this.APP_SECRET = getEnvironmentVariable(eEnvironment.APP_SECRET);
    this.APP_PORT = Number(getEnvironmentVariable(eEnvironment.APP_PORT));
  }
}

export const env = new Environments();
