import type { ExpoConfig, ConfigContext } from 'expo/config';
import appJson from './app.json';
try {
    require('dotenv').config();
} catch (_) {
}

function getGoogleMapsApiKey(): string | undefined {
    return (
        process.env.GOOGLE_MAPS_API_KEY ??
        process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
        process.env.GOOGLE_MAPS_ANDROID_API_KEY ??
        process.env.GOOGLE_MAPS_IOS_API_KEY
    );
}

export default ({ config }: ConfigContext): ExpoConfig => {
    const ORS_API_KEY = process.env.ORS_API_KEY || process.env.OPENROUTESERVICE_KEY || null;
    const base = (appJson as any).expo as ExpoConfig;

    const googleMapsApiKey = getGoogleMapsApiKey();

    const isEasBuild =
        !!process.env.EAS_BUILD ||
        !!process.env.EAS_BUILD_PROFILE ||
        process.env.CI === 'true';

    if (!googleMapsApiKey) {
        const message =
            '[config] Missing Google Maps API key. Set GOOGLE_MAPS_API_KEY (recommended) for EAS builds to enable react-native-maps on Android.';
        if (isEasBuild) {
            throw new Error(message);
        }
        console.warn(message);
    }

    return {
        ...config,
        ...base,
        extra: {
            ...(base.extra || {}),
            ORS_API_KEY,
        },
        android: {
            ...base.android,
            config: {
                ...(base.android as any)?.config,
                googleMaps: {
                    apiKey: googleMapsApiKey,
                },
            },
        },
        ios: {
            ...base.ios,
            config: {
                ...(base.ios as any)?.config,
                googleMapsApiKey,
            },
        },
    };
};
