// import { shaderMaterial } from "./shader-material";
// import * as THREE from 'three'
//
// export type GridMaterialType = {
//     /** Cell size, default: 0.5 */
//     cellSize?: number
//     /** Cell thickness, default: 0.5 */
//     cellThickness?: number
//     /** Cell color, default: black */
//     cellColor?: THREE.ColorRepresentation
//     /** Section size, default: 1 */
//     sectionSize?: number
//     /** Section thickness, default: 1 */
//     sectionThickness?: number
//     /** Section color, default: #2080ff */
//     sectionColor?: THREE.ColorRepresentation
//     /** Follow camera, default: false */
//     followCamera?: boolean
//     /** Display the grid infinitely, default: false */
//     infiniteGrid?: boolean
//     /** Fade distance, default: 100 */
//     fadeDistance?: number
//     /** Fade strength, default: 1 */
//     fadeStrength?: number
// }
//
// export type GridProps = GridMaterialType & {
//     /** Default plane-geometry arguments */
//     args?: ConstructorParameters<typeof THREE.PlaneGeometry>
// }
//
// const GridMaterial = shaderMaterial(
//     {
//         cellSize: 0.5,
//         sectionSize: 1,
//         fadeDistance: 100,
//         fadeStrength: 1,
//         cellThickness: 0.5,
//         sectionThickness: 1,
//         cellColor: new THREE.Color(),
//         sectionColor: new THREE.Color(),
//         infiniteGrid: 0,
//         followCamera: 0,
//     },
//     `varying vec3 worldPosition;
//    uniform float fadeDistance;
//    uniform float infiniteGrid;
//    uniform float followCamera;
//    void main() {
//      vec3 pos = position.xzy * (1. + fadeDistance * infiniteGrid);
//      pos.xz += (cameraPosition.xz * followCamera);
//      worldPosition = pos;
//      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//    }`,
//     `varying vec3 worldPosition;
//    uniform float cellSize;
//    uniform float sectionSize;
//    uniform vec3 cellColor;
//    uniform vec3 sectionColor;
//    uniform float fadeDistance;
//    uniform float fadeStrength;
//    uniform float cellThickness;
//    uniform float sectionThickness;
//    uniform float infiniteGrid;
//    float getGrid(float size, float thickness) {
//      vec2 r = worldPosition.xz / size;
//      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
//      float line = min(grid.x, grid.y) + 1. - thickness;
//      return 1.0 - min(line, 1.);
//    }
//    void main() {
//      float g1 = getGrid(cellSize, cellThickness);
//      float g2 = getGrid(sectionSize, sectionThickness);
//      float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / fadeDistance, 1.);
//      vec3 color = mix(cellColor, sectionColor, min(1.,sectionThickness * g2));
//      gl_FragColor = vec4(color, (g1 + g2) * pow(d,fadeStrength));
//      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);
//      if (gl_FragColor.a <= 0.0) discard;
//      #include <tonemapping_fragment>
//      #include <encodings_fragment>
//    }`
// )
//
// const options = {
//     cellColor = '#000000',
//     sectionColor = '#2080ff',
//     cellSize = 0.5,
//     sectionSize = 1,
//     followCamera = false,
//     infiniteGrid = false,
//     fadeDistance = 100,
//     fadeStrength = 1,
//     cellThickness = 0.5,
//     sectionThickness = 1,
// };
//
// const uniforms1 = { cellSize, sectionSize, cellColor, sectionColor, cellThickness, sectionThickness };
// const uniforms2 = { fadeDistance, fadeStrength, infiniteGrid, followCamera };
//
// const material =
// export const grid =
// export const Grid = React.forwardRef(
//
//
//         return (
//             <mesh ref={fRef} frustumCulled={false} {...props}>
//         <gridMaterial transparent extensions-derivatives side={THREE.DoubleSide} {...uniforms1} {...uniforms2} />
//         <planeGeometry args={args} />
//         </mesh>
//     )
//     }
// )

// Author: Fyrestar https://mevedia.com (https://github.com/Fyrestar/THREE.InfiniteGridHelper)
import * as THREE from "three";

export class InfiniteGridHelper extends THREE.Mesh {


    constructor(private size1?: number, private size2?: number, private color?: THREE.Color, private distance?: number) {
        super();
        this.color = color || new THREE.Color('#2080ff');
        this.size1 = size1 || 10;
        this.size2 = size2 || 100;
        this.distance = distance || 8000;

        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
        this.material = new THREE.ShaderMaterial({

            side: THREE.DoubleSide,

            uniforms: {
                uSize1: {
                    value: size1
                },
                uSize2: {
                    value: size2
                },
                uColor: {
                    value: color
                },
                uDistance: {
                    value: distance
                }
            },
            transparent: true,
            vertexShader: `
       
       varying vec3 worldPosition;
		   
       uniform float uDistance;
       
       void main() {
       
            vec3 pos = position.xzy * uDistance;
            pos.xz += cameraPosition.xz;
            
            worldPosition = pos;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
       
       }
       `,


            fragmentShader: `
       
       varying vec3 worldPosition;
       
       uniform float uSize1;
       uniform float uSize2;
       uniform vec3 uColor;
       uniform float uDistance;
        
        
        
        float getGrid(float size) {
        
            vec2 r = worldPosition.xz / size;
            
            
            vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
            float line = min(grid.x, grid.y);
            
        
            return 1.0 - min(line, 1.0);
        }
        
       void main() {
       
            
              float d = 1.0 - min(distance(cameraPosition.xz, worldPosition.xz) / uDistance, 1.0);
            
              float g1 = getGrid(uSize1);
              float g2 = getGrid(uSize2);
              
              
              gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
              gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
            
              if ( gl_FragColor.a <= 0.0 ) discard;
            
       
       }
       
       `,

            extensions: {
                derivatives: true
            }

        });

        this.frustumCulled = false;

    }

}
