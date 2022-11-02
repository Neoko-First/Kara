import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ImagesAssets } from "../assets";

export default function NavFooter({ navigation }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Image style={styles.iconButton} source={ImagesAssets.Home} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Social")}
      >
        <Image style={styles.iconButton} source={ImagesAssets.Social} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#141414",
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 0,
  },
  button: {
    height: 35,
    width: 35,
  },
  iconButton: {
    height: 35,
    width: 35,
  },
});
