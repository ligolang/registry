const testPackageMetadata = require('./partials/pkg');

describe('/ (Verdaccio Page)', () => {
  let page;
  // this might be increased based on the delays included in all test
  jest.setTimeout(20000);

  beforeAll(async () => {
    await global.__SERVER__.putPackage(testPackageMetadata.name, testPackageMetadata);
    page = await global.__BROWSER__.newPage();
    await page.goto('http://localhost:55558');
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    await page.close();
  });

  test('Home: should display title', async () => {
    const text = await page.title();
    await page.waitForTimeout(4000);
    expect(text).toContain('Ligo package registry');
  });

  test('Home: should contain a search box', async () => {
    let searchBoxElementHandle = await page.$('form input[name="query"]');
    expect(
      await searchBoxElementHandle.evaluate((node) => node.getAttribute('placeholder'))
    ).toContain('Search');
  });

  test('Search Results: should load No results', async () => {
    await page.goto('http://localhost:55558/search/a-pkg-that-doesnt-exist');
    let h1Handle = await page.$('h1');
    expect(await h1Handle.evaluate((node) => node.innerText)).toContain('No results');
    await page.goto('http://localhost:55558/search/pk1-test');
    h1Handle = await page.$('h1');
    expect(await h1Handle.evaluate((node) => node.innerText)).toContain(
      '1 results found for pk1-test'
    );
  });

  test.skip('Package View: should load package Readme and other details', async () => {
    await page.goto('http://localhost:55558/package/pk1-test');
    await global.__SERVER__.putPackage(testPackageMetadata.name, testPackageMetadata);
    await page.waitForTimeout(5000);
    let h1Handle = await page.$('html');
    expect(await h1Handle.evaluate((node) => node.innerText)).toContain('No results');
  });
});
