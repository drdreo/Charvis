import { Injectable } from "@angular/core";
import {
    Body,
    Box,
    Plane,
    PointToPointConstraint,
    Vec3,
    World,
} from "cannon-es";

const REPULSIVE_FORCE = 0.01;
const CANNON_SIZE_FACTOR = 0.5; // physics models seems to be bigger
/**
 * The simulation service is responsible for everything physic related. Calculating velocity, updating position etc.
 */
@Injectable({ providedIn: "root" })
export class SimulationService {
    private world = new World();

    private floor: Body;

    public step(step: number) {
        this.world.fixedStep();
    }

    getBodies(): Body[] {
        return this.world.bodies;
    }

    init(): void {
        this.createFloor();
        this.createShapes();

        this.addGravity();

        this.world.addEventListener(
            "collide",
            (event: { bodyA: Body; bodyB: Body }) => {
                const bodyA = event.bodyA;
                const bodyB = event.bodyB;

                console.log("collision", bodyA, bodyB);
                // Apply a small impulse to each body to create a repelling force
                // bodyA.applyImpulse(new Vec3(1, 0, 0), bodyA.position);
                // bodyB.applyImpulse(new Vec3(-1, 0, 0), bodyB.position);
            },
        );
    }

    getWorld() {
        return this.world;
    }

    private createShapes() {
        for (let i = 0; i < 10; i++) {
            // Create a RigidBody object for the shape
            const body = new Body({
                mass: 10000000, // Set the mass of the body
                shape: new Box(
                    new Vec3(
                        CANNON_SIZE_FACTOR,
                        CANNON_SIZE_FACTOR,
                        CANNON_SIZE_FACTOR,
                    ),
                ), // Set the shape of the body to a sphere with a radius of 1
                position: new Vec3(i * 1.1, i * 1.1 + 1, 3),
            });

            this.createConstraint(body, this.floor);
            this.world.addBody(body);

            body.collisionFilterGroup = 1;
            body.collisionFilterMask = 1;
        }
    }

    private createFloor() {
        const planeShapeYmin = new Plane();
        const planeYmin = new Body({ mass: 0 });
        planeYmin.addShape(planeShapeYmin);
        planeYmin.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
        planeYmin.position.set(0, 0, 0);

        // const plane = new Plane();
        // const floorBody = new Body({
        //     mass: 0, // Set the mass of the floor to 0 to make it static
        //     shape: plane,
        //     position: new Vec3(0, 0, 0),
        // });
        // floorBody.quaternion.setFromAxisAngle(new Vec3(1,0,0),Math.PI/2);
        // floorBody.position.set(0,5,0);
        // const xAxis = new Vec3(0,0,1);
        // floorBody.quaternion.setFromAxisAngle(xAxis, 90);

        this.floor = planeYmin;
        // fix rotated floor plane to make it X -> right, Y -> up, Z -> near
        // this.floor.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI)

        this.world.addBody(this.floor);
    }

    private createConstraint(bodyA: Body, bodyB: Body) {
        const constraint = new PointToPointConstraint(
            bodyA,
            new Vec3(5, 5, 5),
            bodyB,
            new Vec3(0, 0, 10),
        );

        this.world.addConstraint(constraint); // Add the constraint to the physics world
    }

    private addGravity(): void {
        this.world.gravity.set(0, 1, 0);
    }
}
