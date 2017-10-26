const books = require('./Books');

describe('Books class', () => {
  let Books = null;

  it('should not error', () => {
    Books = new books();
  });

  it('should have a getImage method', () => {
    expect(Books.getImage).not.toBeNull();
    expect(Books.getImage).toBeDefined();
  });

  it('getImage should return an image', async () => {
    const link =
      'https://www.audible.com/pd/Bios-Memoirs/What-I-Learned-Losing-a-Million-Dollars-Audiobook/B00NC8XVVC';
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };
    await Books.getImage(link, res);
  });
});
