import { StyleSheet, Text, View } from "react-native";

export default function Messages() {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.messageList}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 20,
    backgroundColor: "green",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
