/** Размытые превью фото шириной 12px, встраиваются в HTML. Пока грузится само
 *  фото, в рамке видно превью, а не серая заглушка (правка заказчика 2026-09-15).
 *  После замены файла в public/photos превью пересоздается через sharp:
 *  resize({ width: 12 }).webp({ quality: 40 }), результат в base64. */
export const photoBlur: Record<string, string> = {
  '/photos/founder-black.webp': 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAAAQAgCdASoMAA4AA4BaJQBOgMUAsO+5zuQAAP7tXl/qhMIzT1TG4EbZUMaaPCJPcfWpr6wmtifHJl0C0iCdDCrHf9XeKbCr93tFzcAA',
  '/photos/founder-jacket.webp': 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoMAA8AA4BaJZQCdADdJAMoY8AA/u/LowykY3ymuYlwC96dOFePZZYbvk5DrSMxFWs1M0dAAAA=',
  '/photos/team-kuznetsov.webp': 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAQCdASoMABAAA4BaJQBOgBbB6oq0AAD9veHx4rxlAaibgezOVixT8opeEzi8aqrRnQYxswH2tCQDc0+ZHc0Y2VGj5rE0CyOOaRQG4PkjbE6wAAA=',
  '/photos/team-lebedeva.webp': 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoMAA8AA4BaJQBOkCYicJ9x1eMAAP4mWj1oceUr5kad7h7DfzkGzDKq1bdJYkL41HFgFn4L3FNgPLREpSMD+V6GfDlkjD7JTU67Pi5hAAA=',
  '/photos/team-morozov.webp': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAgCdASoMABAAA4BaJZQAAxZZGTO41vKeAAD2veKKWVz9m9zFHGAlyTKDw6ZZKP/0RD3WXyIJMn6MWkDyLBtAgae88fq9tcHuHkeHUoJWnAAA',
  '/photos/team-novikov.webp': 'data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACwAQCdASoMABAAA4BaJQBOgBq8i3gAAP13eXvcRBBiVYsO6zivF6ljxZ+RjEQPqnqZ5q8Le5so2DpfCRief32vByWkVc2Vm94SeMOKm0oAAA==',
  '/photos/team-orlov.webp': 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQAgCdASoMABAAA4BaJYwAAlrk5k9dvrgAAP4Fn/b4qvK7LNvkRTt/fSeNnESbuOtsIsRDp4GrXY1xd6QqdzwnpOGM+vwqUkir47CyaakWyDfxR0mBoAfYxDUpwgAA',
  '/photos/team-sokolova.webp': 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAADwAQCdASoMABAAA4BaJYgCdADcUD9MRKgA/kKY8eq+ggTmBVitPGvQJCd7VtozHIrduVZ2jAzEwjUH01WIKp8JbAoMT3pkneVvp4+lrRmymozDB3yKfJfPTfGLl3rN6rSTXQAA',
  '/photos/team-volkova.webp': 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAAAwAgCdASoMAA4AA4BaJYwCdAD71J9rqI1AAADIlXAYyEuZ/z5ZMyfgXIt0r68+llwvlev8yNUjHimWLg6oq+ZuzpgKy/3Vd4AAAA==',
};
