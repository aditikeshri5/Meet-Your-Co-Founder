/**
 * Galaxy.jsx

 * ──────────────────────────────────────────────────────────────────
 */

import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      vec2 starPos = gv - offset - (vec2(Hash21(si + 5.0), Hash21(si + 7.0)) - 0.5) - pad;

      if (uMouseRepulsion) {
        vec2 toStar = starPos - uMouse;
        float dist = length(toStar);
        if (dist < 0.3) {
          float repulse = (1.0 - dist / 0.3) * uRepulsionStrength * uMouseActiveFactor;
          starPos += normalize(toStar) * repulse * 0.1;
        }
      }

      float star = Star(starPos, flareSize);
      float twinkle = trisn(uTime * uSpeed * 0.5 + seed * 17.0) * uTwinkleIntensity;
      star *= (1.0 + twinkle);

      col += star * size * base;
    }
  }

  return col;
}

void main() {
  vec2 uv = (vUv - 0.5) * uResolution.xy / uResolution.y;
  uv *= uDensity * 3.0;

  float cosR = cos(uTime * uRotationSpeed * 0.1);
  float sinR = sin(uTime * uRotationSpeed * 0.1);
  mat2 rot = mat2(cosR, -sinR, sinR, cosR);
  uv = rot * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < NUM_LAYER; i++) {
    float depth = fract(i / NUM_LAYER);
    float scale = mix(0.5, 2.5, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.2) * fade;
  }

  float alpha = 1.0;
  vec3 bgColor = vec3(0.0);

  if (!uTransparent) {
    float t = vUv.y;
    vec3 topColor    = vec3(0.0, 0.18, 0.22);
    vec3 midColor    = vec3(0.0, 0.04, 0.15);
    vec3 bottomColor = vec3(0.0, 0.0, 0.0);

    bgColor = mix(bottomColor, midColor, smoothstep(0.0, 0.5, t));
    bgColor = mix(bgColor, topColor, smoothstep(0.5, 1.0, t));
    col += bgColor;
  } else {
    alpha = clamp(length(col) * 3.0, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, alpha);
}
`;

const Galaxy = ({
  starSpeed = 0.2,
  density = 0.5,
  hueShift = 125,
  speed = 0.4,
  glowIntensity = 0.15,
  saturation = 0.1,
  mouseRepulsion = false,
  repulsionStrength = 1,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = false,
  className = '',
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouseRef = useRef([0.5, 0.5]);
  const mouseActiveRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: transparent,
      antialias: false,
      premultipliedAlpha: transparent,
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime:               { value: 0 },
        uResolution:         { value: [gl.canvas.width, gl.canvas.height, 1] },
        uFocal:              { value: [0.5, 0.5] },
        uRotation:           { value: [0, 0] },
        uStarSpeed:          { value: starSpeed },
        uDensity:            { value: density },
        uHueShift:           { value: hueShift },
        uSpeed:              { value: speed },
        uMouse:              { value: [0.5, 0.5] },
        uGlowIntensity:      { value: glowIntensity },
        uSaturation:         { value: saturation },
        uMouseRepulsion:     { value: mouseRepulsion },
        uRepulsionStrength:  { value: repulsionStrength },
        uTwinkleIntensity:   { value: twinkleIntensity },
        uRotationSpeed:      { value: rotationSpeed },
        uMouseActiveFactor:  { value: 0 },
        uAutoCenterRepulsion:{ value: 0 },
        uTransparent:        { value: transparent },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h, 1];
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = [
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height,
      ];
      mouseActiveRef.current = 1;
    };

    const handleMouseLeave = () => {
      mouseActiveRef.current = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const startTime = performance.now();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      program.uniforms.uTime.value = elapsed;
      program.uniforms.uMouse.value = mouseRef.current;
      program.uniforms.uMouseActiveFactor.value = mouseActiveRef.current;
      renderer.render({ scene: mesh });
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [starSpeed, density, hueShift, speed, glowIntensity, saturation, mouseRepulsion, repulsionStrength, twinkleIntensity, rotationSpeed, transparent]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};

export default Galaxy;
