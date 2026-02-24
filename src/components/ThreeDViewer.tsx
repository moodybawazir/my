
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

// A simple sphere with an equirectangular texture mapped to the inside
const SceneContainer = ({ image }: { image: string }) => {
    const texture = useLoader(TextureLoader, image);
    return (
        <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            {/* invert geometry to look inside */}
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
};

interface ThreeDViewerProps {
    image: string;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ image }) => {
    return (
        <div className="w-full h-[500px] rounded-[30px] overflow-hidden shadow-2xl border border-white/10 relative">
            <Canvas camera={{ position: [0, 0, 0.1] }}>
                <Suspense fallback={<Loader />}>
                    <SceneContainer image={image} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={-0.5}
                    />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold animate-pulse">
                    360° View - Drag to explore
                </div>
            </div>
        </div>
    );
};

export default ThreeDViewer;
