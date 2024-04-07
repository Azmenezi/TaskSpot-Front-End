import { FontAwesome } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import jwt_decode from "jwt-decode";
import React, { useContext, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import { login } from "../../apis/auth";
import { storeToken } from "../../apis//storage";
import AppButton2 from "../../components/Buttons/AppButton2";
import DisabledButton from "../../components/Buttons/DisabledButton";
import LoadingPage from "../../components/Skeleton/LoadingPage";
import UserContext from "../../contexts/UserContext";
import { COLORS } from "../../constants/themes";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters long.")
    .required("Username is required."),
});
const Login = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const [backendError, setBackendError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    mutate: loginFunction,
    error,
    isLoading,
  } = useMutation({
    mutationFn: (userInfo) =>
      login({ ...userInfo, username: userInfo.username.toLowerCase() }),

    onSuccess: (data) => {
      const decodeUser = jwt_decode(data.token);
      setUser(decodeUser);
      storeToken(data.token);
    },
    onError: (err) => {
      if (err.response && err.response.status === 401) {
        setBackendError("Wrong username or password.");
        console.log(err?.response?.data.error?.message);
        Alert.alert(
          err?.response?.status?.toString(),
          err?.response?.data.error?.message
        );
      } else {
        setBackendError(err.response.data.message || "An error occurred.");
        Alert.alert(
          err?.response?.status.toString(),
          err?.response?.data.error?.message
        );
      }
    },
  });

  const handleRegister = () => {
    navigation.navigate("RegisterUsername");
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <LoadingPage />}
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          loginFunction(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          const handleChangeAndResetError = (field) => (text) => {
            setBackendError(null);
            handleChange(field)(text);
          };

          return (
            <View style={styles.formContainer}>
              <Text style={[styles.appName, { color: COLORS.whiteText }]}>
                TaskSpot
              </Text>
              <Text style={[styles.subHeading, { color: COLORS.whiteText }]}>
                Enter your username and password to login.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Username"
                onBlur={handleBlur("username")}
                onChangeText={handleChangeAndResetError("username")}
                value={values.username}
                placeholderTextColor={"gray"}
              />
              {errors.username && touched.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  onBlur={handleBlur("password")}
                  onChangeText={handleChangeAndResetError("password")}
                  value={values.password}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={"gray"}
                />
                <TouchableOpacity
                  style={styles.showPasswordIcon}
                  onPress={() => {
                    toggleShowPassword();
                  }}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={24}
                    color={COLORS.black}
                    style={styles.showPasswordIcon}
                  />
                </TouchableOpacity>
              </View>

              {backendError && (
                <Text style={styles.errorText}>{backendError}</Text>
              )}
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <View
                style={{
                  marginTop: 0,
                  width: "100%",
                  height: 68,
                  alignItems: "center",
                }}
              >
                {(values.username && values.password) === "" ? (
                  <DisabledButton title="Login" disabled={true} />
                ) : (
                  <AppButton2 title="Login" onPress={handleSubmit} />
                )}
              </View>

              <TouchableOpacity
                onPress={handleRegister}
                style={styles.registerContainer}
              >
                <Text style={styles.registerText}>Don't have an account?</Text>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 44,
    marginBottom: 10,
    fontWeight: "bold",
  },
  formContainer: {
    width: "88%",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 45,
    width: "100%",
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  showPasswordIcon: {
    position: "absolute",
    padding: 2,
    top: "50%",
    right: 10,
    transform: [{ translateY: -12 }],
  },

  errorText: {
    color: COLORS.danger,
    marginBottom: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: COLORS.whiteText,
    marginRight: 5,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  forgotPasswordContainer: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  sentEmailContainer: {
    marginTop: 10,
  },
  sentEmailText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});

export default Login;
