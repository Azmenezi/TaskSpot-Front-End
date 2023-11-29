import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Yup from "yup";
import { checkUsername } from "../../../apis/auth";
import AppButton2 from "../../../components/Buttons/AppButton2";
import DisabledButton from "../../../components/Buttons/DisabledButton";
import LoadingPage from "../../../components/Skeleton/LoadingPage";
import { COLORS } from "../../../constants/themes";

const UsernameSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long.")
    .matches(
      /^[a-zA-Z0-9._]*$/,
      "can only contain letters numbers and underscores"
    )
    .required("Username is required."),
});

const RegisterUsername = ({ navigation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const { mutate: userNamechecker, isLoading } = useMutation({
    mutationFn: checkUsername,
    onSuccess: (data) => {
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
      if (data.message.includes("available")) {
        navigation.navigate("RegisterPassword", {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
        });
      }
    },
    onError: (err) => {
      // console.log("err", err);
    },
  });

  return (
    <Formik
      initialValues={{ username: "" }}
      validationSchema={UsernameSchema}
      onSubmit={(values) => {
        userNamechecker(values.username.toLowerCase());
        setUsername(values.username.toLowerCase());
        setEmail(values.email.toLowerCase());
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={{ flex: 1, alignItems: "center", marginVertical: 161 }}>
          {isLoading && <LoadingPage />}
          <View style={{ marginTop: 96, marginBottom: 16, width: "80%" }}>
            <Text
              style={{
                color: COLORS.black,
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Pick Username
            </Text>
            <Text
              style={{
                color: COLORS.black,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Choose a username for your new account. You can always change it
              later.
            </Text>
          </View>
          <TextInput
            style={{
              width: "88%",
              height: 45,
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: COLORS.lightGray,
              borderRadius: 15,
              backgroundColor: COLORS.white,
              color: COLORS.black,
            }}
            placeholder="Email"
            onBlur={handleBlur("email")}
            onChangeText={handleChange("email")}
            value={values.email}
            placeholderTextColor={COLORS.black}
          />
          <TextInput
            style={{
              width: "88%",
              height: 45,
              marginBottom: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: COLORS.lightGray,
              borderRadius: 15,
              backgroundColor: COLORS.white,
              color: COLORS.black,
            }}
            placeholder="Username"
            onBlur={handleBlur("username")}
            onChangeText={handleChange("username")}
            value={values.username}
            placeholderTextColor={COLORS.black}
          />
          {errors.username && touched.username && (
            <Text style={{ color: COLORS.danger }}>{errors.username}</Text>
          )}
          {suggestions.length > 0 && (
            <View style={{ width: "70%" }}>
              <Text style={{ color: COLORS.danger, marginBottom: 8 }}>
                username is taken, some suggestions:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <TouchableHighlight
                    style={{
                      margin: 2,
                      backgroundColor: COLORS.white,
                      height: 32,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 8,
                    }}
                    onPress={() => {
                      setFieldValue("username", suggestion);
                      setUsername(suggestion);
                    }}
                    key={index}
                  >
                    <Text style={{ color: COLORS.primary }}>{suggestion}</Text>
                  </TouchableHighlight>
                ))}
              </View>
            </View>
          )}
          <View
            style={{
              marginBottom: 8,
              width: "88%",
              height: 68,
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            {(values.username && values.email) === "" ? (
              <DisabledButton title="Next" disabled={true} />
            ) : (
              <AppButton2 title="Next" onPress={handleSubmit} />
            )}
          </View>
        </View>
      )}
    </Formik>
  );
};

export default RegisterUsername;
