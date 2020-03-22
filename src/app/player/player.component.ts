import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';
import {Player, Rect, State} from '../interfaces/player';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {


  constructor() { }
  player: Player;
  keyDown: object = {};
  gameLoopF;
  enemies: Map<string, Player> = new Map<string, Player>();
  initialized: boolean = false; 
  createEnemiesCall;

  ngOnInit() {

    let rect: Rect = { 
    x: 0,
    y: 0,
    width: 60,
    height: 60 };

    let playerState = {     
      position:  'absolute',  
      color: 'lightblue',     
      width:  '100px',
      height:  '100px',
      left : rect.x+'px',
      top : rect.y+'px',
      display : 'block'
    };
    this.player = {
      rect: rect,
      name: "Jake",
      speed: 5.0,
      state: playerState,
      dead: false
    }

    this.createEnemies();


    this.keyDown = {};



    this.gameLoop();
    this.initialized = true;
  }


  getPlayerState(){
    return this.player.state;
  }

  getEnemyState(){
    return this.enemies.get("Freddy").state;
  }
  

  gameLoop() {
      this.gameLoopF = setInterval(() => {
        if(this.keyDown["d"]) {
          this.player.rect.x += this.player.speed;
        }
        if(this.keyDown["a"]) {
          this.player.rect.x -= this.player.speed;
        }
        if(this.keyDown["w"]) {
          this.player.rect.y -=  this.player.speed;
        }
        if(this.keyDown["s"]) {
          this.player.rect.y +=  this.player.speed;
        }
    
        this.player.state.left = this.player.rect.x+"px";
        this.player.state.top = this.player.rect.y+"px";
    
        // redraw/reposition your object here
        // also redraw/animate any objects not controlled by the user
        
        this.didCollideWithAnything();
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


  createEnemies(){
    //

    this.enemies = new Map<string, Player>();

    let rect: Rect = { 
      x: 400,
      y: 400,
      width: 60,
      height: 60 };

    let enemyState: State = {
      position:  'absolute',  
      color: 'lightblue',     
      width:  '100px',
      height:  '100px',
      left: rect.x+'px',
      top: rect.y+'px',
      display: 'block'
    };

    let enemy: Player = {
      rect: rect,
      name: "Freddy",
      speed: 2,
      state: enemyState,
      dead: false
    }
    let myMap = new Map();
    this.enemies.set(enemy.name, enemy);

  }


  didCollideWithAnything(){

    function didCollide(rect1: Rect, rect2: Rect){
      if (rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y) {
          return true;
      }
       return false;
     }

    this.enemies.forEach((value: Player, key: string) => {
      if(didCollide(this.player.rect, value.rect)){
        if (value.dead){
        }
        else{
          value.dead = true;
          value.state.display ='none';
          //For now.. lets just respawn the enemies back after 5 seconds
          this.createEnemiesCall = setInterval(() => {        
            this.createEnemies();
          }, 5000);
       }

      }
    });


  }




}

