import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Conversation } from '../types.ts'

type State = {
    list: Conversation[]
    activeId: string | null
    loading: boolean
    error: string
}

const initialState: State = {
    list: [],
    activeId: null,
    loading: false,
    error: '',
}

const slice = createSlice({
    name: 'conversations',
    initialState,
    reducers: {
        setActive(state, action: PayloadAction<string | null>) {
            state.activeId = action.payload
        },
        addConversation(state, action: PayloadAction<Conversation>) {
            if (!state.list.some((c) => c.id === action.payload.id)) {
                state.list.unshift(action.payload)
            }
            state.activeId = action.payload.id
        },
        removeConversation(state, action: PayloadAction<string>) {
            state.list = state.list.filter((c) => c.id !== action.payload)
            if (state.activeId === action.payload) state.activeId = null
        },
    },
})

export const { setActive, addConversation, removeConversation } = slice.actions
export default slice.reducer