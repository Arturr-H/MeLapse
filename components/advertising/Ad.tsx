import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import AppConfig from "../../scenes/preferences/Config";

/* @ts-ignore */
import { BANNER } from "@env";

/* Interfaces */
interface AdProps {
	/** Even if the ad isn't loaded
	 * we allocate some height to
	 * prevent content bumping. */
	allocatedHeight?: number,

	/* Callbacks for load / unmount */
	onAdClosed?: () => void,
	onAdLoaded?: () => void,
}

/**
 * # Examples
 * ```js
 * <Banner allocatedHeight={150} />
 * ```
 */
export function Banner(props: AdProps): JSX.Element | null {
	const [personalized, setPersonalized] = React.useState<null | boolean>(null);
	const [bannerID, setBannerID] = React.useState<null | string>(null);

	React.useEffect(() => {
		(async () => {
			let isProduction = process.env.EXPO_PUBLIC_PRODUCTION_ADS;
			let bannerID: string;

			if (isProduction === "true") { bannerID = BANNER; }
			else { bannerID = TestIds.BANNER; }

			/* If it's not set - default to false */
			setPersonalized(await AppConfig.getPersonalizedAds() ?? false)
			setBannerID(bannerID);
		})();
	}, []);


	return (
		(personalized !== null && bannerID !== null) ? <View style={{
			width: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: props.allocatedHeight,
		}}>
			<BannerAd
				unitId={bannerID}
				size={BannerAdSize.LARGE_BANNER}
				onAdLoaded={props.onAdLoaded}
				onAdClosed={props.onAdClosed}
				requestOptions={{
					requestNonPersonalizedAdsOnly: personalized,
				}}
			/>
		</View> : null
	)
}
