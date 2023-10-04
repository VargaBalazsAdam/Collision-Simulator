import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.component.html',
  styleUrls: ['./simulate.component.css']
})
export class SimulateComponent implements OnInit {

  private cube1: any = {
    id: "cube1",
    mass: 0,
    force: 0,
    position: 0,
    velocity: 0,
    width: 0
  };
  private cube2: any = {
    id: "cube2",
    mass: 0,
    force: 0,
    position: 0,
    velocity: 0,
    width: 0
  };
  private animationFrameId: number | null = null;
  ngOnInit(): void {
  }

  startSimulation(): void {
    if (this.animationFrameId != null) {
      this.stopSimulation();
      return;
    }
    const xAttribute1 = (<HTMLInputElement>document.getElementById('cube1')).getAttribute('x');
    if (xAttribute1 !== null) {
      this.cube1.position = parseFloat(xAttribute1);
    }
    const xAttribute2 = (<HTMLInputElement>document.getElementById('cube2')).getAttribute('x');
    if (xAttribute2 !== null) {
      this.cube2.position = parseFloat(xAttribute2);
    }
    const wAttribute1 = (<HTMLInputElement>document.getElementById('cube1')).getAttribute('width');
    if (wAttribute1 !== null) {
      this.cube1.width = parseFloat(wAttribute1);
    }
    const wAttribute2 = (<HTMLInputElement>document.getElementById('cube2')).getAttribute('width');
    if (wAttribute2 !== null) {
      this.cube2.width = parseFloat(wAttribute2);
    }
    this.cube1.mass = parseFloat((<HTMLInputElement>document.getElementById('cube1-weight')).value);
    this.cube1.force = parseFloat((<HTMLInputElement>document.getElementById('cube1-force')).value);
    this.cube2.mass = parseFloat((<HTMLInputElement>document.getElementById('cube2-weight')).value);
    this.cube2.force = parseFloat((<HTMLInputElement>document.getElementById('cube2-force')).value);

    this.updateSimulation();
  }

  minVelocity = 0.09;

  updateCube(cube: any): void {
    
    const frictionForce = 0.2 * cube.mass * 9.8;
    const acceleration = (cube.force - frictionForce) / cube.mass;
    cube.force *= 0.99;
    console.log(cube)
    
    if (cube.velocity >= 0) {
      cube.velocity += acceleration;
      if (cube.velocity < 0 && cube.force < frictionForce) {
        cube.velocity = 0;
        if (this.checkVelocityValidation(cube))
          return;
      }
    } else {
      cube.velocity -= acceleration;
      if (cube.velocity > 0 && cube.force < frictionForce) {
        cube.velocity = 0; 
        if (this.checkVelocityValidation(cube))
          return;
      }
    }

    cube.position += cube.velocity;

    if (cube.position >= 380 - cube.width) {
      cube.position = 380 - cube.width;
      cube.velocity = -Math.abs(cube.velocity) * 0.8;
      if (this.checkVelocityValidation(cube))
          return;
    }
    if (cube.position <= 10) {
      cube.position = 10;
      cube.velocity = Math.abs(cube.velocity) * 0.8;
      if (this.checkVelocityValidation(cube))
        return;
    }
    
  }

  checkVelocityValidation(cube:any):boolean{
    if (Math.abs(cube.velocity) < this.minVelocity && this.animationFrameId !== null) {
      cube.velocity = 0;
      return false;
    }
    return true;
  }

  updateCubeSVG(cube: any): void {
    const svgElement = document.getElementById(cube.id);
    if (svgElement) {
      svgElement.setAttribute('x', cube.position);
    }
  }

  updateSimulation(): void {
    this.updateCube(this.cube1);
    this.updateCube(this.cube2);
    this.updateCubeSVG(this.cube1);
    this.updateCubeSVG(this.cube2);
    this.checkCollision();
    if (this.cube1.velocity == 0 && this.cube2.velocity == 0)
    {
      this.stopSimulation();
      return;
    }
    this.animationFrameId = requestAnimationFrame(() => {
      this.updateSimulation();
    });
  }

  checkCollision(): void {
    if (this.cube1.position < this.cube2.position + this.cube2.width) {
      this.cube1.position = this.cube2.position + this.cube2.width;
    }
    if (this.cube2.position + this.cube2.width >= this.cube1.position) {
  
      const newVelocity1 = (this.cube1.velocity * (this.cube1.mass - this.cube2.mass) + 2 * this.cube2.mass * this.cube2.velocity) / (this.cube1.mass + this.cube2.mass);
      const newVelocity2 = (this.cube2.velocity * (this.cube2.mass - this.cube1.mass) + 2 * this.cube1.mass * this.cube1.velocity) / (this.cube1.mass + this.cube2.mass);
  
      this.cube1.velocity = newVelocity1;
      this.cube2.velocity = newVelocity2;
  
      if (this.checkVelocityValidation(this.cube1) || this.checkVelocityValidation(this.cube2))
        return;
    }
  }
  
  

  stopSimulation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
