import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ImagesAssets } from "../../assets";
import data from "../../data";

export default function Matchs() {
  return (
    <View style={styles.matchsContainer}>
      <Text style={styles.title}>Matchs</Text>
      <View style={styles.matchsSlider}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Image style={styles.iconButton} source={data.imgUrl} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  matchsContainer: {
    backgroundColor: "red",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
