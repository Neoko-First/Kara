import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const SLIDER_HEIGHT = Dimensions.get("window").height;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
export const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT * 0.8);

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image source={{ uri: item.imgUrl }} style={styles.image} />
      <View style={styles.data}>
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.date}</Text>
        <Text style={styles.body}>{item.power} cv</Text>
      </View>
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
    backgroundColor:
      "linear-gradient(0deg, rgba(87, 0, 140, 0.5777661406) 0%, rgba(14, 9, 9, 0) 100%)",
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
