import { Canvas } from "@react-three/fiber";
import CircleMesh from "./CircleMesh";
import Loader from "../Loader";
import { Suspense } from "react";

export default function Circle({ colors }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <Suspense fallback={<Loader/>}>
          <CircleMesh colors={colors} />
        </Suspense>
      </Canvas>
    </div>
  );
}
