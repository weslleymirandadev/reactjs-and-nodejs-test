import { showTooltip, hideTooltip, toggleTooltip } from '../../store/etherTooltipSlice';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame, useThree } from "@react-three/fiber";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from "react";
import type { RootState } from '../../store';
import * as THREE from "three";

interface EtherProps {
  enabled: boolean,
  scale?: number;
  speed?: number;
  color?: THREE.Color;
  path?: string;
}

export default function Ether({
  enabled,
  scale = 0.02,
  speed = 0.005,
  color = new THREE.Color(0x155DFC),
  path = "/models/ether/ethereum_3d_logo.glb",
}: EtherProps) {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(
    new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 1,
      roughness: 0.2,
      metalness: 0.8,
      toneMapped: false,
      wireframe: false,
    })
  );

  const { invalidate } = useThree();
  const dispatch = useDispatch();
  const tooltipVisible = useSelector((state: RootState) => state.etherTooltip.visible);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = materialRef.current;
          }
        });
        setModel(scene);
        invalidate();
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model:", error);
      }
    );
  }, [path]);

  useEffect(() => {
    // Azul normal: #155DFC, azul claro: #4F8FFF
    const base = new THREE.Color(0x155DFC);
    const light = new THREE.Color(0x4F8FFF);
    const target = tooltipVisible && enabled ? light : base;
    materialRef.current.color.copy(target);
    materialRef.current.emissive.copy(target);
  }, [tooltipVisible]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += speed;
    }
  });

  // Tooltip handlers
  function handlePointerOver() {
    dispatch(showTooltip());
  }
  function handlePointerOut() {
    dispatch(hideTooltip());
  }
  function handleClick() {
    dispatch(toggleTooltip());
  }

  return model ? (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      scale={scale}
      rotation={[0, 0, 0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <primitive object={model} />
    </group>
  ) : (
    <mesh visible={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
