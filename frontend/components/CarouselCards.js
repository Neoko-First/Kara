import React from "react";
import { View, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselCardItem, {
  SLIDER_WIDTH,
  SLIDER_HEIGHT,
  ITEM_WIDTH,
} from "./CarouselCardItem";
import data from "../data";

export const DOT_WIDTH = SLIDER_WIDTH / 3 - 100;

const CarouselCards = () => {
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  return (
    <View style={styles.container}>
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        containerStyle={{
          backgroundColor: "transparent",
          position: "absolute",
          top: -20,
          zIndex: 1,
          width: ITEM_WIDTH,
        }}
        dotStyle={{
          width: DOT_WIDTH,
          height: 4,
          borderRadius: 5,
          backgroundColor: "white",
          marginHorizontal: 0,
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
        tappableDots={true}
      />
      <Carousel
        layout="tinder"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1d1d1d",
    width: "100%",
    height: "100%",
    position: "relative",
    paddingBottom: 100,
  },
});

export default CarouselCards;
