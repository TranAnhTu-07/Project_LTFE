import { configureStore } from '@reduxjs/toolkit'
import conversations from './conversationsSlice.ts'

export const store = configureStore({
    reducer: {
        conversations,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch