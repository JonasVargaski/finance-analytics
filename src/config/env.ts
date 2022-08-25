enum eEnvironment {
  APP_URL = 'APP_URL',
}

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`The environment variable ${name} has not been filled`);
  return value;
}

class Environments {
  public readonly APP_URL: string;

  constructor() {
    this.APP_URL = getEnvironmentVariable(eEnvironment.APP_URL);
  }
}

export const env = new Environments();
