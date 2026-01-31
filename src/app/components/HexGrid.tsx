"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "../themeProvider";

const vertexShader = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_color;
  uniform float u_aspect;
  
  #define PI 3.14159265359
  
  // 3D rotation around Y axis
  vec3 rotateY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  }
  
  // 3D rotation around X axis
  vec3 rotateX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
  }
  
  // 3D rotation around Z axis
  vec3 rotateZ(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
  }
  
  // Glow function
  float glow(float d, float radius, float intensity) {
    return radius / (d * d * intensity + radius);
  }
  
  // Hash function for randomness
  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }
  
  // Draw an orbital ring with escaping particles
  float orbitalRing(vec2 uv, float radius, float tiltX, float tiltZ, float rotation, float phase, float time, int ringId) {
    float totalGlow = 0.0;
    
    // Main orbital particles
    for (int i = 0; i < 48; i++) {
      float t = float(i) / 48.0 * PI * 2.0;
      
      // Point on ring in 3D
      vec3 p = vec3(cos(t + phase) * radius, 0.0, sin(t + phase) * radius);
      
      // Rotate the ring
      p = rotateX(p, tiltX);
      p = rotateZ(p, tiltZ);
      p = rotateY(p, rotation);
      
      // Project to 2D with perspective
      float perspective = 1.0 / (2.5 - p.z * 0.5);
      vec2 projected = p.xy * perspective;
      
      // Distance from this point
      float d = length(uv - projected);
      
      // Depth-based brightness (closer = brighter)
      float depth = smoothstep(-1.0, 1.0, p.z);
      float brightness = 0.3 + depth * 0.7;
      
      // Point glow
      float pointGlow = smoothstep(0.022, 0.006, d) * brightness;
      pointGlow += glow(d, 0.002, 500.0) * brightness * 0.4;
      
      totalGlow += pointGlow;
    }
    
    // Escaping particles - many fine particles that jump out and return
    for (int j = 0; j < 12; j++) {
      float particleId = float(ringId * 12 + j);
      float cycleTime = 2.0 + hash(particleId) * 3.0; // Different cycle lengths
      float localTime = mod(time + hash(particleId + 100.0) * cycleTime, cycleTime);
      float progress = localTime / cycleTime;
      
      // Parabolic arc - goes out and comes back
      float arcHeight = sin(progress * PI) * (0.15 + hash(particleId + 50.0) * 0.35);
      
      // Start position on the ring
      float startAngle = hash(particleId + 200.0) * PI * 2.0 + phase;
      vec3 basePos = vec3(cos(startAngle) * radius, 0.0, sin(startAngle) * radius);
      
      // Rotate base position
      basePos = rotateX(basePos, tiltX);
      basePos = rotateZ(basePos, tiltZ);
      basePos = rotateY(basePos, rotation);
      
      // Escape direction (outward from center, with variation)
      vec3 escapeDir = normalize(basePos) * arcHeight;
      escapeDir.y += arcHeight * 0.8 * (hash(particleId + 300.0) - 0.5);
      escapeDir.x += arcHeight * 0.3 * (hash(particleId + 400.0) - 0.5);
      
      // Particle position
      vec3 particlePos = basePos + escapeDir;
      
      // Project
      float perspective = 1.0 / (2.5 - particlePos.z * 0.5);
      vec2 projected = particlePos.xy * perspective;
      
      float d = length(uv - projected);
      
      // Brightness based on arc (brightest at peak)
      float brightness = sin(progress * PI) * 0.6;
      brightness *= smoothstep(-1.0, 1.0, particlePos.z) * 0.5 + 0.5;
      
      // Fine particle glow
      float particleGlow = smoothstep(0.018, 0.004, d) * brightness;
      particleGlow += glow(d, 0.002, 500.0) * brightness * 0.4;
      
      totalGlow += particleGlow;
    }
    
    return totalGlow;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_aspect;
    
    float totalGlow = 0.0;
    
    // Full 360 rotation over time
    float baseRotation = u_time * 0.5;
    
    // Ring 1 - slight tilt
    totalGlow += orbitalRing(uv, 0.55, 0.3, 0.1, baseRotation, 0.0, u_time, 0) * 0.4;
    
    // Ring 2 - more tilted, different phase
    totalGlow += orbitalRing(uv, 0.5, 1.3, 0.4, baseRotation * 1.2 + 1.0, PI * 0.5, u_time, 1) * 0.35;
    
    // Ring 3 - opposite tilt, reverse direction
    totalGlow += orbitalRing(uv, 0.45, 2.2, -0.3, -baseRotation * 0.8 + 2.0, PI, u_time, 2) * 0.3;
    
    // Center core - pulsing
    float pulse = 0.8 + 0.2 * sin(u_time * 2.0);
    float coreDist = length(uv);
    float core = smoothstep(0.07, 0.02, coreDist) * pulse;
    float coreGlow = glow(coreDist, 0.012, 40.0) * 0.5 * pulse;
    totalGlow += core + coreGlow;
    
    // Subtle outer halo
    float halo = glow(coreDist, 0.08, 6.0) * 0.12;
    totalGlow += halo;
    
    // Edge fade
    vec2 edgeUV = gl_FragCoord.xy / u_resolution;
    float edgeFadeX = smoothstep(0.0, 0.12, edgeUV.x) * smoothstep(1.0, 0.88, edgeUV.x);
    float edgeFadeY = smoothstep(0.0, 0.12, edgeUV.y) * smoothstep(1.0, 0.88, edgeUV.y);
    float edgeFade = edgeFadeX * edgeFadeY;
    totalGlow *= edgeFade;
    
    // Apply color
    vec3 col = u_color * totalGlow;
    
    // Subtle scanline
    float scanLine = sin(gl_FragCoord.y * 1.5) * 0.03 + 0.97;
    col *= scanLine;
    
    // Tone mapping
    col = col / (col + 0.5);
    
    float alpha = min(1.0, totalGlow * 1.2) * edgeFade;
    
    gl_FragColor = vec4(col, alpha);
  }
`;

// Convert hex color to RGB (0-1 range)
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

interface HexGridProps {
  className?: string;
}

export default function HexGrid({ className = "" }: HexGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !theme) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) return;

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Compile shaders
    const vShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vShader, vertexShader);
    gl.compileShader(vShader);

    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vShader));
    }

    const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fShader, fragmentShader);
    gl.compileShader(fShader);

    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fShader));
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full screen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const colorLoc = gl.getUniformLocation(program, "u_color");
    const aspectLoc = gl.getUniformLocation(program, "u_aspect");

    const [r, g, b] = hexToRgb(theme.config.shader || theme.config.primary);

    startTimeRef.current = performance.now();

    const render = () => {
      const time = (performance.now() - startTimeRef.current) / 1000;
      const aspect = canvas.width / canvas.height;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform3f(colorLoc, r, g, b);
      gl.uniform1f(aspectLoc, aspect);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: "transparent" }}
    />
  );
}
