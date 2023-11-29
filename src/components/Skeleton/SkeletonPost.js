import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/themes";

const SkeletonPost = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageSkeleton}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: COLORS.lightestGray,
    margin: 10,
    overflow: "hidden",
  },
  imageSkeleton: {
    width: "100%",
    height: "100%",
    // backgroundColor: "#f0f0f0",
    backgroundColor: COLORS.lightestGray,
  },
});

export default SkeletonPost;
