import type { RgbColor } from 'react-colorful';

export function rgbWithAlpha(color: RgbColor, alpha: number): string {
	return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}
