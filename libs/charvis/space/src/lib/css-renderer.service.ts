import { Injectable } from "@angular/core";
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";
import { MarkdownService } from "./markdown.service";

// Tweening: https://www.npmjs.com/package/@tweenjs/tween.js#Installation
// BETTER - https://github.com/lvlrSajjad/lvlrSajjad.github.io/blob/master/p-t-example/main.js

interface CSSRendererOptions {
    element: HTMLElement;
    width: number;
    height: number
}

const scaleFactor = 1;


@Injectable()
export class CSSRendererService {

    private table = [
        "H", "Hydrogen", "1.00794", 1, 1,
        "He", "Helium", "4.002602", 18, 1,
        "Li", "Lithium", "6.941", 1, 2,
        "Be", "Beryllium", "9.012182", 2, 2,
        "B", "Boron", "10.811", 13, 2,
        "C", "Carbon", "12.0107", 14, 2,
        "N", "Nitrogen", "14.0067", 15, 2,
        "O", "Oxygen", "15.9994", 16, 2,
        "F", "Fluorine", "18.9984032", 17, 2,
        "Ne", "Neon", "20.1797", 18, 2,
        "Na", "Sodium", "22.98976...", 1, 3,
        "Mg", "Magnesium", "24.305", 2, 3,
        "Al", "Aluminium", "26.9815386", 13, 3,
        "Si", "Silicon", "28.0855", 14, 3,
        "P", "Phosphorus", "30.973762", 15, 3,
        "S", "Sulfur", "32.065", 16, 3,
        "Cl", "Chlorine", "35.453", 17, 3,
        "Ar", "Argon", "39.948", 18, 3,
        "K", "Potassium", "39.948", 1, 4,
        "Ca", "Calcium", "40.078", 2, 4,
        "Sc", "Scandium", "44.955912", 3, 4,
        "Ti", "Titanium", "47.867", 4, 4,
        "V", "Vanadium", "50.9415", 5, 4,
        "Cr", "Chromium", "51.9961", 6, 4,
        "Mn", "Manganese", "54.938045", 7, 4,
        "Fe", "Iron", "55.845", 8, 4,
        "Co", "Cobalt", "58.933195", 9, 4,
        "Ni", "Nickel", "58.6934", 10, 4,
        "Cu", "Copper", "63.546", 11, 4,
        "Zn", "Zinc", "65.38", 12, 4,
        "Ga", "Gallium", "69.723", 13, 4,
        "Ge", "Germanium", "72.63", 14, 4,
        "As", "Arsenic", "74.9216", 15, 4,
        "Se", "Selenium", "78.96", 16, 4,
        "Br", "Bromine", "79.904", 17, 4,
        "Kr", "Krypton", "83.798", 18, 4,
        "Rb", "Rubidium", "85.4678", 1, 5,
        "Sr", "Strontium", "87.62", 2, 5,
        "Y", "Yttrium", "88.90585", 3, 5,
        "Zr", "Zirconium", "91.224", 4, 5,
        "Nb", "Niobium", "92.90628", 5, 5,
        "Mo", "Molybdenum", "95.96", 6, 5,
        "Tc", "Technetium", "(98)", 7, 5,
        "Ru", "Ruthenium", "101.07", 8, 5,
        "Rh", "Rhodium", "102.9055", 9, 5,
        "Pd", "Palladium", "106.42", 10, 5,
        "Ag", "Silver", "107.8682", 11, 5,
        "Cd", "Cadmium", "112.411", 12, 5,
        "In", "Indium", "114.818", 13, 5,
        "Sn", "Tin", "118.71", 14, 5,
        "Sb", "Antimony", "121.76", 15, 5,
        "Te", "Tellurium", "127.6", 16, 5,
        "I", "Iodine", "126.90447", 17, 5,
        "Xe", "Xenon", "131.293", 18, 5,
        "Cs", "Caesium", "132.9054", 1, 6,
        "Ba", "Barium", "132.9054", 2, 6,
        "La", "Lanthanum", "138.90547", 4, 9,
        "Ce", "Cerium", "140.116", 5, 9,
        "Pr", "Praseodymium", "140.90765", 6, 9,
        "Nd", "Neodymium", "144.242", 7, 9,
        "Pm", "Promethium", "(145)", 8, 9,
        "Sm", "Samarium", "150.36", 9, 9,
        "Eu", "Europium", "151.964", 10, 9,
        "Gd", "Gadolinium", "157.25", 11, 9,
        "Tb", "Terbium", "158.92535", 12, 9,
        "Dy", "Dysprosium", "162.5", 13, 9,
        "Ho", "Holmium", "164.93032", 14, 9,
        "Er", "Erbium", "167.259", 15, 9,
        "Tm", "Thulium", "168.93421", 16, 9,
        "Yb", "Ytterbium", "173.054", 17, 9,
        "Lu", "Lutetium", "174.9668", 18, 9,
        "Hf", "Hafnium", "178.49", 4, 6,
        "Ta", "Tantalum", "180.94788", 5, 6,
        "W", "Tungsten", "183.84", 6, 6,
        "Re", "Rhenium", "186.207", 7, 6,
        "Os", "Osmium", "190.23", 8, 6,
        "Ir", "Iridium", "192.217", 9, 6,
        "Pt", "Platinum", "195.084", 10, 6,
        "Au", "Gold", "196.966569", 11, 6,
        "Hg", "Mercury", "200.59", 12, 6,
        "Tl", "Thallium", "204.3833", 13, 6,
        "Pb", "Lead", "207.2", 14, 6,
        "Bi", "Bismuth", "208.9804", 15, 6,
        "Po", "Polonium", "(209)", 16, 6,
        "At", "Astatine", "(210)", 17, 6,
        "Rn", "Radon", "(222)", 18, 6,
        "Fr", "Francium", "(223)", 1, 7,
        "Ra", "Radium", "(226)", 2, 7,
        "Ac", "Actinium", "(227)", 4, 10,
        "Th", "Thorium", "232.03806", 5, 10,
        "Pa", "Protactinium", "231.0588", 6, 10,
        "U", "Uranium", "238.02891", 7, 10,
        "Np", "Neptunium", "(237)", 8, 10,
        "Pu", "Plutonium", "(244)", 9, 10,
        "Am", "Americium", "(243)", 10, 10,
        "Cm", "Curium", "(247)", 11, 10,
        "Bk", "Berkelium", "(247)", 12, 10,
        "Cf", "Californium", "(251)", 13, 10,
        "Es", "Einstenium", "(252)", 14, 10,
        "Fm", "Fermium", "(257)", 15, 10,
        "Md", "Mendelevium", "(258)", 16, 10,
        "No", "Nobelium", "(259)", 17, 10,
        "Lr", "Lawrencium", "(262)", 18, 10,
        "Rf", "Rutherfordium", "(267)", 4, 7,
        "Db", "Dubnium", "(268)", 5, 7,
        "Sg", "Seaborgium", "(271)", 6, 7,
        "Bh", "Bohrium", "(272)", 7, 7,
        "Hs", "Hassium", "(270)", 8, 7,
        "Mt", "Meitnerium", "(276)", 9, 7,
        "Ds", "Darmstadium", "(281)", 10, 7,
        "Rg", "Roentgenium", "(280)", 11, 7,
        "Cn", "Copernicium", "(285)", 12, 7,
        "Uut", "Unutrium", "(284)", 13, 7,
        "Fl", "Flerovium", "(289)", 14, 7,
        "Uup", "Ununpentium", "(288)", 15, 7,
        "Lv", "Livermorium", "(293)", 16, 7,
        "Uus", "Ununseptium", "(294)", 17, 7,
        "Uuo", "Ununoctium", "(294)", 18, 7
    ];

    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private renderer: CSS3DRenderer;
    private controls: OrbitControls | TrackballControls;

    private targets = {
        base: [] as Object3D[],
        table: [] as Object3D[],
        sphere: [] as Object3D[],
        helix: [] as Object3D[],
        grid: [] as Object3D[]
    };

    private options: CSSRendererOptions;
    private containerSize: { width: number, height: number };

    constructor(private markdown: MarkdownService,) {
    }

    private get aspectRatio(): number {
        return this.containerSize.width / this.containerSize.height;
    }

    init(options: CSSRendererOptions) {
        this.options = options;
        this.containerSize = { width: options.width, height: options.height };

        this.initScene();

        this.initCamera();

        this.initObjects();

        this.addMenuClickListeners();

        this.initRenderer();

        this.initControls();

        this.transform(this.targets.table, 2000);

        this.animate();

        window.addEventListener('resize', () => {
            this.onCanvasResize(options.element.clientWidth, options.element.clientHeight);
        }, false);
    }

    addHTML(element: any) {
        const obj = new CSS3DObject(element);
        this.scene.add(obj);
    }

    onCanvasResize(width: number, height: number): void {
        this.containerSize = { width, height };
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.render(); // needed?
    }

    loop() {
        this.animate();
    }

    private animate() {
        TWEEN.update();
        this.controls.update();
    }

    private initCamera() {
        this.camera = new THREE.PerspectiveCamera(40, this.aspectRatio, 1, 10000);
        this.camera.position.z = 3000 * scaleFactor;
    }

    private initScene() {
        this.scene = new THREE.Scene();
    }

    private initRenderer() {
        this.renderer = new CSS3DRenderer();
        this.renderer.setSize(this.containerSize.width, this.containerSize.height);
        this.options.element.appendChild(this.renderer.domElement);
    }

    private initControls() {
        // this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        // // this.controls.rotateSpeed = 0.5;
        // this.controls.minDistance = 500;
        // this.controls.maxDistance = 6000;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.addEventListener('change', () => {
            console.groupCollapsed('Camera')
            console.log('Position:', this.camera.position);
            console.log('Rotation:', this.camera.rotation);
            console.log('Quaternion:', this.camera.quaternion);
            console.groupEnd();
            this.render();
        });
    }

    private initObjects() {
        this.simpleObjectsLayout();
        this.generateGeometricLayouts();

        // testing markdown
        const markdownObject = this.markdown.html;
        this.addHTML(markdownObject);
    }

    private simpleObjectsLayout() {
        for (let i = 0; i < this.table.length; i += 5) {
            let object = new CSS3DObject(this.htmlElement(this.table, i));
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;

            this.scene.add(object);
            this.targets.base.push(object);
            this.tableLayout(this.table, i);
        }
    }

    private htmlElement(table: any[], i: number) {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        const number = document.createElement('div');
        number.className = 'number';
        number.innerHTML = String((i / 5) + 1);
        element.appendChild(number);

        const symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = table[i];
        element.appendChild(symbol);

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
        element.appendChild(details);

        element.addEventListener('pointerdown', () => this.elementClickHandler(i, element), false);

        return element;
    }

    private addMenuClickListeners() {
        this.addBtnClickListener(this.targets.table, 'table');
        this.addBtnClickListener(this.targets.sphere, 'sphere');
        this.addBtnClickListener(this.targets.helix, 'helix');
        this.addBtnClickListener(this.targets.grid, 'grid');
    }

    private addBtnClickListener(target: Object3D[], elementId: string) {
        const button = document.getElementById(elementId)!;
        button.addEventListener('click', () => {
            this.transform(target, 2000);
        }, false);
    }

    private elementClickHandler(i: number, element: HTMLElement) {
        console.log('elementClickHandler');
        element.classList.add('selected');

        const source = this.targets.base[i / 5];

        const resetDuration = 750;
        const rotateDuration = Math.random() * 2000 + resetDuration;
        const moveDuration = rotateDuration + 2000 + resetDuration;
        const totalDuration = 2 * (rotateDuration + moveDuration);

        // reset all current tweens and positions
        this.transform(this.targets.table, resetDuration);

        const destination = new Vector3();
        this.camera.getWorldDirection(destination);  // store camera direction vector

        const offset = 250 * scaleFactor;
        destination.multiplyScalar(offset); // scale the camera direction to be in-front of camera
        destination.add(this.camera.position); // move the direction vector to the camera position

        // rotate target
        this.transformObjectRotation(source, this.camera, rotateDuration);
        // move target
        new TWEEN.Tween(source.position)
            .to(destination, moveDuration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        // to re-render while tweening
        new TWEEN.Tween(this)
            .to({}, totalDuration)
            .onUpdate(() => this.render())
            .start();
    }

    private tableLayout(table: any[], index: number) {
        let object = new Object3D();

        object.position.x = (table[index + 3] * 140 * scaleFactor) - 1330;
        object.position.y = -(table[index + 4] * 180 * scaleFactor) + 990;
        this.targets.table.push(object);
    }

    private generateGeometricLayouts() {

        let sphereVector = new Vector3();
        let helixVector = new Vector3();

        for (let i = 0, l = this.targets.base.length; i < l; i++) {
            this.addSphereObject(sphereVector, i, l);
            this.addHelixObject(helixVector, i);
            this.addGridObject(i);
        }
    }

    private addSphereObject(sphereVector: Vector3, index: number, length: number) {

        const phi = Math.acos(-1 + (2 * index) / length);
        const theta = Math.sqrt(length * Math.PI) * phi;
        let object = new Object3D();

        object.position.setFromSphericalCoords(800, phi, theta);

        sphereVector.copy(object.position).multiplyScalar(2);

        object.lookAt(sphereVector);

        this.targets.sphere.push(object);
    }

    private addHelixObject(helixVector: Vector3, index: number) {
        const theta = index * 0.175 + Math.PI;
        const y = -(index * 8) + 450;
        let object = new Object3D();

        object.position.setFromCylindricalCoords(900, theta, y);

        helixVector.x = object.position.x * 2;
        helixVector.y = object.position.y;
        helixVector.z = object.position.z * 2;

        object.lookAt(helixVector);

        this.targets.helix.push(object);
    }

    private addGridObject(index: number) {
        let object = new Object3D();
        object.position.x = ((index % 5) * 400) - 800;
        object.position.y = (-(Math.floor(index / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(index / 25)) * 1000 - 2000;
        this.targets.grid.push(object);
    }

    private transform(target: Object3D[], duration: number) {

        TWEEN.removeAll();

        for (let i = 0; i < this.targets.base.length; i++) {
            let object = this.targets.base[i];
            let targetObject = target[i];
            this.transformObjectPosition(object, targetObject, duration);
            this.transformObjectRotation(object, targetObject, duration);
        }

        new TWEEN.Tween(this)
            .to({}, duration * 2)
            .onUpdate(() => this.render())
            .start();

    }

    private transformObjectPosition(object: Object3D, targetObject: Object3D, duration: number) {
        new TWEEN.Tween(object.position)
            .to({
                x: targetObject.position.x,
                y: targetObject.position.y,
                z: targetObject.position.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    private transformObjectRotation(object: Object3D, targetObject: Object3D, duration: number) {
        new TWEEN.Tween(object.rotation)
            .to({
                x: targetObject.rotation.x,
                y: targetObject.rotation.y,
                z: targetObject.rotation.z
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }
}