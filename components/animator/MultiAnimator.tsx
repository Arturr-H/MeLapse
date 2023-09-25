import React, { RefObject } from "react";
import { Animator } from "./Animator";

/* Interfaces */
interface Props {
    children: JSX.Element[],
    customKey?: string,
    // styles: StyleProp,

    startLeft?: number,
    startTop?: number,
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

    fadeIn(duration?: number, delay?: number, callback?: () => void, wait?: number): void {
        const len = this.animatorRefs.length;

        this.animatorRefs.forEach((animator, index) => {
            const _callback = (index == len - 1) ? callback : undefined;

            if (delay) {
                animator.current?.wait(delay*index + (wait ?? 0)).fadeIn(duration).start(_callback)
            }else {
                animator.current?.wait((wait ?? 0)).fadeIn(duration).start(_callback)
            }
        })
    }
    fadeOut(duration?: number, delay?: number, callback?: () => void, wait?: number): void {
        const len = this.animatorRefs.length;

        this.animatorRefs.forEach((animator, index) => {
            const _callback = (index == len - 1) ? callback : undefined;

            if (delay) {
                animator.current?.wait(delay*index + (wait ?? 0)).fadeOut(duration).start(_callback)
            }else {
                animator.current?.wait((wait ?? 0)).fadeOut(duration).start(_callback)
            }
        })
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {this.props.children.map((child, index) => 
                    <Animator
                        startLeft={this.props.startLeft}
                        startTop={this.props.startTop}
                        key={"multianimator-" + index + child.key}
                        startOpacity={0}
                        ref={this.animatorRefs[index]}
                    >{child}</Animator>    
                )}
            </React.Fragment>
        )
    }
}
