import {create} from "zustand/react";

interface MapStore {
    screenshotTrigger: number,
    triggerScreenshot: () => void,
    setScreenshotTrigger: (v: number) => void,
    mapScreenshot: string | null,
    setMapScreenshot: (screenshot: string | null) => void,
}

export const useMapStore = create<MapStore>((set) => ({
    screenshotTrigger: 0,
    triggerScreenshot: () => set((state) => ({
        screenshotTrigger: state.screenshotTrigger + 1
    })),
    setScreenshotTrigger: (v: number) => set({ screenshotTrigger: v }),
    mapScreenshot: null,
    setMapScreenshot: (screenshot: string | null) => set({ mapScreenshot: screenshot }),
}));