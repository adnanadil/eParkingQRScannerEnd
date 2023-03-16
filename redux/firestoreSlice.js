import { createSlice } from "@reduxjs/toolkit";

export const firestoreSlice = createSlice({
  name: "firestoreSlice",
  initialState: {
    parkingLots: [],
    parkingLotsLoading: true,
    currentlySelectedParkingLot: [],
    parkingSlotsInChosenParkingLot: [],
    parkingSlotsuID: "",
    parkingSlotName: "",
    costPerHour: 1
  },

  reducers: {
    updateParkingLots: (state, action) => {
      state.parkingLots =  action.payload;
    },
    updateParkingLotsLoading: (state, action) => {
      state.parkingLotsLoading = action.payload;
    },
    updateCurrentlySelectedParkingLot: (state, action) => {
        state.currentlySelectedParkingLot = action.payload;
    },
    clearCurrentlySelectedParkingLot: (state, action) => {
        state.currentlySelectedParkingLot = [];
    },
    updateParkingSlotsInChosenParkingLot: (state, action) => {
        state.parkingSlotsInChosenParkingLot = action.payload;
    },
    updateParkingSlotsuID: (state, action) => {
        state.parkingSlotsuID = action.payload;
    },
    updateParkingSlotName: (state, action) => {
        state.parkingSlotName = action.payload;
    },
    updateParkingCostPerHour: (state, action) => {
      state.costPerHour = action.payload;
    },
  },
});

export const {
    updateParkingLots,
    updateParkingLotsLoading,
    updateCurrentlySelectedParkingLot,
    clearCurrentlySelectedParkingLot,
    updateParkingSlotsInChosenParkingLot,
    updateParkingSlotsuID,
    updateParkingCostPerHour,
    updateParkingSlotName
} = firestoreSlice.actions;

export default firestoreSlice.reducer;
