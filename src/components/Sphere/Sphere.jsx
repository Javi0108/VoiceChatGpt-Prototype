import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import vertexShader from "./shaders/sphere/vertex.glsl";
import fragmentShader from "./shaders/sphere/fragment.glsl";
import Loader from "../Loader";

const Sphere = ({ volume, onReady }) => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.5),
      uTimeFrequency: new THREE.Uniform(0.4), // 0.12
      uStrength: new THREE.Uniform(0.3), // 0.25
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(0.7),
      uColorA: new THREE.Uniform(new THREE.Color("#0025F6")),
      uColorB: new THREE.Uniform(new THREE.Color("#7BF5FD")),
      uColorC: new THREE.Uniform(new THREE.Color("#E946F8")),
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + volume / 100;
      meshRef.current.scale.set(scale * 0.65, scale * 0.65, scale * 0.75);
      uniforms.uPositionFrequency.value = scale;
      uniforms.uStrength.value = scale * 0.1;
      uniforms.uTime.value = clock.getElapsedTime() * 0.5;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.5, 64);
    const merged = mergeVertices(geo);
    merged.computeTangents();
    return merged;
  }, []);

  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms,
      metalness: 0,
      roughness: 0.5,
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
      onBeforeCompile: () => onReady?.(),
    });
  }, [uniforms, onReady]);

  const depthMaterial = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vertexShader,
      uniforms,
      depthPacking: THREE.RGBADepthPacking,
    });
  }, [uniforms]);

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        customDepthMaterial={depthMaterial}
      />
      {/* <ambientLight intensity={5} /> */}
      <directionalLight position={[0, 0, 1]} intensity={5} color="#ffffff" />
    </>
  );
};

const SphereVisualizer = () => {
  const [volume, setVolume] = useState(0);
  const [isReady, setIsReady] = useState(false);

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
    <>
      {!isReady && <Loader />}
      <Canvas>
        <Sphere volume={volume} onReady={() => setIsReady(true)} />
      </Canvas>
    </>
  );
};

export default SphereVisualizer;
