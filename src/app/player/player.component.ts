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
  readonly FPS: number = 100;
  readonly PLAYER_SPEED: number = 500;
  readonly ENEMY_SPEED: number = 100;
  enemiesCreation: number = 0;
  enemiesNotCreation: number = 0;
  callCreate: number = 0;
  
  
  ngOnInit() {

    this.enemies = new Map<string, Player>();

    let rect: Rect = { 
    x: 0,
    y: 0,
    width: 100,
    height: 100 };

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
      speed: this.PLAYER_SPEED,
      state: playerState,
      dead: false
    }

    this.keyDown = {};

    this.gameLoop();
    this.createEnemiesA();
    this.createEnemies();
    this.initialized = true;
  }

  getEnemyStateJSON(){
    if (this.enemies.get("Freddy")){
      return JSON.stringify(this.enemies.get("Freddy"));
    }
    return {};
  }
  

  getPlayerState(){
    if (this.player){
      return this.player.state;
    }
    return;
  }

  getEnemyState(){
    if (this.enemies){
      if (this.enemies.get("Freddy")){
        return this.enemies.get("Freddy").state;
      }
    }
    return;
  }
  
  createEnemies() {
    //For now.. lets just respawn the enemies back after 5 seconds
    this.createEnemiesCall = setInterval(() => { this.createEnemiesA(); }, 5000);
  }

  gameLoop() {
      this.gameLoopF = setInterval(() => {
        if(this.keyDown["d"]) {
          this.player.rect.x += this.player.speed/this.FPS;
        }
        if(this.keyDown["a"]) {
          this.player.rect.x -= this.player.speed/this.FPS;
        }
        if(this.keyDown["w"]) {
          this.player.rect.y -=  this.player.speed/this.FPS;
        }
        if(this.keyDown["s"]) {
          this.player.rect.y +=  this.player.speed/this.FPS;
        }
    
        this.player.state.left = this.player.rect.x+"px";
        this.player.state.top = this.player.rect.y+"px";
    
        // redraw/reposition your object here
        // also redraw/animate any objects not controlled by the user
        
        this.didCollideWithAnything();
        this.handleAI();
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
  getEnemiesCreation(){
    return this.enemiesCreation;
  }
  getEnemiesNotCreation(){
    return this.enemiesNotCreation;
  }

  createEnemiesA(){
    //
    this.callCreate = this.callCreate+1;
    if ( (this.enemies) && this.enemies.size > 0 ){
      if ( this.enemies.has("Freddy") ){
        if (this.enemies.get("Freddy").dead){
          this.enemiesCreation = this.enemiesCreation+1;
        }
        else{
          this.enemiesNotCreation = this.enemiesNotCreation+1;
          return;
        }
      }
    }
    this.enemies = new Map<string, Player>();

    let rect: Rect = { 
      x: 400,
      y: 400,
      width: 100,
      height: 100 };

    let enemyState: State = {
      position:  'absolute',  
      color: 'lightblue',     
      width:  rect.width+'px',
      height:  rect.height+'px',
      left: rect.x+'px',
      top: rect.y+'px',
      display: 'block'
    };

    let enemy: Player = {
      rect: rect,
      name: "Freddy",
      speed: this.ENEMY_SPEED,
      state: enemyState,
      dead: false
    }

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

    this.enemies.forEach((enemy: Player, key: string) => {
      if(didCollide(this.player.rect, enemy.rect)){
        if (enemy.dead){
        }
        else{
          enemy.dead = true;
          enemy.state.display ='none';
          enemy.rect.x = 0;
          enemy.rect.y = 0;
       }
     }
    });


  }



  handleAI(){

    function updateEnemyState(enemy: Player){
    
      let rect: Rect = { 
        x: enemy.rect.x,
        y: enemy.rect.y,
        width: enemy.rect.width,
        height: enemy.rect.height };
  
      let enemyState: State = {
        position:  'absolute',  
        color: 'lightblue',     
        width:  rect.width+'px',
        height:  rect.height+'px',
        left: rect.x+'px',
        top: rect.y+'px',
        display: 'block'
      };

      enemy.rect = rect;
      enemy.state = enemyState;

    }



    function moveTowardPlayer(player: Player, enemy: Player, FPS: number){
      if (enemy.rect.x < player.rect.x){
        enemy.rect.x += enemy.speed/FPS;
      }
      else if (enemy.rect.x > player.rect.x){
        enemy.rect.x -= enemy.speed/FPS;
      }

      if (enemy.rect.y < player.rect.y){
        enemy.rect.y +=  enemy.speed/FPS;

      }
      else if (enemy.rect.y > player.rect.y){
        enemy.rect.y -=  enemy.speed/FPS;
      }

      updateEnemyState(enemy);

    }

    this.enemies.forEach((enemy: Player, key: string) => {
      if (enemy.dead){

      }
      else{
        moveTowardPlayer(this.player, enemy,this.FPS);
      }
    });


  }




}

