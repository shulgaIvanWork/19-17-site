/** Размытые превью фото шириной 12px, встраиваются в HTML. Пока грузится само
 *  фото, в рамке видно превью, а не серая заглушка (правка заказчика 2026-09-15).
 *  После замены файла в public/photos превью пересоздается через sharp:
 *  resize({ width: 12 }).webp({ quality: 40 }), результат в base64.
 *
 *  Снимки макетов из public/works идут тем же путем: карточка работы рисуется
 *  тем же Photo, и без превью на ее месте висела серая рамка. */
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
  '/works/flow/board.webp': 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQAgCdASoMAAwAA4BaJZQC7ADbbZsMFrwAAP73VUG37TZO90x3iSs7+CJQ3KNFpHLIX2OiHy+vulBPWsqFfL9ssdHgDlUFGImSnE5a6cczQPr0SMAAAA==',
  '/works/ward.webp': 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAAAQAgCdASoMAAgAA4BaJYwCdAEU9ZnyDCgAAP7pXqwnY6hSaXe1cD/WuOs3zZqjIPDySTSQUNSk+9vREswk84Qm5PLA3tVd1ml6fqIAAAA=',
  '/works/freight.webp': 'data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoMAAgAA4BaJZACdADhXTJlUAD+sQ2Cpt6/0xLA4UlEHJyA725q4nprJc/M7/jbPTXCbJDDph4suaAe5CRFWc2QoAA=',
  '/works/greenspace.webp': 'data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAAAQAgCdASoMAAgAA4BaJZQC7AEfhvpB3xgQAP7yvcMf/rQ9otSNgzv/l7DW/Nhde6n+Ccj7+L8gAAAA',
  '/works/smoothie.webp': 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACwAQCdASoMAAgAA4BaJYgAAt0J5rgAAP7p27WfAB7h8XRSMxt6yAZ54vh1D4YFo7L/ra1gABMAAA==',
  '/works/coffee.webp': 'data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAACwAQCdASoMAAgAA4BaJZwAAlxSIIgAAP724ODU+890Mm7dlNZ6nlDayl0dePU2c+lf/PCAAAA=',
  '/works/healthbowl.webp': 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoMAAgAA4BaJYwCdAEDfUHI20AA/u0nXvtDJgBw5TCjjTjgZpNSzNihZ2oWGHMWDpcuMzVRpl4zheb09ta2gAAA',
  '/works/pastry.webp': 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoMAAgAA4BaJQBOgB4aMcoGgAD+7L8N00wF6+3mo30el8hAcOTJhF+GMHfWEZTx6iAAAA==',
  '/works/steak.webp': 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADwAQCdASoMAAgAA4BaJYwCdAEf/6jKhAAA/vSZ5LvQ0YN/LmpqMBMe7WT3GFVAAAA=',
  '/works/bakery.webp': 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoMAAgAA4BaJZwAAvafYElSYAD+8yBejCDUVau2OTcwydUh3KdTVGuAAAA=',
  '/works/foody.webp': 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAQAgCdASoMAAgAA4BaJYwC7AEf/7oAU5vAAP74k4+P+6VrL3+XmmeaNbjLlqRb+xdZ1ib6L/hn1QkpikXNiSZrGJ4N4AAA',
  '/works/roastery.webp': 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAACQAQCdASoMAAgAA4BaJZwAAkrANgAA/u+NU87xWgzvBh2XG9z39AZ1WZvFmgace7myuyKnaL4AAA==',
  '/works/sushi.webp': 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAADQAQCdASoMAAgAA4BaJZQAAsf81gFncAD+8yWC0cRpRYvDabR8/TnhVtWU+G0rGK07OXQNHpHKAA==',
  '/works/desserts.webp': 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAADwAQCdASoMAAgAA4BaJZwAAn/7kQ4+hYAA/tzbZ32JUOly/K5e+CuQUolRRSXJrRA2YRhcaQC3zn62AAA=',
  '/works/cake.webp': 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACwAQCdASoMAAgAA4BaJZQCdAED32cAAP7xoyjl81EiGg4ccD8ewI0M068V/u7vGPTT2XQiemGcloAAAAA=',
};
