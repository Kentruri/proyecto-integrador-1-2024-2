import { Canvas } from "@react-three/fiber";
import Controls from "./controls/Controls";
import Lights from "./lights/Lights";
import { Physics } from "@react-three/rapier";
import Beach from "./world/Beach";
import Staging from "./staging/Staging";
import { Loader, PositionalAudio } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

//Lo unico que se me ocurrio fue añadir eventos para detectar el touch y el keydown
// con el keydown si funciona, antes funcionaba tambien con el pointermove, pero hoy en dia
// la mayoria de navegadores no reconoce este tipo de eventos como eventos validos
//entonces tampoco se puede
//Si entre a la app y presiona w o alguna tecla, se ejecutara el audio
import Video from "./world/Video";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const cameraSettings = {
    position: [0, 15, 15],
  };

  const audioRef = useRef(null);

  const handleUserGesture = useCallback((event) => {
    if (!isPlaying && audioRef.current) {
      const audioContext = audioRef.current.context;

      audioContext.resume().then(() => {
        audioRef.current.play();
        audioRef.current.setVolume(10);
        setIsPlaying(true);

        window.removeEventListener("pointermove", handleUserGesture);
        window.removeEventListener("touchstart", handleUserGesture);
        window.removeEventListener("touchmove", handleUserGesture);
        window.removeEventListener("keydown", handleUserGesture);
      }).catch((error) => {
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener("pointermove", handleUserGesture);
    window.addEventListener("touchstart", handleUserGesture);
    window.addEventListener("touchmove", handleUserGesture);
    window.addEventListener("keydown", handleUserGesture);

    return () => {
      window.removeEventListener("pointermove", handleUserGesture);
      window.removeEventListener("touchstart", handleUserGesture);
      window.removeEventListener("touchmove", handleUserGesture);
      window.removeEventListener("keydown", handleUserGesture);
    };
  }, [handleUserGesture]);

  return (
    <>
      <Canvas camera={cameraSettings}>
        <Suspense fallback={null}>
          <Perf position={"top-left"} />
          <Controls />
          <Lights />
          <Staging />
          <Physics debug={false}>
            <Beach />
          </Physics>
          <Video name="screen" position-y={10} scale={8} />
          <group position={[0, 5, 0]}>
            <PositionalAudio
              ref={audioRef}
              url="/sounds/waves.mp3"
              distance={3}
            />
          </group>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default Home;