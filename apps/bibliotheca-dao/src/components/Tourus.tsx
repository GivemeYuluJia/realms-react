import { OrbitControls, useCursor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState, useMemo } from 'react';
import { AsciiEffect } from 'three-stdlib';

export default function Tourus() {
  function AsciiRenderer({
    renderIndex = 1,
    characters = ' .:-+*=%@#',
    ...options
  }) {
    // Reactive state
    const { size, gl, scene, camera } = useThree<any>();

    // Create effect
    const effect = useMemo(() => {
      const effect = new AsciiEffect(gl, ' .:{} ', options);
      effect.domElement.style.position = 'absolute';
      effect.domElement.style.top = '0px';
      effect.domElement.style.left = '0px';
      effect.domElement.style.color = '#424242';
      effect.domElement.style.backgroundColor = '#1b1b1d';
      effect.domElement.style.pointerEvents = 'none';
      return effect;
    }, [characters, options.invert]);

    // Append on mount, remove on unmount
    useEffect(() => {
      gl.domElement.parentNode.appendChild(effect.domElement);
      return () => gl.domElement.parentNode.removeChild(effect.domElement);
    }, [effect]);

    // Set size
    useEffect(() => {
      effect.setSize(size.width, size.height);
    }, [effect, size]);

    // Take over render-loop (that is what the index is for)
    useFrame((state) => {
      effect.render(scene, camera);
    }, 1);
    return <mesh />;
  }

  return (
    <Canvas>
      <color attach="background" args={['#1b1b1d']} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Torusknot />
      <OrbitControls />
      <AsciiRenderer invert />
    </Canvas>
  );
}

function Torusknot(props: any) {
  const ref = useRef<any>();
  const [clicked, click] = useState(false);
  const [hovered, hover] = useState(false);
  useCursor(hovered);
  useFrame(
    (state, delta) =>
      (ref.current.rotation.x = ref.current.rotation.y += delta / 2)
  );
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1.25}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <torusKnotGeometry args={[1, 0.4, 128, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
