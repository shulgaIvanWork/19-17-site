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
  '/photos/team-kuznetsov.webp': 'data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAABwAgCdASoMAA8AA4BaJYgCdIIjE7EUbWntqFoAAPzp1PjpfmtOYrnpdZwhQosCsDcQ2sJk3DI0dZd4PTZKS8gEJe0+qY+UiGW5cG83bKcnlzWPh2s46EsqUAW6EZvHw0mktAAA',
  '/photos/team-lebedeva.webp': 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQAgCdASoMAA8AA4BaJYwCdAEfUfM/8sGwAP7q80cRQLYiFpZYE1g0Ua5Ig+m8xxlMu1DHhKWz9l0kOqE6kcpXDWU7uQWyjl+GaqHomRLCi6WnhR8gnm4A',
  '/photos/team-morozov.webp': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAQCdASoMAA8AA4BaJZACdAYt9Z/Rz5AA+6NSoqTK6szSJumyyrSjiotYCy0l9p4u7xxg02RpfwhBw4SuJqkuk5UCIVe88sQWVENvU33AUG1JEJ0ehr+s2oXu9tkAAAA=',
  '/photos/team-novikov.webp': 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADQAQCdASoMAA8AA4BaJZQCw7EO4R1toAD+JQnU8piY+sPTAXXxw62Qau5mBIdARVukbrcIB0e/BYNBsAkkZ6k6I7GFrnOnUjYJ57zpx0/a9u/kUBxlFgAA',
  '/photos/team-orlov.webp': 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAwAgCdASoMAA8AA4BaJZQCw7EDfo+g+VU1WAD+1DL81bTBGflKx1+jcCpOVMpuYe5oSbC3Jlz+82Boj2u8D0MCZ1IJE4AA',
  '/photos/team-sokolova.webp': 'data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAQAgCdASoMAA8AA4BaJYwCdAD0ls6xQLQ+APffrnu8Ljqer25rs5fcjodvGvyg0cqGjKD8ODwVRmVi9x97iHEmQCJoRkvHgGeEilJ5udF3AgAA',
  '/photos/team-volkova.webp': 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAgCdASoMAA8AA4BaJYwCdAD0tPycd6WGAAD+14h0cgEwbGg8WY6atQwMBwA5JVokiJeHPIOEA5iki5xh7QD+IjOE69+whcYjJlTbgnAUdbbXQ4fs7TODmAA=',
  '/works/flow/01-task.webp': 'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoMAAIABIBaJaQAA3AA/vS1xAAAAA==',
  '/works/flow/02-associations.webp': 'data:image/webp;base64,UklGRioAAABXRUJQVlA4IB4AAAAwAQCdASoMAAcAA4BaJaQAA3AA/vTh92YlpuKmgAA=',
  '/works/flow/03-references.webp': 'data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAADQAwCdASoMABIAPu1iqU2ppaOiMAgBMB2JQBdgBHwA9v7e1dBsWAAA/lrl6Yipjx/66Xsyq4/Gu+5+hO80DDcZr2EthKOU3Lg97HSeREQpJM8sb9XmauSRGW9e8ymgFNBwYauad7/eF+GECrPS/UWcHzP1wMJA7kwAAA==',
  '/works/flow/04-photos.webp': 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAwAgCdASoMAA0AA4BaJQBOgMUAuhjUL4YBgAD+mK+9vlJ5PJGrgdau02o5O96mGPVELKS5rVyNRlpReaQm77kPXAHPE2MwS0WOR0v4pOTuxypcF/SBi+YWnrjHxXkAAAA=',
  '/works/flow/05-palette.webp': 'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAACwAQCdASoMAAMAA4BaJZQC7AD0qdyAAP7rNvWzp6u/I/zPOFoE6/iiIpE0KODEAAA=',
  '/works/flow/06-fonts.webp': 'data:image/webp;base64,UklGRioAAABXRUJQVlA4IB4AAAAwAQCdASoMAAoAA4BaJaQAA3AA/vTp7U0sFeOIgAA=',
  '/works/flow/07-concepts.webp': 'data:image/webp;base64,UklGRlgAAABXRUJQVlA4IEwAAACQAQCdASoMAAgAA4BaJQAASz4DeGAA/vZFXfH4IvnYPdeErDQkXe+nyisRPUbbj0nIjqgLaHwpgcf6oKZkYJKaUwGQQrPCAF41AAAA',
  '/works/flow/08-page.webp': 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQAwCdASoMABkAPu1kqU2ppaQiMAgBMB2JQBibBC2EkzvB9G7sU6AA/tx+YHmhEhB7H1Z3S0Vm2rptoJBHUn6EcrGJW6JLrbDesPQWWAadlMaYXm3Jf2yuwkgmhwj05lPO7eG0x1Iw2AItEiAAAA==',
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
