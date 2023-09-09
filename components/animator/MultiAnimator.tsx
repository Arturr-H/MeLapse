import React, { RefObject } from "react";
import { Animator } from "./Animator";
import { StyleProp } from "react-native";

/* Interfaces */
interface Props {
    children: JSX.Element[],
    // styles: StyleProp
}
interface State {}

/** This component will convert its' children to be
 * wrapped around an `Animator` component each, which
 * will give us controll to easily animate e.g a list
 * of items with methods. */
export default class MultiAnimator extends React.PureComponent<Props, State> {
    animatorRefs: RefObject<Animator>[] = [];

    constructor(props: Props) {
        super(props);

        /* Initialize `animatorRefs` */
        for (let i = 0; i < props.children.length; i++) {
            this.animatorRefs.push(React.createRef());
        }

        /* Bindings */
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
    }

    /* Lifetime */
    componentDidMount(): void {}

    fadeIn(duration?: number, delay?: number, callback?: () => void): void {
        const len = this.animatorRefs.length;

        this.animatorRefs.forEach((animator, index) => {
            const _callback = (index == len - 1) ? callback : undefined;

            if (delay) {
                animator.current?.wait(delay*index).fadeIn(duration).start(_callback)
            }else {
                animator.current?.fadeIn(duration).start(_callback)
            }
        })
    }
    fadeOut(duration?: number, delay?: number, callback?: () => void): void {
        const len = this.animatorRefs.length;

        this.animatorRefs.forEach((animator, index) => {
            const _callback = (index == len - 1) ? callback : undefined;

            if (delay) {
                animator.current?.wait(delay*index).fadeOut(duration).start(_callback)
            }else {
                animator.current?.fadeOut(duration).start(_callback)
            }
        })
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {this.props.children.map((child, index) => 
                    <Animator key={"multianimator-" + index} startOpacity={0} ref={this.animatorRefs[index]}>{child}</Animator>    
                )}
            </React.Fragment>
        )
    }
}
