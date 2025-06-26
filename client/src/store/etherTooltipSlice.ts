import { createSlice } from '@reduxjs/toolkit';

interface EtherTooltipState {
  visible: boolean;
}

const initialState: EtherTooltipState = {
  visible: false,
};

const etherTooltipSlice = createSlice({
  name: 'etherTooltip',
  initialState,
  reducers: {
    showTooltip: (state) => { state.visible = true; },
    hideTooltip: (state) => { state.visible = false; },
    toggleTooltip: (state) => { state.visible = !state.visible; },
  },
});

export const { showTooltip, hideTooltip, toggleTooltip } = etherTooltipSlice.actions;
export default etherTooltipSlice.reducer; 