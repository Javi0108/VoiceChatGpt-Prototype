import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Sphere = ({ volume }) => {
  const meshRef = useRef();

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      u_color1: { value: new THREE.Color("#ffffff") },
      u_color2: { value: new THREE.Color("#0077ff") },
      u_time: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + volume / 100;
      meshRef.current.scale.set(scale, scale, scale);

      // Animar el tiempo del shader (opcional, para añadir movimiento)
      uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.FrontSide}
      />
    </mesh>
  );
};

// Vertex Shader
const vertexShader = `
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader
const fragmentShader = `
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_time;
  varying vec3 vPosition;

  // Simple noise
  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    float mixValue = smoothstep(-0.5, 0.5, vPosition.y);
    float noise = rand(vPosition.xy + u_time * 0.05) * 0.1;

    vec3 color = mix(u_color2, u_color1, mixValue + noise);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const SphereVisualizer = () => {
  const [volume, setVolume] = useState(0);

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

  return (
    <Canvas>
      <pointLight position={[5, 5, 5]} />
      <Sphere volume={volume} />
    </Canvas>
  );
};

export default SphereVisualizer;
