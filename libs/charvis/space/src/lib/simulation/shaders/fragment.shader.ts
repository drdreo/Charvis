export const vertexShader = `
        in vec2 myUv;
        out vec2 vUv;
    
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
`;

// vUv - the uv coordinates of the fragment
// gl_FragCoord - the coordinates of the fragment in the canvas
export const simpleFragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform vec3 uResolution;
            
            out vec4 fragColor;
            
            varying vec2 vUv;

            void main() {
                vec2 st = gl_FragCoord.xy / uResolution.xy;
                
                bool isTop = vUv.x > 0.5;
                bool isEdge = vUv.x < 0.05 || vUv.y < 0.05 || vUv.x > 0.95 || vUv.y > 0.95;

                if (isEdge) {
                    // Calculate the glow effect
                    float glowDistance = 0.5;
                    float glowSize = 0.5;
                    float glowIntensity = 1.0 - smoothstep(glowSize, glowSize + 0.02, glowDistance);
                    vec3 glowColor = vec3(0.9, 0.2, 0.5);
                    
                    // Mix the top and bottom colors with the glow color
                    vec3 color = mix(topColor, bottomColor, vUv.y / 512.0);
                    color += glowIntensity * glowColor;
                    
                    fragColor = vec4(color, 1.0);
                } else {
                    fragColor = vec4(bottomColor, 0.3);
                }   
            }
`;
