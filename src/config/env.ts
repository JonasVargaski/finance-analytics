import dotenv from 'dotenv';

dotenv.config();

enum eEnvironment {
  APP_URL = 'APP_URL',
  APP_SECRET = 'APP_SECRET',
  APP_PORT = 'APP_PORT',

  DATABASE_URL = 'DATABASE_URL',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
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

  public readonly DATABASE_URL: string;

  public readonly REDIS_HOST: string;
  public readonly REDIS_PORT: number;

  constructor() {
    this.APP_URL = getEnvironmentVariable(eEnvironment.APP_URL);
    this.APP_SECRET = getEnvironmentVariable(eEnvironment.APP_SECRET);
    this.APP_PORT = Number(getEnvironmentVariable(eEnvironment.APP_PORT));

    this.DATABASE_URL = getEnvironmentVariable(eEnvironment.DATABASE_URL);

    this.REDIS_HOST = getEnvironmentVariable(eEnvironment.REDIS_HOST);
    this.REDIS_PORT = Number(getEnvironmentVariable(eEnvironment.REDIS_PORT));
  }
}

export const env = new Environments();
