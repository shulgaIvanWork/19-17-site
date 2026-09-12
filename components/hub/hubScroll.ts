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
let chaseTo = 0;
let chaseFrom = 0;
let chaseStart = 0;
let chaseMs = 340;
let chaseMode: 'ease' | 'chase' | null = null;
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

function scrollToNode(node: HTMLElement) {
  markJump(node);
  chaseMode = 'ease';
  const target = yOf(node);
  lockBehavior();
  const tick = ++scrollTick;

  const finish = () => {
    if (tick !== scrollTick) return;
    window.scrollTo(0, target);
    settleJump();
  };

  const from = window.scrollY;
  const dist = target - from;
  if (reducedMotion() || Math.abs(dist) < 2) {
    finish();
    return;
  }

  const ms = durationFor(dist);
  const started = performance.now();

  const step = (now: number) => {
    if (tick !== scrollTick) return;
    const t = Math.min(1, (now - started) / ms);
    window.scrollTo(0, from + dist * easeTo(t));
    if (t < 1) {
      window.requestAnimationFrame(step);
      return;
    }
    finish();
  };

  window.requestAnimationFrame(step);
}

/** Один цикл с тем же ease, что у клика. Новая точка только меняет цель
 *  и перезапускает кривую с текущей позиции — без телепорта на 0.28 за кадр. */
function chaseToNode(node: HTMLElement) {
  const target = yOf(node);
  if (chaseMode === 'chase' && Math.abs(chaseTo - target) < 2) return;
  markJump(node);
  chaseTo = target;
  chaseFrom = window.scrollY;
  chaseStart = performance.now();
  chaseMs = durationFor(chaseTo - chaseFrom);
  lockBehavior();
  if (chaseMode === 'chase') return;
  chaseMode = 'chase';
  const tick = ++scrollTick;
  const step = (now: number) => {
    if (tick !== scrollTick) return;
    const dist = chaseTo - chaseFrom;
    if (reducedMotion() || Math.abs(dist) < 2) {
      window.scrollTo(0, chaseTo);
      settleJump();
      return;
    }
    const t = Math.min(1, (now - chaseStart) / chaseMs);
    window.scrollTo(0, chaseFrom + dist * easeTo(t));
    if (t < 1) {
      window.requestAnimationFrame(step);
      return;
    }
    window.scrollTo(0, chaseTo);
    settleJump();
  };
  window.requestAnimationFrame(step);
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

/** Прокрутка к якорю из адреса. Возвращает функцию отмены.
 *
 *  Если раздел еще не в DOM, одна попытка на следующем кадре. Второй проход -
 *  после загрузки шрифтов: подмена шрифта сдвигает блоки, и цель уезжает.
 *  Повтор делается, только если посетитель за это время не прокручивал сам,
 *  иначе он выдернул бы человека обратно. */
export function scrollToLocationHash(): () => void {
  if (menuScroll) return () => {};

  let cancelled = false;
  let frame: number | null = null;

  const go = () => {
    const id = window.location.hash.replace(/^#/, '');
    const node = id ? document.getElementById(id) : null;
    if (!node) return false;
    node.scrollIntoView({ behavior: 'instant', block: 'start' });
    return true;
  };

  const settle = () => {
    const landed = window.scrollY;
    document.fonts?.ready.then(() => {
      if (!cancelled && Math.abs(window.scrollY - landed) < 2) go();
    });
  };

  if (go()) {
    settle();
  } else if (window.location.hash) {
    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (!cancelled && go()) settle();
    });
  }

  return () => {
    cancelled = true;
    if (frame !== null) window.cancelAnimationFrame(frame);
  };
}
