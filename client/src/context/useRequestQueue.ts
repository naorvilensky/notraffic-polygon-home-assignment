import { createContext, useContext } from 'react';

export interface RequestState {
	fetching: number;
	creating: number;
	removing: number;
}

export interface RequestQueueContextValue extends RequestState {
	increment: (key: keyof RequestState) => void;
	decrement: (key: keyof RequestState) => void;
}

export interface UseRequestEvent {
	isCreating: boolean;
	isFetching: boolean;
	isRemoving: boolean;
	increment: (key: keyof RequestState) => void;
	decrement: (key: keyof RequestState) => void;
}

export const RequestQueueContext = createContext<RequestQueueContextValue | null>(null);

export const useRequestQueue: () => UseRequestEvent = () => {
	const context = useContext(RequestQueueContext);
	if (!context) throw new Error('useRequestQueue must be used within a RequestQueueProvider');

	const { creating, fetching, removing, increment, decrement } = context;

	const isCreating = creating > 0;
	const isFetching = fetching > 0;
	const isRemoving = removing > 0;

	return {
		isCreating,
		isFetching,
		isRemoving,
		increment,
		decrement,
	};
};
