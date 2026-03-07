import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type { RootState } from '../';

/**
 * Base type for async thunks in the application.
 * This provides consistent typing for thunk actions.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
