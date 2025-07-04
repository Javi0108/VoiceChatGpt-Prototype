import { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

export default function CircleMesh({ colors }) {
  const meshRef = useRef();
  const color1 = useRef(new THREE.Color(colors[0]));
  const color2 = useRef(new THREE.Color(colors[1]));
  const [volume, setVolume] = useState(0);
  const [texture, setTexture] = useState(null);
  const offsets = useMemo(
    () => new Float32Array(7).map(() => Math.random() * Math.PI * 2),
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/perlin-noise.png",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        setTexture(tex);
      },
      undefined,
      (err) => console.error("Error loading texture:", err)
    );
  }, []);

  useEffect(() => {
    color1.current.set(colors[0]);
    color2.current.set(colors[1]);
  }, [colors]);

  const uniforms = useMemo(() => {
    if (!texture) return null;
    return {
      uColor1: { value: new THREE.Color(colors[0]) },
      uColor2: { value: new THREE.Color(colors[1]) },
      uOffsets: { value: offsets },
      uPerlinTexture: { value: texture },
      uTime: { value: 0 },
      uAnimation: { value: 0 },
      uInputVolume: { value: 0 },
      uOutputVolume: { value: 0 },
    };
  }, [texture]);

  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg =
          dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setVolume(avg);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    });

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useFrame((state, delta) => {
    if (!uniforms || !meshRef.current) return;

    const normalizedVolume = Math.min(volume / 255, 1);

    uniforms.uTime.value += delta * 0.5;
    uniforms.uAnimation.value += delta * (0.01 + normalizedVolume * 0.5);
    uniforms.uInputVolume.value = normalizedVolume;
    uniforms.uOutputVolume.value = normalizedVolume;

    uniforms.uColor1.value.lerp(color1.current, 0.05);
    uniforms.uColor2.value.lerp(color2.current, 0.05);
  });

  if (!uniforms) return null;

  return (
    <mesh ref={meshRef}>
      <circleGeometry args={[1, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent
      />
    </mesh>
  );
}
