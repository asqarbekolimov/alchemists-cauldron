const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export type IconName =
  | 'book'
  | 'clock'
  | 'close'
  | 'droplet'
  | 'feather'
  | 'flask'
  | 'gear'
  | 'heart'
  | 'leaf'
  | 'pause'
  | 'slime'
  | 'snowflake'
  | 'spark'
  | 'thermometer'
  | 'trophy'
  | 'void';

const ICON_PATHS: Record<IconName, string> = {
  book: 'M12 6.4C10.5 4.9 8.4 4.3 6 4.3c-1.1 0-2.1.1-3 .4V19c.9-.3 1.9-.4 3-.4 2.4 0 4.5.6 6 2.1 1.5-1.5 3.6-2.1 6-2.1 1.1 0 2.1.1 3 .4V4.7c-.9-.3-1.9-.4-3-.4-2.4 0-4.5.6-6 2.1Zm0 12.2c-1.4-1-3.2-1.5-5-1.5V6.2c1.8 0 3.7.5 5 1.5v10.9Z',
  clock:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 3v5.6l4.4 2.6 1-1.7-3.4-2V7h-2Z',
  close:
    'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z',
  droplet: 'M12 2.2c3.3 3.8 7 8.4 7 12a7 7 0 0 1-14 0c0-3.6 3.7-8.2 7-12Z',
  feather:
    'M20.5 2.5c-7.5.6-12.6 4.6-14.4 10.1L4 19l1.5 1 .8-2.2c1 .3 2.1.5 3.2.5 6.6 0 11-4.9 11-12 0-1.4-.1-2.6 0-3.8Zm-11.6 13.4c.9-4.1 3.7-7.3 8-9.3-3.7 2.8-6.2 5.7-7.1 9.3H8.9Z',
  flask:
    'M9 2h6v2h-1v5.2l3.8 7.6A2.6 2.6 0 0 1 15.5 21h-7a2.6 2.6 0 0 1-2.3-4.2L10 9.2V4H9V2Zm2 2v5.6l-3 6h8l-3-6V4h-2Z',
  gear: 'M19.1 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2-1.6c.2-.1.2-.4.1-.6l-1.9-3.3c-.1-.2-.4-.3-.6-.2l-2.4 1c-.5-.4-1-.7-1.6-.9l-.4-2.5c0-.3-.2-.5-.5-.5h-3.8c-.3 0-.5.2-.5.5l-.4 2.5c-.6.2-1.1.5-1.6.9l-2.4-1c-.2-.1-.5 0-.6.2L2.7 8.9c-.1.2-.1.5.1.6l2 1.6c0 .3-.1.6-.1.9s0 .6.1.9l-2 1.6c-.2.1-.2.4-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1 .7 1.6.9l.4 2.5c0 .3.2.5.5.5h3.8c.3 0 .5-.2.5-.5l.4-2.5c.6-.2 1.1-.5 1.6-.9l2.4 1c.2.1.5 0 .6-.2l1.9-3.3c.1-.2.1-.5-.1-.6l-2-1.6ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z',
  heart:
    'M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z',
  leaf: 'M4 20C4 10.6 10.6 4 20 4c0 9.4-6.6 16-16 16Zm3-3.2c3.3-1 6-3.3 7.9-6.5-2.9 2.2-5.5 4.4-7.9 6.5Z',
  pause: 'M7 4h4v16H7V4Zm6 0h4v16h-4V4Z',
  slime:
    'M12 2C10.5 5.5 5.5 9.5 5.5 13.5a6.5 6.5 0 0 0 13 0C18.5 9.5 13.5 5.5 12 2ZM9.5 13a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Zm5 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z',
  snowflake:
    'M11 2h2v6.2l4.4-2.5 1 1.7L14 10l4.4 2.6-1 1.7L13 11.8V18h-2v-6.2l-4.4 2.5-1-1.7L10 10 5.6 7.4l1-1.7L11 8.2V2Z',
  spark: 'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z',
  thermometer:
    'M12 2a3 3 0 0 0-3 3v8.35a5.5 5.5 0 1 0 6 0V5a3 3 0 0 0-3-3Zm0 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
  trophy:
    'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2ZM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8Zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1Z',
  void: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Z',
};

function isIconName(name: string): name is IconName {
  return Object.hasOwn(ICON_PATHS, name);
}

// Creates a decorative inline SVG icon. Icons are hidden from assistive tech.
export function icon(name: IconName, className = 'icon'): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', className);

  const path = document.createElementNS(SVG_NAMESPACE, 'path');
  path.setAttribute('d', ICON_PATHS[name]);
  path.setAttribute('fill', 'currentColor');
  path.setAttribute('fill-rule', 'evenodd');
  svg.append(path);

  return svg;
}

// Resolves the catalogue `icon` field to a typed icon, with a safe fallback.
export function ingredientIcon(name: string, className = 'card__glyph'): SVGSVGElement {
  return icon(isIconName(name) ? name : 'flask', className);
}
