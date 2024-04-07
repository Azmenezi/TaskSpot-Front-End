const COLORS = {
  // dark theme colors:
  background: "#121212",
  behindItem: "#202020",
  primary: "#ba9ffb",
  secondary: "#7d80a2",
  whiteText: "#ffffff",
  gray: "#3f3f3f",
  darkGray: "#282828",

  white: "#F3F4F8",
  black: "#121212",
  lightGray: "#777",

  ///////////////////////////////
  text: "#333333",
  text2: "#cbc9d6",
  text3: "#252c79", // changed to dark blue to provide contrast with the white background
  ///////////////////////////////
  icon: "#2d265b",
  card: "transparent",
  inputBackground: "#dadde1",

  popMenu: "#1c1c1c",
  notification: "#4ccdff", // using the primary blue for notifications
  GradientColors: ["#5f67ec", "#4ccdff"], // using the secondary blue and primary blue for gradients
  // yes i am mariam
  primaryOrange: "#ff9056",
  secondaryOrange: "#f67262",
  primaryBlue: "#4ccdff",
  secondaryBlue: "#5f67ec",
  darkBlue: "#252c79",
  amititycard: "#b6225d",

  subText: "#6e6969",

  ///////////////////////////////

  gray2: "#C1C0C8",
  lightWhite: "#FAFAFC",

  lightestGray: "#EAEAEF",

  light: "#f8f4f4",

  // extra
  danger: "#ff5252",
};

const FONT = {
  regular: "DMRegular",
  medium: "DMMedium",
  bold: "DMBold",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 32,
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, FONT, SIZES, SHADOWS };
