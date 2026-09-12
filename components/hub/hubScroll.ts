/** Прыжки по разделам хаба: прокрутка, закрепление раздела и подписки.
 *
 *  Модуль общий для трех потребителей: навигации по разделам (components/hub),
 *  3D-героев (components/hero) и сцен (components/scenes). Раньше он лежал в
 *  components/nav, и получалось, что папка меню управляет анимацией 3D.
 *
 *  Состояние держится в переменных модуля, а не в React: прокрутка идет по
 *  кадрам, и перерисовка на каждый кадр здесь не нужна. Кто на что подписан:
 *  onHubJumpStart - начало прыжка, onHubJumpEnd - конец, onHubPin - смена
 *  закрепленного раздела. */

/** Прыжок по якорю на текущей странице: Next не прокручивает к якорю, если
 *  страница не меняется. Возвращает false, если ссылка ведет на другую
 *  страницу или якоря нет, - тогда работает обычная навигация.
 *  pushState не порождает hashchange, поэтому событие отправляется вручную:
 *  на него подписаны useHubSectionHash и ScrollToHash. */
let menuScroll = false;
let pinnedId = '';
let jumping = false;
let scrollTick = 0;
let railDrag = false;
let jumpNode: HTMLElement | null = null;
let jumpFrom = 0;
let jumpStart = 0;
let jumpMs = 340;
let chaseMode: 'ease' | 'chase' | null = null;
/** Кадры доводки после конца кривой: см. startJump. */
const LAND_FRAMES = 3;
let pinFrame = 0;
let jumpDir: -1 | 0 | 1 = 0;
/** Длительность позы 3D при прыжке. Кивок — только после неё. */
export const HUB_POSE_MS = 1040;
let railHeld = false;
let railHeldBound = false;
const jumpEnd = new Set<() => void>();
const jumpBegin = new Set<(id: string, dir: -1 | 1) => void>();
const pinNotify = new Set<(id: string) => void>();

export function pinnedHubSection() {
  return pinnedId;
}

export function isHubJumping() {
  return jumping;
}

export function onHubJumpEnd(fn: () => void) {
  jumpEnd.add(fn);
  return () => jumpEnd.delete(fn);
}

export function onHubJumpStart(fn: (id: string, dir: -1 | 1) => void) {
  jumpBegin.add(fn);
  return () => jumpBegin.delete(fn);
}

export function hubJumpDir() {
  return jumpDir;
}

/** Рельс держит pin, пока палец на точке: иначе observer дергает hash на каждом кадре. */
export function setHubRailDrag(on: boolean) {
  railDrag = on;
  if (!on && chaseMode === null) {
    if (pinnedId) writeHubHash(pinnedId);
    window.requestAnimationFrame(() => unpinSection());
  }
}

export function onHubPin(fn: (id: string) => void) {
  pinNotify.add(fn);
  return () => pinNotify.delete(fn);
}

/** Пока ЛКМ на рельсе, и пока курсор над ним, 3D его не видит. */
export function setHubRailHeld(on: boolean) {
  railHeld = on;
  if (on) bindRailHeld();
}

function bindRailHeld() {
  if (railHeldBound) return;
  railHeldBound = true;
  const up = () => {
    railHeld = false;
  };
  window.addEventListener('pointerup', up, true);
  window.addEventListener('pointercancel', up, true);
}

export function hubRailBlocksLook(clientX?: number, clientY?: number) {
  if (railHeld) return true;
  if (clientX === undefined || clientY === undefined || !Number.isFinite(clientX)) return false;
  const hit = document.elementFromPoint(clientX, clientY);
  return Boolean(hit?.closest('[data-hub-rail]'));
}

function headerOffset() {
  const header = document.querySelector<HTMLElement>('[data-header-glow]');
  return header?.getBoundingClientRect().height ?? 56;
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function pinSection(id: string) {
  jumping = true;
  if (pinnedId === id) return;
  pinnedId = id;
  if (pinFrame) return;
  pinFrame = window.requestAnimationFrame(() => {
    pinFrame = 0;
    for (const fn of pinNotify) fn(pinnedId);
  });
}

function unpinSection() {
  jumping = false;
  pinnedId = '';
  if (pinFrame) {
    window.cancelAnimationFrame(pinFrame);
    pinFrame = 0;
  }
  for (const fn of jumpEnd) fn();
}

let savedBehavior: string | undefined;
let savedAnchor: string | undefined;

function lockBehavior() {
  const html = document.documentElement;
  if (savedBehavior === undefined) savedBehavior = html.style.scrollBehavior;
  if (savedAnchor === undefined) savedAnchor = html.style.overflowAnchor;
  html.style.scrollBehavior = 'auto';
  html.style.overflowAnchor = 'none';
}

function unlockBehavior() {
  if (savedBehavior === undefined) return;
  document.documentElement.style.scrollBehavior = savedBehavior;
  document.documentElement.style.overflowAnchor = savedAnchor ?? '';
  savedBehavior = undefined;
  savedAnchor = undefined;
}

function easeTo(t: number) {
  const split = 0.8;
  const cruise = 0.92;
  if (t <= split) return (cruise * t) / split;
  const u = (t - split) / (1 - split);
  return cruise + (1 - cruise) * (1 - (1 - u) ** 3);
}

function durationFor(dist: number) {
  return Math.min(640, Math.max(340, 280 + Math.abs(dist) * 0.22));
}

function yOf(node: HTMLElement) {
  return Math.max(0, window.scrollY + node.getBoundingClientRect().top - headerOffset());
}

function markJump(node: HTMLElement) {
  const y = yOf(node);
  const dir: -1 | 1 = y >= window.scrollY - 1 ? 1 : -1;
  jumpDir = dir;
  for (const fn of jumpBegin) fn(pinnedId, dir);
}

function writeHubHash(id: string) {
  const next = `#${id}`;
  if (!id || window.location.hash === next) return;
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`);
}

function settleJump() {
  chaseMode = null;
  unlockBehavior();
  for (const fn of jumpEnd) fn();
  if (railDrag) return;
  if (pinnedId) writeHubHash(pinnedId);
  window.requestAnimationFrame(() => unpinSection());
}

/** Прыжок к разделу по кривой easeTo.
 *
 *  Цель пересчитывается на каждом кадре, а не один раз в начале. У .section стоит
 *  content-visibility: auto (globals.css), и раздел, который еще не отрисовывался,
 *  занимает 720px. По дороге разделы отрисовываются, почти все оказываются ниже,
 *  и страница укорачивается на тысячи пикселей. С целью, посчитанной заранее,
 *  прыжок с «Лендинга» на CRM заканчивался в футере, перелет 2325px (1440x900,
 *  свежая загрузка, 2026-09-13). После конца кривой еще LAND_FRAMES кадров
 *  доводки: разделы у места прибытия отрисовываются уже после прокрутки.
 *
 *  В режиме chase новая цель не перезапускает цикл, а меняет jumpNode и начало
 *  кривой: цикл подхватит ее на следующем кадре, без рывка. */
function startJump(node: HTMLElement, mode: 'ease' | 'chase') {
  markJump(node);
  jumpNode = node;
  jumpFrom = window.scrollY;
  jumpStart = performance.now();
  jumpMs = durationFor(yOf(node) - jumpFrom);
  lockBehavior();
  if (mode === 'chase' && chaseMode === 'chase') return;
  chaseMode = mode;
  const tick = ++scrollTick;
  let landing = 0;

  const step = (now: number) => {
    if (tick !== scrollTick || !jumpNode) return;
    const to = yOf(jumpNode);
    const done = reducedMotion() || Math.abs(to - jumpFrom) < 2;
    const t = done ? 1 : Math.min(1, (now - jumpStart) / jumpMs);
    if (t < 1) {
      landing = 0;
      window.scrollTo(0, jumpFrom + (to - jumpFrom) * easeTo(t));
      window.requestAnimationFrame(step);
      return;
    }
    window.scrollTo(0, to);
    if (landing < LAND_FRAMES) {
      landing += 1;
      window.requestAnimationFrame(step);
      return;
    }
    settleJump();
  };

  window.requestAnimationFrame(step);
}

function scrollToNode(node: HTMLElement) {
  startJump(node, 'ease');
}

/** Перетаскивание по рельсу: та же точка повторно не перезапускает прыжок. */
function chaseToNode(node: HTMLElement) {
  if (chaseMode === 'chase' && jumpNode === node) return;
  startJump(node, 'chase');
}

export function jumpHash(
  href: string,
  pathname: string,
  opts?: { replace?: boolean; chase?: boolean },
) {
  const [path, id] = href.split('#');
  if (!id || path !== pathname) return false;
  const node = document.getElementById(id);
  if (!node) return false;
  const same = pinnedId === id && jumping;
  pinSection(id);
  if (opts?.chase) {
    chaseToNode(node);
    return true;
  }
  scrollToNode(node);
  if (same && window.location.hash === `#${id}`) return true;
  menuScroll = true;
  if (opts?.replace) history.replaceState(null, '', href);
  else history.pushState(null, '', href);
  menuScroll = false;
  return true;
}

/** Кадров подряд без сдвига цели, после которых посадка на якорь закончена. */
const HASH_STABLE_FRAMES = 3;
/** Предел кадров на посадку, около секунды. */
const HASH_MAX_FRAMES = 60;

/** Прокрутка к якорю из адреса. Возвращает функцию отмены.
 *
 *  Посадка идет по кадрам, пока цель не простоит на месте HASH_STABLE_FRAMES
 *  кадров. Одной мгновенной прокрутки мало: разделы выше цели с
 *  content-visibility: auto отрисовываются уже после нее и сдвигают цель.
 *  С футера главной на /websites#multipage промах был 192px (390px, 2026-09-13).
 *  Место считается той же yOf, что и у прыжков по рельсу.
 *
 *  Если раздела еще нет в DOM, цикл ждет его на следующих кадрах. После
 *  загрузки шрифтов посадка повторяется: подмена шрифта сдвигает блоки. И цикл,
 *  и повтор останавливаются, если посетитель за это время прокрутил сам, иначе
 *  его выдернуло бы обратно. */
export function scrollToLocationHash(): () => void {
  if (menuScroll) return () => {};

  let cancelled = false;
  let frame: number | null = null;
  let frames = 0;
  let stable = 0;
  let placed = -1;

  const settle = () => {
    frame = null;
    if (cancelled) return;
    const id = window.location.hash.replace(/^#/, '');
    if (!id) return;
    if (placed >= 0 && Math.abs(window.scrollY - placed) > 2) return;
    const node = document.getElementById(id);
    if (node) {
      const target = yOf(node);
      if (Math.abs(window.scrollY - target) <= 1) {
        stable += 1;
      } else {
        stable = 0;
        window.scrollTo({ top: target, behavior: 'instant' });
      }
      placed = window.scrollY;
      if (stable >= HASH_STABLE_FRAMES) return;
    }
    frames += 1;
    if (frames < HASH_MAX_FRAMES) frame = window.requestAnimationFrame(settle);
  };

  settle();
  document.fonts?.ready.then(() => {
    if (cancelled || frame !== null) return;
    if (placed >= 0 && Math.abs(window.scrollY - placed) > 2) return;
    frames = 0;
    stable = 0;
    settle();
  });

  return () => {
    cancelled = true;
    if (frame !== null) window.cancelAnimationFrame(frame);
  };
}
