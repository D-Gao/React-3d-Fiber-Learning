import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BloomTransitionEffect } from "./BloomTransitionEffect";
import { Effect } from "postprocessing";
import useStore from "../zustand/store";
import gsap from "gsap";

interface Props {
  intensity?: number;
  whiteAlpha?: number;
}

const BloomTransition = (props: Props, ref: React.Ref<Effect>) => {
  const effect = useMemo(() => {
    return new BloomTransitionEffect(props);
  }, [props]);

  const diveIn = useStore((state) => state.diveIn);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline());

  useEffect(() => {
    const bloomInTransition = () => {
      const params: Props = { ...props };
      tl.current.clear();
      tl.current.to(params, {
        whiteAlpha: 1,
        intensity: 0.3,
        duration: 1,
        onUpdate: () => {
          effect.uniforms.get("uIntensity")!.value = params.intensity;
          effect.uniforms.get("uWhiteAlpha")!.value = params.whiteAlpha;
        },
      });
    };
    if (diveIn) bloomInTransition();

    return () => {};
  }, [diveIn]);

  return <primitive ref={ref} object={effect}></primitive>;
};

export default forwardRef(BloomTransition);
