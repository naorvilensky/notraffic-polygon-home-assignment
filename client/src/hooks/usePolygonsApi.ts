// src/hooks/usePolygons.ts
import { useCallback } from 'react';

import { useRequestQueue } from '@context/useRequestQueue';

import { fetchPolygons, createPolygon, removePolygon } from '../api/polygons';
import type { Polygon } from '../interfaces/polygon.interface';

export const usePolygonsApi = () => {
	const { increment, decrement, isFetching, isCreating, isRemoving } = useRequestQueue();

	const fetch: () => Promise<Polygon[]> = useCallback(async () => {
		increment('fetching');
		try {
			return await fetchPolygons();
		} finally {
			decrement('fetching');
		}
	}, [increment, decrement]);

	const create: (polygon: Polygon) => Promise<Polygon> = async (polygon: Polygon) => {
		increment('creating');
		try {
			return await createPolygon(polygon);
		} finally {
			decrement('creating');
		}
	};

	const remove: (id: number) => Promise<void> = async (id: number) => {
		increment('removing');
		try {
			await removePolygon(id);
		} finally {
			decrement('removing');
		}
	};

	return {
		fetch,
		create,
		remove,
		isFetching,
		isCreating,
		isRemoving,
	};
};
