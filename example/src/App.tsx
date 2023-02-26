import * as React from "react";

import { StyleSheet, View, Text } from "react-native";
import { UnifonicPush } from "react-native-unifonic-push";

export default function App() {
    const [token, setToken] = React.useState<string | null>();

    React.useEffect(() => {
        (async () => {
            const unifonicPush = new UnifonicPush(true);
            const t = await unifonicPush.register("appId", "identifier");
            setToken(t);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Result: {token}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
