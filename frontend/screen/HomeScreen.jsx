import { View, StyleSheet } from "react-native";
import CarouselCards from "../components/CarouselCards";
import NavFooter from "../components/NavFooter";
import SocialFooter from "../components/SocialFooter";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CarouselCards />
      <NavFooter navigation={navigation} />
      <SocialFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#1d1d1d",
    alignItems: "center",
    justifyContent: "center",
  },
});
