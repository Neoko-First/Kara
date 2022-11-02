import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ImagesAssets } from "../assets";

export default function Header({ navigation }) {
  return (
    <View style={styles.header}>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Profile")}
      >
        <Image style={styles.iconButton} source={ImagesAssets.Profil} />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#141414",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  banner: {
    height: 48,
    width: 100,
  },
  iconButton: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
});
