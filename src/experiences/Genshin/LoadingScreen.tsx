import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import useStore from "./zustand/store";

export const LoadingScreen = (/* { started, onStarted } */) => {
  const { progress } = useProgress();
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startBgm = useStore((state) => state.startBgm);

  useEffect(() => {
    if (progress == 100) setReady(true);
  }, [progress]);

  const startGame = () => {
    //should fadeout the loading screen and start the bgm
    setStarted(true);
    startBgm();
  };
  const handleTransitionEnd = () => {
    if (started) {
      ref.current!.remove();
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={`loader-screen fixed z-10 inset-0 bg-white transition-opacity duration-1000 ${
          started ? "opacity-0" : "opacity-100"
        } `}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <img
            src="/Genshin.png"
            style={{
              width: `45vmin`,
            }}
            className="title block"
            alt=""
          />
        </div>
        <div
          className="absolute flex justify-center left-[50%] top-[71%] translate-x-[-50%] translate-y-[-50%]"
          style={{
            width: `41vmin`,
          }}
        >
          {ready ? (
            <button
              className="loadingScreen__button"
              /* disabled={progress < 100} */
              onClick={startGame}
            >
              启动
            </button>
          ) : (
            <progress
              className="loader-progress progress-bar transition-all ease-in-out duration-300 "
              style={{
                /*  width: `${progress}%`, */

                height: "0.375rem",
              }}
              value={progress}
              max="100"
              dir="ltr"
            ></progress>
          )}
        </div>
      </div>

      {/* <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <div className="loadingScreen__board">
        <h1 className="loadingScreen__title">Please help me!</h1>
        <button
          className="loadingScreen__button"
          disabled={progress < 100}
          onClick={onStarted}
        >
          Start
        </button>
      </div>
    </div> */}
    </>
  );
};
