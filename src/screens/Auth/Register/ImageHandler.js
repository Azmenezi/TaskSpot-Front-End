import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { useMutation } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import { register } from "../../../apis/auth";
import ImageHandler from "../../../components/ImagePickerHandler";
import LoadingPage from "../../../components/Skeleton/LoadingPage";
import UserContext from "../../../contexts/UserContext";
import { COLORS } from "../../../constants/themes";
import { storeToken } from "../../../apis/storage";

const RegisterImage = ({ route, navigation }) => {
  const { username, password, email } = route.params;
  const [userInfo, setUserInfo] = useState({});
  const [image, setImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const { setUser } = useContext(UserContext);

  // Get the currently active theme

  const {
    mutate: registerFunction,
    error,
    isLoading,
  } = useMutation({
    mutationFn: () => {
      return register({ ...userInfo, image });
    },
    onSuccess: (data) => {
      const decodeUser = jwt_decode(data.token);
      setUser(decodeUser);
      storeToken(data.token);
    },
    onError: (err) => {
      console.log("========>", err);
    },
  });

  useEffect(() => {
    setUserInfo({ ...userInfo, username, password, email });
  }, []);

  const handleRegister = () => {
    // Perform registration logic here, such as calling an API
    // setUserInfo({ ...userInfo, image });
    registerFunction();
  };

  return (
    <View style={styles.container}>
      {isLoading && <LoadingPage />}
      <View style={styles.textContainer}>
        <Text
          style={{
            color: COLORS.black,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Pick an image
        </Text>
        <Text
          style={{
            color: COLORS.black,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Pick an image for your new account. You can always change it later.
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <ImageHandler image={image} setImage={setImage} />
        <View style={{ marginTop: 8 }}>
          <Button title="Register" onPress={handleRegister} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    marginTop: 96,
    marginBottom: 16,
    width: "80%",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: "-15%", // You may need to adjust this value depending on the device
  },
});

export default RegisterImage;
