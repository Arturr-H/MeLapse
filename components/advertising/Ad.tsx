import React from "react";
import { View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

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
export function Banner(props: AdProps): JSX.Element {
	return (
		<View style={{
			width: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: props.allocatedHeight
		}}>
			<BannerAd
				unitId={TestIds.BANNER}
				size={BannerAdSize.LARGE_BANNER}
				onAdLoaded={props.onAdLoaded}
				onAdClosed={props.onAdClosed}
				requestOptions={{
					requestNonPersonalizedAdsOnly: true,
				}}
			/>
		</View>
	)
}
