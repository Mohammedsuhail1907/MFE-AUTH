class Environment {

  public production: boolean;
  public environment: any = {};
  constructor() {
    this.production = false;
  }

  setEnvironment(config: any) {
    console.log('dynamicService call in env', config)
    this.production = config.production || false;
    this.environment = {...config};
  }
}

export const environment = new Environment();