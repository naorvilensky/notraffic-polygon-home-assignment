import { api, queue } from '@api/client';
import type { Polygon } from '@interfaces/polygon.interface';

export async function fetchPolygons(): Promise<Polygon[]> {
	return queue.add(async () => {
		const res = await api.get<Polygon[]>('/polygons');
		return res.data;
	});
}

export async function createPolygon(polygon: Omit<Polygon, 'id'>): Promise<Polygon> {
	return queue.add(async () => {
		const res = await api.post<Polygon>('/polygons', polygon);
		return res.data;
	});
}

export async function removePolygon(id: number): Promise<void> {
	return queue.add(async () => {
		await api.delete(`/polygons/${id}`);
	});
}
