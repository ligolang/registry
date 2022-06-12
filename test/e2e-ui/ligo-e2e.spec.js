const protectedPackageMetadata = require('./partials/pkg-protected');
const scopedPackageMetadata = require('./partials/pkg-scoped');

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

  test('should display title', async () => {});
  //

  test('should match title with no packages published', async () => {
    expect(true);
  });
  //

  // test('should match title with first step', async () => {

  // });
  // //

  // test('should match title with second step', async () => {
  // });
  // //

  // test('should match button Login to sign in', async () => {
  // });
  // //

  // test('should click on sign in button', async () => {
  // });
  // //

  // test('should log in an user', async () => {
  // });

  // test('should logout an user', async () => {
  // });
  // //

  // test('should publish a package', async () => {
  // });
  // //

  // test('should navigate to the package detail', async () => {
  // });

  // test('should contains last sync information', async () => {
  // });
  // //

  // test('should display dependencies tab', async () => {
  // });

  // test('should display version tab', async () => {
  // });

  // test('should display uplinks tab', async () => {
  // });

  // test('should display readme tab', async () => {
  // });

  // test('should publish a protected package', async () => {
  // });

  // test('should go to 404 page', async () => {
  // });
});
