import { StyleSheet, View } from "react-native";
import NavFooter from "../components/NavFooter";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={StyleSheet.container}>
      <NavFooter navigation={navigation} />
    </View>
  );
}
