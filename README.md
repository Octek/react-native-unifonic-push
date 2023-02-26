# react-native-unifonic-push

React native wrapper library for Unifonic Push

## Installation

```sh
npm install react-native-unifonic-push
```
OR

```sh
yarn add react-native-unifonic-push
```

## Usage

```js
import { UnifonicPush } from 'react-native-unifonic-push';

// ...

const unifonicPush = new UnifonicPush(true);
const token = await unifonicPush.register("appId", "identifier");
```

## API

The library exposes a single class `UnifonicPush`
The class has the following attributes and methods:

### Constructor
constructor(isDev = false)
`isDev` => Optional boolean parameter to connect to development server. Defaults to `false`

### Attributes
1. `storedAppId` => returns the application id stored locally
2. `storedIdentifier` => returns the identifier stored locally
3. `sdkToken` => returns the sdk token stored locally
4. `pushToken` => returns the push token stored locally

### Methods
1. `register` => Registers your app with Unifonic
   Parameters:
   a. `appId`: Refers to the App ID you receive from Unifonic
   b. `identifier`: A unique identifier
   Returns:
   `sdkToken`: A token that you can use as authorization in subsequent requests
2. `markNotification` => Mark a notification as either `read` or `received`
   Parameters:
   a. `type`:  NotificationReadType (read/received)
   b. `messageId`: Message ID received in push notification's payload
   Returns:
   `boolean`: `true` in case of success, `false` otherwise
3. `enableNotification`: Enables the notifications for the current device
   Returns:
   `boolean`: `true` in case of success, `false` otherwise
4. `disableNotification`: Disables the notifications for the current device
   Returns:
   `boolean`: `true` in case of success, `false` otherwise
5. `saveToken`: Sends the push-token to Unifonic backend
   Parameters:
   `pushToken`: `apn` in case of iOS, `fcm` in case of Android
   Returns:
   `boolean': `true` in case of success, `false` otherwise


## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
