import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { addPlaceToFavorites } from "../../apis/places";

const FavoriteButton = ({ placeId, initialFavorited = false }) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  const mutation = useMutation((placeId) => addPlaceToFavorites(placeId), {
    onSuccess: () => {
      // toggle
      setIsFavorited((prev) => !prev);
    },
  });

  const handleFavorite = () => {
    mutation.mutate(placeId);
  };
  return (
    <View>
      <TouchableOpacity onPress={handleFavorite} style={styles.button}>
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={30}
          color={isFavorited ? "red" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
