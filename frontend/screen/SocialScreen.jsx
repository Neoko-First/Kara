import { StyleSheet, View } from "react-native";
import NavFooter from "../components/NavFooter";
import Matchs from "../components/socials/Matchs";
// import Messages from "../components/socials/Messages";

export default function SocialScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.socialContainer}>
        <Matchs />
        {/* <Messages /> */}
      </View>
      <NavFooter navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#141414",
    display: "flex",
  },
});
