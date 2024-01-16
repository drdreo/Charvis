import * as THREE from "three";
import {
    pdfShader,
    simpleFragmentShader,
    vertexShader,
} from "../shaders/fragment.shader";

export class RendererObjectHelper {
    getPdf(canvas: HTMLCanvasElement) {
        console.log("adding pdf");
        const height = 23;
        const width = 16;
        const geometry = new THREE.PlaneGeometry(width, height);
        const texture = new THREE.CanvasTexture(canvas);
        const material = this.getPDFShaderMaterial(texture);
        const obj = new THREE.Mesh(geometry, material);
        return this.getPdfFrame(obj);
    }

    getPdfFrame(pdf: THREE.Mesh) {
        const frameGroup = new THREE.Group();

        // Dimensions of the frame
        const frameWidth = 16;
        const frameHeight = 23;
        const frameDepth = 1;
        const frameThickness = 0.5; // Thickness of the frame

        // Create a material for the frame
        const frameMaterial = this.getFrameShaderMaterial();

        // Create the planes to form the frame
        const framePlanes = new THREE.Group();

        // Top plane
        const topPlaneGeometry = new THREE.PlaneGeometry(
            frameWidth,
            frameThickness,
        );
        const topPlane = new THREE.Mesh(topPlaneGeometry, frameMaterial);
        topPlane.position.set(0, frameHeight / 2, frameDepth / 2);

        // Bottom plane
        const bottomPlaneGeometry = new THREE.PlaneGeometry(
            frameWidth,
            frameThickness,
        );
        const bottomPlane = new THREE.Mesh(bottomPlaneGeometry, frameMaterial);
        bottomPlane.position.set(0, -frameHeight / 2, frameDepth / 2);

        // Left plane
        const leftPlaneGeometry = new THREE.PlaneGeometry(
            frameThickness,
            frameHeight,
        );
        const leftPlane = new THREE.Mesh(leftPlaneGeometry, frameMaterial);
        leftPlane.position.set(-frameWidth / 2, 0, frameDepth / 2);

        // Right plane
        const rightPlaneGeometry = new THREE.PlaneGeometry(
            frameThickness,
            frameHeight,
        );
        const rightPlane = new THREE.Mesh(rightPlaneGeometry, frameMaterial);
        rightPlane.position.set(frameWidth / 2, 0, frameDepth / 2);

        // Add planes to the frame group
        framePlanes.add(topPlane);
        framePlanes.add(bottomPlane);
        framePlanes.add(leftPlane);
        framePlanes.add(rightPlane);

        // Position the frame planes as needed
        framePlanes.position.set(frameWidth / 2, frameHeight / 2, 0);

        // Add the frame planes to the frame group
        frameGroup.add(framePlanes);
        pdf.position.setX(frameWidth / 2);
        pdf.position.setY(frameHeight / 2);
        frameGroup.add(pdf);

        return frameGroup;
    }

    createFloorGrid() {
        const size = 1000;
        const divisions = 1000;

        return new THREE.GridHelper(size, divisions, 0x2080ff);
    }

    getHtmlTexture(): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const context = canvas.getContext("2d")!;
        context.fillStyle = "red";
        context.fillRect(0, 0, 256, 256);
        context.fillStyle = "white";
        context.font = "48px serif";
        context.fillText("Hello ThreeJS!", 20, 128);

        return new THREE.CanvasTexture(canvas);
    }

    getModernShaderMaterial() {
        const uniforms = {
            topColor: { value: new THREE.Color(0xff77ff) },
            bottomColor: { value: new THREE.Color(0x0077ff) },
            uIntensity: { value: 1.0 },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
        };

        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: simpleFragmentShader,
            wireframe: false,
            glslVersion: THREE.GLSL3,
            transparent: true,
        });
    }

    getPDFShaderMaterial(texture: THREE.Texture) {
        const uniforms = {
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uTexture: { value: texture },
        };

        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: pdfShader,
            wireframe: false,
            glslVersion: THREE.GLSL3,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
        });
    }

    getFrameShaderMaterial() {
        return new THREE.MeshBasicMaterial({
            color: 0x00ffff, // Neon blue color
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });
    }

    getTestDocument(pdf: THREE.Mesh): THREE.Group {
        const height = 23;
        const width = 16;
        const geometry = new THREE.BoxGeometry(width, height, 1);
        // const material = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     map: this.getHtmlTexture(),
        // });

        const material = this.getModernShaderMaterial();
        // center on origin
        const obj = new THREE.Mesh(geometry, material);
        obj.position.setX(width / 2);
        obj.position.setY(height / +2);

        // Create a group to contain both meshes
        const container = new THREE.Group();
        container.add(obj);
        container.add(pdf);
        return container;
    }

    getTestBox(size: number): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
            color: 0xdaa520,
        });

        const obj = new THREE.Mesh(geometry, material);
        obj.position.setX(size / 2);
        obj.position.setY(size / +2);
        obj.position.setZ(-10);
        return obj;
    }

    getLineBox(size: number, bodyId?: number): any {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffff00 }),
        );
        line.material.depthTest = false;
        line.material.opacity = 0.45;
        line.material.transparent = true;

        if (bodyId) {
            line.bodyId = bodyId;
            console.log(line.bodyId);
        }
        return line;
    }
}
