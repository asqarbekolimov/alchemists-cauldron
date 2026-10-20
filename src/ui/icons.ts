const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export type IconName =
  'book' | 'clock' | 'droplet' | 'flask' | 'gear' | 'heart' | 'spark' | 'thermometer';

const ICON_PATHS: Record<IconName, string> = {
  book: 'M12 6.4C10.5 4.9 8.4 4.3 6 4.3c-1.1 0-2.1.1-3 .4V19c.9-.3 1.9-.4 3-.4 2.4 0 4.5.6 6 2.1 1.5-1.5 3.6-2.1 6-2.1 1.1 0 2.1.1 3 .4V4.7c-.9-.3-1.9-.4-3-.4-2.4 0-4.5.6-6 2.1Zm0 12.2c-1.4-1-3.2-1.5-5-1.5V6.2c1.8 0 3.7.5 5 1.5v10.9Z',
  clock:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 3v5.6l4.4 2.6 1-1.7-3.4-2V7h-2Z',
  droplet: 'M12 2.2c3.3 3.8 7 8.4 7 12a7 7 0 0 1-14 0c0-3.6 3.7-8.2 7-12Z',
  flask:
    'M9 2h6v2h-1v5.2l3.8 7.6A2.6 2.6 0 0 1 15.5 21h-7a2.6 2.6 0 0 1-2.3-4.2L10 9.2V4H9V2Zm2 2v5.6l-3 6h8l-3-6V4h-2Z',
  gear: 'M19.1 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2-1.6c.2-.1.2-.4.1-.6l-1.9-3.3c-.1-.2-.4-.3-.6-.2l-2.4 1c-.5-.4-1-.7-1.6-.9l-.4-2.5c0-.3-.2-.5-.5-.5h-3.8c-.3 0-.5.2-.5.5l-.4 2.5c-.6.2-1.1.5-1.6.9l-2.4-1c-.2-.1-.5 0-.6.2L2.7 8.9c-.1.2-.1.5.1.6l2 1.6c0 .3-.1.6-.1.9s0 .6.1.9l-2 1.6c-.2.1-.2.4-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1 .7 1.6.9l.4 2.5c0 .3.2.5.5.5h3.8c.3 0 .5-.2.5-.5l.4-2.5c.6-.2 1.1-.5 1.6-.9l2.4 1c.2.1.5 0 .6-.2l1.9-3.3c.1-.2.1-.5-.1-.6l-2-1.6ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z',
  heart:
    'M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z',
  spark: 'M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z',
  thermometer:
    'M12 2a3 3 0 0 0-3 3v8.35a5.5 5.5 0 1 0 6 0V5a3 3 0 0 0-3-3Zm0 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z',
};

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
