const protectedPackageMetadata = require('./partials/pkg-protected');
const testPackageMetadata = require('./partials/pkg');

describe('/ (Verdaccio Page)', () => {
  let page;
  // this might be increased based on the delays included in all test
  jest.setTimeout(20000);

  const clickElement = async function (selector, options = { delay: 100 }) {
    const button = await page.$(selector);
    await button.focus();
    await button.click(options);
  };

  const evaluateSignIn = async function (matchText = 'Login') {
    const text = await page.evaluate(() => {
      return document.querySelector('button[data-testid="header--button-login"]').textContent;
    });

    expect(text).toMatch(matchText);
  };

  const getPackages = async function () {
    return await page.$$('.package-title');
  };

  const logIn = async function () {
    await clickElement('div[data-testid="dialogContentLogin"]');
    const userInput = await page.$('#login--dialog-username');
    expect(userInput).not.toBeNull();
    const passInput = await page.$('#login--dialog-password');
    expect(passInput).not.toBeNull();
    await userInput.type('test', { delay: 100 });
    await passInput.type('test', { delay: 100 });
    await passInput.dispose();
    // click on log in
    const loginButton = await page.$('#login--dialog-button-submit');
    expect(loginButton).toBeDefined();
    await loginButton.focus();
    await loginButton.click({ delay: 100 });
    await page.waitForTimeout(500);
  };

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://0.0.0.0:55558');
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    await page.close();
  });

  test('Home: should display title', async () => {
    const text = await page.title();
    await page.waitForTimeout(1000);
    expect(text).toContain('Ligo package registry');
  });

  test('Home: should contain a search box', async () => {
    let searchBoxElementHandle = await page.$('form input[name="query"]');
    expect(
      await searchBoxElementHandle.evaluate((node) => node.getAttribute('placeholder'))
    ).toContain('Search');
  });

  test('Search Results: should load No results', async () => {
    // await page.goto('http://0.0.0.0:55558/search/a-pkg-that-doesnt-exist');
    await page.goto('http://0.0.0.0:55558/search/pk1-test');
    let h1Handle = await page.$('h1');
    expect(await h1Handle.evaluate((node) => node.innerText)).toContain('No results');
    // // TODO
    // //  error---  error on local search onEnd is not a function
    // // Not possible to test non-empty list of search results right now, because in-memory backend doesnt implement search
    // await global.__SERVER__.putPackage(testPackageMetadata.name, testPackageMetadata);
    // await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    // await page.waitForTimeout(2000);
    // h1Handle = await page.$('html');
    // expect(await h1Handle.evaluate((node) => node.innerHTML)).toContain('No results');
  });

  test.skip('Package View: should load package Readme and other details', async () => {
    await page.goto('http://0.0.0.0:55558/package/pk1-test');
    await global.__SERVER__.putPackage(testPackageMetadata.name, testPackageMetadata);
    await page.waitForTimeout(5000);
    let h1Handle = await page.$('html');
    expect(await h1Handle.evaluate((node) => node.innerText)).toContain('No results');
  });
});
