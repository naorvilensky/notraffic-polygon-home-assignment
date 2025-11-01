import React, { useCallback, useState } from 'react';

import { RequestQueueContext, RequestState } from './useRequestQueue';

export const RequestQueueProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, setState] = useState<RequestState>({
		creating: 0,
		fetching: 0,
		removing: 0,
	});

	const increment = useCallback(
		(key: keyof RequestState) => setState(prev => ({ ...prev, [key]: prev[key] + 1 })),
		[]
	);

	const decrement = useCallback(
		(key: keyof RequestState) =>
			setState(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) })),
		[]
	);

	return (
		<RequestQueueContext.Provider value={{ ...state, increment, decrement }}>
			{children}
		</RequestQueueContext.Provider>
	);
};
