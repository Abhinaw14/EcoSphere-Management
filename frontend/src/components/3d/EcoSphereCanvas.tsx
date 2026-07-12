import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const EcoPlanet = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color="#10b981"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
          emissive="#047857"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const AtmosphericGlow = () => {
  return (
    <mesh>
      <sphereGeometry args={[2.2, 32, 32]} />
      <meshBasicMaterial
        color="#34d399"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default function EcoSphereCanvas() {
  return (
    <div className="absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#a7f3d0" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#059669" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#10b981" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <group>
          <EcoPlanet />
          <AtmosphericGlow />
        </group>
        
        {/* We disable orbit controls zoom to keep it as a background */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
