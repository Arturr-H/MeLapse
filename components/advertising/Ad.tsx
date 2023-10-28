import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import AppConfig from "../../scenes/menu/Config";

/* @ts-ignore */
import { getBannerId } from "../../LocalNotification";

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

	React.useEffect(() => {
		(async () => {
			/* If it's not set - default to false */
			setPersonalized(await AppConfig.getPersonalizedAds() ?? false)
		})();
	}, []);


	return (
		(personalized !== null) ? <View style={{
			width: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: props.allocatedHeight,
		}}>
			<BannerAd
				unitId={getBannerId()}
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
