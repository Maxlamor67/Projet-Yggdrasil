import { createAuthClient } from "better-auth/react"
import {adminClient, usernameClient} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_HTTP_API_URL as string,
    basePath: 'auth',
    plugins: [
        adminClient(),
        usernameClient(),
    ],
    $InferAuth: {
        advanced: {
            disableOriginCheck: true,
        },
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    returned: true,
                },
                phone: {
                    type: "string",
                    returned: true,
                    required: false,
                },
            },
        },
    },
})
