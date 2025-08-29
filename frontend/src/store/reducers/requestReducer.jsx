import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import {
    createRequest,
    fetchMyRequests,
    fetchIncomingRequests,
    updateRequestStatus,
} from "../actions/requestActions";

const requestsAdapter = createEntityAdapter({
    selectId: (r) => r._id || r.id,
    sortComparer: (a, b) => (a.updatedAt || a.createdAt || "").localeCompare(b.updatedAt || b.createdAt || ""),
});

const initialState = requestsAdapter.getInitialState({
    loading: false,
    error: null,
    myLoading: false,
    incomingLoading: false,
    myError: null,
    incomingError: null,
});

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        clearRequestsError(state) {
            state.error = null;
            state.myError = null;
            state.incomingError = null;
        },
    },
    extraReducers: (builder) => {
        // Create
        builder
            .addCase(createRequest.pending, (state) => {
                state.error = null;
            })
            .addCase(createRequest.fulfilled, (state, { payload }) => {
                requestsAdapter.addOne(state, payload);
            })

            .addCase(createRequest.rejected, (state, { payload }) => {
                state.error = payload;
            });

        // My requests
        builder
            .addCase(fetchMyRequests.pending, (state) => {
                state.myLoading = true;
                state.myError = null;
            })
            .addCase(fetchMyRequests.fulfilled, (state, { payload }) => {
                state.myLoading = false;
                requestsAdapter.setAll(state, payload);
            })
            .addCase(fetchMyRequests.rejected, (state, { payload }) => {
                state.myLoading = false;
                state.myError = payload;
            });

        // Incoming requests
        builder
            .addCase(fetchIncomingRequests.pending, (state) => {
                state.incomingLoading = true;
                state.incomingError = null;
            })
            .addCase(fetchIncomingRequests.fulfilled, (state, { payload }) => {
                state.incomingLoading = false;
                requestsAdapter.setAll(state, payload);
            })
            .addCase(fetchIncomingRequests.rejected, (state, { payload }) => {
                state.incomingLoading = false;
                state.incomingError = payload;
            });

        // Update status
        builder
            .addCase(updateRequestStatus.fulfilled, (state, { payload }) => {
                requestsAdapter.upsertOne(state, payload);
            })
            .addCase(updateRequestStatus.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { clearRequestsError } = requestsSlice.actions;
export default requestsSlice.reducer;

// Selectors
export const {
    selectAll: selectAllRequests,
    selectById: selectRequestById,
    selectIds: selectRequestIds,
    selectEntities: selectRequestEntities,
} = requestsAdapter.getSelectors((state) => state.requests);
