import { SwapyWebPage } from './app.po';

describe('swapy-web App', () => {
  let page: SwapyWebPage;

  beforeEach(() => {
    page = new SwapyWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
