"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { ShaderMaterial, Vector2 } from "three";

function NoiseShader() {
  const materialRef = useRef<ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;
      varying vec2 vUv;
      
      /** Noise intensity */
      float noiseIntensity = 0.25;
      
      /** Grain size */
      float grainSize = 0.8;
      
      /** Animation speed */
      float animSpeed = 1.0;
      
      // Simple noise function
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      // Smooth noise
      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      // Film grain function
      float filmGrain(vec2 uv, float time) {
        vec2 seed = uv * grainSize;
        seed += time * animSpeed;
        
        // Fewer octaves for thicker, chunkier grain
        float grain = 0.0;
        grain += noise(seed * 2.0) * 0.6;
        grain += noise(seed * 4.0) * 0.3;
        grain += noise(seed * 8.0) * 0.1;
        
        return grain;
      }
      
      void main() {
        vec2 uv = vUv;
        vec2 fragCoord = uv * iResolution;
        
        // Generate film grain
        float grain = filmGrain(fragCoord, iTime);
        
        // Add some temporal variation
        float timeVariation = sin(iTime * 60.0) * 0.1 + sin(iTime * 120.0) * 0.05;
        grain += timeVariation;
        
        // Convert to monochrome
        float monoGrain = grain * noiseIntensity;
        
        // Create final color - white noise on transparent background
        vec3 color = vec3(monoGrain);
        
        // Add some subtle scanline interference
        float scanline = sin(fragCoord.y * 0.5) * 0.02;
        color += scanline;
        
        // Clamp values
        color = clamp(color, 0.0, 1.0);
        
        gl_FragColor = vec4(color, noiseIntensity * 0.8);
      }
    `;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    return new ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vector2(1920, 1080) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.elapsedTime;
      materialRef.current.uniforms.iResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}

export default function MonochromeNoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        // CSS blend modes for combining with DOM content
        mixBlendMode: "color-dodge",
        opacity: 1,
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        style={{
          background: "transparent",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <NoiseShader />
      </Canvas>
    </div>
  );
}
