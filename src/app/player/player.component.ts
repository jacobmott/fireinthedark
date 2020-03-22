import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {


  constructor() { }

  positionDetails: string = "style = position: absolute; width=30px; height=30px; background-color:lightblue; ";
  positionClass: string = "";
  xPos: number = 0;
  yPos: number = 0;
  playerElement: HTMLElement;
  currentStyles: object;
  speed: number = 5;
  keyDown: object = {};
  gameLoopF;

  ngOnInit() {
    this.currentStyles = {     
      'position':  'absolute',  
      'color': 'lightblue',     
      'width':  '100px',
      'height':  '100px',
      'left' : this.xPos+'px',
      'top' : this.yPos+'px'
    };

    this.playerElement = <HTMLElement>document.getElementById("playerElement");
    this.speed = 5;
    this.keyDown = {};
    this.gameLoop();
  }
  

  gameLoop() {
      this.gameLoopF = setInterval(() => {
        if(this.keyDown["d"]) {
          this.xPos += this.speed;
        }
        if(this.keyDown["a"]) {
          this.xPos -= this.speed;
        }
        if(this.keyDown["w"]) {
          this.yPos -= this.speed;
        }
        if(this.keyDown["s"]) {
          this.yPos += this.speed;
        }
    
        this.currentStyles['left'] = this.xPos+"px";
        this.currentStyles['top'] = this.yPos+"px";
    
        // redraw/reposition your object here
        // also redraw/animate any objects not controlled by the user
       
      }, 10);

  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e){
    e = e || event; // to deal with IE
    this.keyDown[e.key] = false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e){
    e = e || event; // to deal with IE
    this.keyDown[e.key] = true;
  }


}

