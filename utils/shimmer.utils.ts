export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="shimmer-gradient" x1="0" x2="1" y1="0.5" y2="0.5">
      <stop stop-color="hsl(0 0% 87%)" offset="20%" />
      <stop stop-color="hsl(0 0% 76%)" offset="50%" />
      <stop stop-color="hsl(0 0% 87%)" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="hsl(0 0% 87%)" />
  <rect id="shimmer-rect" width="${w}" height="${h}" fill="url(#shimmer-gradient)">
    <animate 
      attributeName="x" 
      from="-${w}" 
      to="${w}" 
      dur="1s" 
      repeatCount="indefinite" 
    />
  </rect>
</svg>`;

const toBase64 = (str: string) =>
	typeof window === 'undefined' ?
		Buffer.from(str).toString('base64')
	:	window.btoa(str);

export const getShimmerDataUrl = (w: number, h: number) =>
	`data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
