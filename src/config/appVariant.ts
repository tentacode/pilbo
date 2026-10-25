import Constants from "expo-constants";

export const IS_DEV_VARIANT = Constants.expoConfig?.extra?.appVariant === "dev";
