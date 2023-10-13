/* @ts-ignore */
import { BANNER, REWARDED } from "@env";
import { TestIds } from "react-native-google-mobile-ads";

export const IS_PRODUCTION = process.env.EXPO_PUBLIC_PRODUCTION_ADS;

export const BANNER_UNIT_ID = IS_PRODUCTION === "true" ? BANNER : TestIds.BANNER;
export const REWARDED_UNIT_ID = IS_PRODUCTION === "true" ? REWARDED : TestIds.REWARDED;
