import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import taskReducer from './reducers/taskSlice';

/**
 * Redux store configuration.
 * All slice reducers should be added to the reducer object.
 */
export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

