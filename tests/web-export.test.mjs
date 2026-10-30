import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Fashion Lens web export', () => {
  it('contains the login screen and its interactive entry points', async () => {
    const exportDirectory = path.join(process.cwd(), 'dist');
    const html = await readFile(path.join(exportDirectory, 'index.html'), 'utf8');
    expect(html).toContain('<title>Fashion Lens</title>');

    const bundlePath = html.match(/<script src="\/?([^"]+\.js)"/)?.[1];
    expect(bundlePath).toBeDefined();
    const bundle = await readFile(path.join(exportDirectory, bundlePath), 'utf8');

    for (const label of ['Email address', 'Password', 'Sign in', 'Create account']) {
      expect(bundle).toContain(label);
    }
  });
});
