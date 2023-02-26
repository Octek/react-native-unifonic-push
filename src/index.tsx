import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export enum NotificationReadType {
    read = "read",
    received = "received",
}

export class UnifonicPush {
    private _axiosInstance: AxiosInstance;

    public get storedAppId() {
        return (async () => {
            return await AsyncStorage.getItem("app_id");
        })();
    }

    public get storedIdentifier() {
        return (async () => {
            return await AsyncStorage.getItem("identifier");
        })();
    }

    public get sdkToken() {
        return (async () => {
            return await AsyncStorage.getItem("sdk_token");
        })();
    }

    public get pushToken() {
        return (async () => {
            return await AsyncStorage.getItem("address");
        })();
    }

    private async toggleNotification(enable: boolean): Promise<boolean> {
        await axios.post(
            "bindings/update_status",
            {
                address: this.pushToken,
                status: enable ? "enabled" : "disabled",
            },
            {
                headers: {
                    "Authorization": `Bearer ${await this.sdkToken}`,
                    "x-notice-app-id": await this.storedAppId,
                },
            }
        );
        return true;
    }

    constructor(private isDev = false) {
        this._axiosInstance = axios.create({
            baseURL: this.isDev
                ? "https://push.integration.api.dev.unifonic.com/devices/api"
                : "https://push.api.preprod.cloud.unifonic.com/devices/api",
        });
    }

    async register(appId: string, identifier: string): Promise<string | null> {
        if (appId === (await this.storedAppId)) {
            return this.sdkToken;
        } else {
            const response = await this._axiosInstance.post("apps/register", {
                app_id: appId,
                identifier: identifier,
            });
            await AsyncStorage.setItem("app_id", appId);
            await AsyncStorage.setItem("identifier", identifier);
            await AsyncStorage.setItem("sdk_token", response.data.sdk_token);
            return response.data.sdk_token;
        }
    }

    async enableNotification(): Promise<boolean> {
        return this.toggleNotification(true);
    }

    async disableNotification(): Promise<boolean> {
        return this.toggleNotification(false);
    }

    async markNotification(
        type: NotificationReadType,
        messageId: string
    ): Promise<boolean> {
        if (!this.storedAppId) {
            return false;
        }
        await this._axiosInstance.post(
            type === NotificationReadType.read
                ? "notifications/read"
                : "notifications/received",
            {
                message_id: messageId,
            }
        );
        return true;
    }

    async saveToken(pushToken: string): Promise<boolean> {
        if (!this.storedIdentifier) {
            return false;
        }
        let create = true;
        if (this.pushToken != null) {
            if (pushToken === (await this.pushToken)) {
                return false;
            }
            create = false;
        }
        if (this.storedAppId === null) {
            return false;
        }
        const data = create
            ? {
                  address: pushToken,
                  identifier: this.storedIdentifier,
                  type: Platform.OS === "ios" ? "apn" : "fcm",
              }
            : {
                  old_address: this.pushToken,
                  address: pushToken,
              };
        await this._axiosInstance.post(
            create ? "bindings" : "bindings/refresh",
            data
        );
        await AsyncStorage.setItem("address", pushToken);
        return true;
    }
}
