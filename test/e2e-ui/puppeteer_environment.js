const fs = require('fs');
const os = require('os');
const path = require('path');
const debug = require('debug')('verdaccio:e2e:ui:puppeteer');

const NodeEnvironment = require('jest-environment-node');
const { yellow, red } = require('kleur');
const puppeteer = require('puppeteer');

const VerdaccioProcess = require('./registry-launcher');
const Server = require('./server');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

class VerdaccioConfig {
  constructor(storagePath, configPath, domainPath, port) {
    this.storagePath = storagePath;
    this.configPath = configPath;
    this.domainPath = domainPath;
    this.port = port;
  }
}

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const config1 = new VerdaccioConfig(
      path.join(__dirname, './store-e2e'),
      path.join(__dirname, './config/config-scoped-e2e.yaml'),
      'http://localhost:55558/-/api',
      55558
    );
    const config2 = new VerdaccioConfig(
      path.join(__dirname, './store-e2e'),
      path.join(__dirname, './config/config-protected-e2e.yaml'),
      'http://localhost:55552/-/api',
      55552
    );
    const server1 = new Server.default(config1.domainPath);
    const server2 = new Server.default(config2.domainPath);
    const process1 = new VerdaccioProcess.default(config1, server1);
    const process2 = new VerdaccioProcess.default(config2, server2);
    const verdaccioPath = path.normalize(
      path.join(process.cwd(), '../../packages/verdaccio/debug/bootstrap.js')
    );
    let fork;
    try {
      fork = await process1.init(verdaccioPath);
      this.global.__VERDACCIO_E2E__ = fork[0];
    } catch (e) {
      debug(red('Error while initialising registry'));
      debug(e);
      this.global.__VERDACCIO_E2E__ = process1;
    }

    let fork2;
    try {
      fork2 = await process2.init(verdaccioPath);
      this.global.__VERDACCIO__PROTECTED_E2E__ = fork2[0];
    } catch (e) {
      debug(red('Error while initialising registry'));
      debug(e);
      this.global.__VERDACCIO__PROTECTED_E2E__ = process2;
    }

    debug(yellow('Setup Test Environment.'));
    await super.setup();
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }
    this.global.__SERVER__ = server1;
    this.global.__SERVER_PROTECTED__ = server2;
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    debug(yellow('Teardown Test Environment.'));
    await super.teardown();
    this.global.__VERDACCIO_E2E__.stop();
    this.global.__VERDACCIO__PROTECTED_E2E__.stop();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
