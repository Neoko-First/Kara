import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ImagesAssets } from "../assets";

export default function SocialFooter() {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Image style={styles.iconButton} source={ImagesAssets.Like} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image style={styles.iconButton} source={ImagesAssets.Dislike} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#1d1d1d",
    height: 50,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 50,
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
