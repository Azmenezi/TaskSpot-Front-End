import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import jwt_decode from "jwt-decode";
import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { register } from "../../../apis/auth";
import { storeToken } from "../../../apis/storage";
import AppButton2 from "../../../components/Buttons/AppButton2";
import DisabledButton from "../../../components/Buttons/DisabledButton";
import { COLORS } from "../../../constants/themes";
import UserContext from "../../../contexts/UserContext";

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(/\d/, "Password must contain a number.")
    .matches(/[A-Z]/, "Password must contain an uppercase letter.")
    .matches(/[a-z]/, "Password must contain a lowercase letter.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a symbol.")
    .required("Password is required."),
});

const RegisterPassword = ({ route, navigation }) => {
  const { username } = route.params;
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    mutate: registerFunction,
    // Add error and isLoading handling as needed
  } = useMutation({
    mutationFn: (newUserInfo) => {
      return register(newUserInfo);
    },
    onSuccess: (data) => {
      const decodedUser = jwt_decode(data.token);
      setUser(decodedUser);
      storeToken(data.token);
      // Navigate to the next screen or home screen after successful registration
      // navigation.navigate('Home');
    },
    onError: (err) => {
      console.log("Error in registration:", err);
      // Handle registration error (e.g., display an error message)
    },
  });

  const handleSubmit = (values) => {
    const newUserInfo = { username, password: values.password };
    registerFunction(newUserInfo);
  };

  return (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={PasswordSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Pick a password</Text>
            <Text style={styles.normalText}>
              We cannot remember the password, so you need to enter it on every
              device you have even if it is saved on iCloud :)
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            onBlur={handleBlur("password")}
            onChangeText={handleChange("password")}
            value={values.password}
            placeholderTextColor={"gray"}
          />

          <Pressable style={styles.pressable} onPress={toggleShowPassword}>
            <FontAwesome
              name={showPassword ? "eye" : "eye-slash"}
              size={24}
              color={COLORS.black}
              style={styles.eyeIcon}
            />
          </Pressable>

          {errors.password && touched.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
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
            {values.password === "" ? (
              <DisabledButton title="Register" disabled={true} />
            ) : (
              <AppButton2 title="Register" onPress={handleSubmit} />
            )}
          </View>
        </View>
      )}
    </Formik>
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
  headerText: {
    color: COLORS.whiteText,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  normalText: {
    color: COLORS.whiteText,
    textAlign: "center",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.white,
    color: COLORS.black,
    width: "80%",
    height: 48,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 15,
  },
  pressable: {
    position: "absolute",
    padding: 8,
    top: 240, // Adjust this value depending on the device
    right: 48, // Adjust this value depending on the device
  },
  eyeIcon: {
    marginTop: -22,
    opacity: 0.6,
  },
  errorText: {
    color: COLORS.danger,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default RegisterPassword;
