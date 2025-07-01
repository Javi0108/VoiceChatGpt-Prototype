import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils'
import vertexShader from "./shaders/sphere/vertex.glsl";
import fragmentShader from "./shaders/sphere/fragment.glsl";

const Sphere = ({ volume }) => {
  const meshRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0) ,
      uPositionFrequency: new THREE.Uniform(0.5), // 0.75
      uTimeFrequency: new THREE.Uniform(0.2), // 0.2
      uStrength: new THREE.Uniform(0.25), // 0.3
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(0.7),
      uColorA: new THREE.Uniform(new THREE.Color("#ffffff")),
      uColorB: new THREE.Uniform(new THREE.Color("#0079FE")),
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + volume / 100;
      uniforms.uPositionFrequency.value = scale * 0.75;
      uniforms.uTime.value = clock.getElapsedTime() * 0.5;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.5, 64)
    const merged = mergeVertices(geo)
    merged.computeTangents()
    return merged
  }, [])

  const material = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms,
      metalness: 1,
      roughness: 0.5,
      color: '#0079FE',
      emissive: '#0079FE',
      emissiveIntensity: 0.5,
      transparent: true,
      wireframe: false,
    })
  }, [uniforms])

  const depthMaterial = useMemo(() => {
    return new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vertexShader,
      uniforms,
      depthPacking: THREE.RGBADepthPacking,
    })
  }, [uniforms])

  return (
    <>
      <mesh
        ref={meshRef} 
        geometry={geometry}
        material={material}
        customDepthMaterial={depthMaterial}
      />
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 3]} intensity={100} />
    </>
  )
};

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
      <Sphere volume={volume} />
    </Canvas>
  );
};

export default SphereVisualizer;
