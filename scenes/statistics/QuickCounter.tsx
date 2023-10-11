import React, { Component } from "react";
import { Text } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {
	from: number;
	to: number;
	duration: number;

	callback?: () => void,
	delay?: number
}
interface State {
	currentValue: number;
}

class QuickCounter extends Component<Props, State> {
	private animationFrameId: number | null = null;
	private startTime: number;

	constructor(props: Props) {
		super(props);
		this.state = {
			currentValue: props.from,
		};
		this.startTime = 0;
	}

	componentDidMount() {
		this.animateCount();
	}

	componentWillUnmount() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
		}
	}

	animateCount = () => {
		const { from, to, duration } = this.props;

		if (!this.startTime) {
			this.startTime = Date.now();
		}

		const currentTime = Date.now();
		const deltaTime = currentTime - this.startTime;

		if (deltaTime >= duration) {
			this.props.callback && (
				this.props.delay ? setTimeout(this.props.callback, this.props.delay)
				: this.props.callback()
			);
			this.setState({ currentValue: to });
		} else {
			const progress = deltaTime / duration;
			const easedProgress = this.customEasing(progress);
			const nextValue = Math.round(from + (to - from) * easedProgress);
			this.setState({ currentValue: nextValue });
			this.animationFrameId = requestAnimationFrame(this.animateCount);
		}
	};
	customEasing(t: number): number {
		const bend = 31;
		const a = 1.65;
		return 1 / (1 + Math.pow(a, -bend*(t - 0.5)))
	}

	render() {
		return <Text style={Styles.quickCounter}>{this.state.currentValue}</Text>;
	}
}

export default QuickCounter;
