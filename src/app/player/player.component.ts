import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';
import {Player, Rect, State, Bullet, Direction} from '../interfaces/player';
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
  readonly PLAYER_SPEED: number = 800;
  readonly ENEMY_SPEED: number = 300;
  readonly BULLET_SPEED: number = 2000;
  enemiesCreation: number = 0;
  enemiesNotCreation: number = 0;
  callCreate: number = 0;
  numberOfClicks: number = 0;
  leftClick: boolean = false;
  bullets: Map<number, Bullet> = new Map<number, Bullet>();
  bulletDirectionX: number = 0;
  bulletDirectionY: number = 0; 
  createNextBullet: boolean = true;
  createNextBulletTimer;
  bulletsIds: number = 0;

  ngOnInit() {

    this.enemies = new Map<string, Player>();
    this.bullets = new Map<number, Bullet>();

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
      dead: false,
      id: 0,
      img: "assets/player.png"
    }

    this.keyDown = {};

    this.gameLoop();
    this.createEnemiesA();
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
  

  gameLoop() {
      this.gameLoopF = setInterval(() => {

        let bulletDirectionX = 0;
        let bulletDirectionY = 0;

        if(this.keyDown["d"]) {
          bulletDirectionX = 1;
          this.player.rect.x += this.player.speed/this.FPS;
        }
        if(this.keyDown["a"]) {
          bulletDirectionX = -1;
          this.player.rect.x -= this.player.speed/this.FPS;
        }
        if(this.keyDown["w"]) {
          bulletDirectionY = -1;
          this.player.rect.y -=  this.player.speed/this.FPS;
        }
        if(this.keyDown["s"]) {
          bulletDirectionY = 1;
          this.player.rect.y +=  this.player.speed/this.FPS;
        }


        if(this.leftClick) {
          if (this.createNextBullet){
            let xPos = this.player.rect.x;
            let yPos = this.player.rect.y;      
            if (!bulletDirectionX && !bulletDirectionY){
              bulletDirectionX = -1;
            }

            if (bulletDirectionX === 1){
              xPos = this.player.rect.x + this.player.rect.width-50;
            }
            else if (bulletDirectionX === 0 || bulletDirectionX === -1){
              xPos = this.player.rect.x;
            }

            if (bulletDirectionY === 1){
              yPos = this.player.rect.y + this.player.rect.height-50;
            }
            else if (bulletDirectionY === 0 || bulletDirectionY === -1){
              yPos = this.player.rect.y;
            }

            this.createNextBulletTimer = setTimeout(() => { this.createNextBulletTimerF(); }, 200);
            this.createNewBullet(bulletDirectionX, bulletDirectionY, xPos, yPos);
            this.createNextBullet = false;
          }
        }

    
        this.player.state.left = this.player.rect.x+"px";
        this.player.state.top = this.player.rect.y+"px";
    
        // redraw/reposition your object here
        // also redraw/animate any objects not controlled by the user
        
        this.didCollideWithAnything();
        this.handleAI();
        this.updateBullets();
      }, 10);

  }


  createNextBulletTimerF(){
    this.createNextBullet = true;
  }


  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event) {
    //console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
    this.leftClick = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    //console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
    this.leftClick = false;
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

  createNewBullet(bulletDirectionX, bulletDirectionY, xPos, yPos){
  
    this.bulletsIds = this.bulletsIds+1;
    
    let rect: Rect = { 
      x: xPos,
      y: yPos,
      width: 20,
      height: 20 };

    let direction: Direction = { 
      x: bulletDirectionX,
      y: bulletDirectionY };
  
    let bulletState: State = {
      position:  'absolute',  
      color: 'lightblue',     
      width:  rect.width+'px',
      height:  rect.height+'px',
      left: rect.x+'px',
      top: rect.y+'px',
      display: 'block'
    };
  
    let bullet: Bullet = {
      direction: direction,
      rect: rect,
      name: "Bullet",
      speed: this.BULLET_SPEED,
      state: bulletState,
      id: this.bulletsIds,
      active: true,
      img: "assets/bullet.png"
    }
  
    this.bullets.set(bullet.id, bullet);
  }


  updateBullets(){
    this.bullets.forEach((bullet: Bullet, key: number) => {
      if(bullet.active){
        if (Math.abs(bullet.rect.x) > 2000){
          bullet.state.display = 'none';
          bullet.active = false;
          this.bullets.delete(bullet.id);
        }
        else if (Math.abs(bullet.rect.y) > 2000){
          bullet.state.display = 'none';
          bullet.active = false;
          this.bullets.delete(bullet.id);
        }
        else{
          bullet.rect.x = bullet.rect.x+(bullet.direction.x*(this.BULLET_SPEED/this.FPS));
          bullet.rect.y = bullet.rect.y+(bullet.direction.y*(this.BULLET_SPEED/this.FPS));
          bullet.state.left = bullet.rect.x+"px";
          bullet.state.top = bullet.rect.y+"px";
        }
      }
      else{
        bullet.state.display = 'none';
        bullet.active = false;
        this.bullets.delete(bullet.id);
      }
    }); 
  }


  getEnemiesCreation(){
    return this.enemiesCreation;
  }
  getEnemiesNotCreation(){
    return this.enemiesNotCreation;
  }

  getEnemySource(){
    if ( (this.enemies) && this.enemies.size > 0 ){
      if ( this.enemies.has("Freddy") ){
        if (this.enemies.get("Freddy").dead){
         this.enemies.get("Freddy").img = 'assets/monster-dead.png';
        }
        else{
          this.enemies.get("Freddy").img = 'assets/monster.png';
        }
      }
    }
    return  this.enemies.get("Freddy").img;
  }

  createEnemiesA(){
    //
    if ( (this.enemies) && this.enemies.size > 0 ){
      if ( this.enemies.has("Freddy") ){
        if (this.enemies.get("Freddy").dead){
        }
        else{
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
      id: 0,
      speed: this.ENEMY_SPEED,
      state: enemyState,
      dead: false,
      img: "assets/monster.png"
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
    let recreateEnemy: boolean = false;
    this.enemies.forEach((enemy: Player, key: string) => {
      if(didCollide(this.player.rect, enemy.rect)){
        if (enemy.dead){
        }
        else{
          enemy.dead = true;
          enemy.rect.x = 0;
          enemy.rect.y = 0;
          recreateEnemy = true;
       }
     }
     this.bullets.forEach((bullet: Bullet, key: number) => {
      if(didCollide(enemy.rect, bullet.rect)){
        if (enemy.dead){
        }
        else{
          enemy.dead = true;
          enemy.rect.x = 0;
          enemy.rect.y = 0;
          recreateEnemy = true;
          bullet.active = false;
          this.bullets.delete(bullet.id);
          bullet.state.display = 'none';
        }
      }
    })
    if (recreateEnemy){
      this.createEnemiesCall = setTimeout(() => { this.createEnemiesA(); }, 5000);
    }

   });


  }

  getBulletImage(id: number){
    return this.bullets.get(id).img;
  }

  getBulletState(id: number){
    return this.bullets.get(id).state;
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
        enemy.img = 'assets/monster-dead.png';
        this.createEnemiesCall = setTimeout(() => { enemy.state.display ='none'; }, 5000);
      }
      else{
        enemy.img = 'assets/monster.png';
        moveTowardPlayer(this.player, enemy,this.FPS);
      }
    });


  }


  




}

