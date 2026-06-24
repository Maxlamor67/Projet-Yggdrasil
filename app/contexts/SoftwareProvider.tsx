import {create} from "zustand/index";

type Software = {
    ip?: string | null;
    transferId?: string | null;
    projectId?: string | null;
    httpPort?: number | null;
};

interface SoftwareState {
    software: Software;
    setSoftware: (software: Software) => void;
}

export const useSoftwareStore = create<SoftwareState>((set) => ({
    software: {
        ip: null,
        transferId: null,
        projectId: null,
        httpPort: null,
    },
    setSoftware: (software) => set({ software }),
}));

export const getSoftwareBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_NODE_ENV === 'production') {
        return process.env.EXPO_PUBLIC_PROD_API_URL!;
    }
    const software = useSoftwareStore.getState().software;
    if (!software?.ip || !software?.httpPort) return null;
    return `http://${software.ip}:${software.httpPort}`;
}