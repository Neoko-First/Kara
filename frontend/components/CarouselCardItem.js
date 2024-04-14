import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const SLIDER_HEIGHT = Dimensions.get("window").height;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
export const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT * 0.8);

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <LinearGradient
        colors={["transparent", "#6802a3"]}
        style={styles.data}
      >
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.date}</Text>
        <Text style={styles.body}>{item.power} cv</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  data: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  body: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default CarouselCardItem;
