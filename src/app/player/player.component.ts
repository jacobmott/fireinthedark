import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';
import {Player, Rect, State, Bullet, Direction, Item} from '../interfaces/player';
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
  enemies: Map<number, Player> = new Map<number, Player>();
  initialized: boolean = false; 
  createEnemiesCall;
  readonly FPS: number = 100;
  readonly PLAYER_SPEED: number = 800;
  readonly ENEMY_SPEED: number = 300;
  readonly BULLET_SPEED: number = 2000;
  readonly ITEM_SPEED: number = 0;
  callCreate: number = 0;
  numberOfClicks: number = 0;
  leftClick: boolean = false;
  bullets: Map<number, Bullet> = new Map<number, Bullet>();
  bulletDirectionX: number = 0;
  bulletDirectionY: number = 0; 
  createNextBullet: boolean = true;
  createNextBulletTimer;
  bulletsIds: number = 0;
  enemyIds: number = 0;
  worldItemIds: number = 0;
  worldItems: Map<number, Item> = new Map<number, Item>();
  createNextEnemyTimer;
  readonly PLAYER_ALIVE_IMAGE: string = "assets/player.png";
  readonly ENEMY_ALIVE_IMAGE: string = "assets/monster.png";  
  readonly ENEMY_DEAD_IMAGE: string = "assets/monster-dead.png";  
  readonly BULLET_IMAGE: string = "assets/bullet.png";
  readonly ITEM_IMAGE: string = "assets/treasure-chest.png";
  readonly ITEM_UNUSED_IMAGE: string = "assets/treasure-chest.png";
  readonly ITEM_USED_IMAGE: string = "assets/treasure-chest-used.png";
  
  ngOnInit() {

    this.enemies = new Map<number, Player>();
    this.bullets = new Map<number, Bullet>();
    this.worldItems = new Map<number, Item>();    

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
      img: this.PLAYER_ALIVE_IMAGE
    }

    this.keyDown = {};
    this.createItems();
    this.gameLoop();
    this.createNextEnemyTimer = setInterval(() => { this.addNewEnemy(400, 400); }, 3000);
    this.initialized = true;
  }

  getEnemyStateJSON(id: number){
    if (this.enemies.get(id)){
      return JSON.stringify(this.enemies.get(id));
    }
    return {};
  }
  

  getPlayerState(){
    if (this.player){
      return this.player.state;
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

            this.createNewBullet(bulletDirectionX, bulletDirectionY, xPos, yPos);
            this.createNextBullet = false;
            this.createNextBulletTimer = setTimeout(() => { this.createNextBulletTimerF(); }, 200);
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

  createItems(){
    for (let i = 0; i < 5; i++) {
      let xPos: number = this.getRandomInt(0,1000);
      let yPos: number = this.getRandomInt(0,1000);
      this.createNewItem(xPos,yPos);
    }
  }


  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
  
  createNewItem(xPos: number, yPos: number){
  
    this.worldItemIds = this.worldItemIds+1;

    let rect: Rect = { 
      x: xPos,
      y: yPos,
      width: 100,
      height: 100 };

    let itemState: State = {
      position:  'absolute',  
      color: 'lightblue',     
      width:  rect.width+'px',
      height:  rect.height+'px',
      left: rect.x+'px',
      top: rect.y+'px',
      display: 'block'
    };

    let item: Item = {
      rect: rect,
      name: "Item"+this.worldItemIds,
      id: this.worldItemIds,
      speed: this.ITEM_SPEED,
      state: itemState,
      usedState: false,
      img: this.ITEM_UNUSED_IMAGE
    }

    this.worldItems.set(item.id, item);
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
      img: this.BULLET_IMAGE
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

  addNewEnemy(xPos: number, yPos: number){
  
    this.enemyIds = this.enemyIds+1;

    let rect: Rect = { 
      x: xPos,
      y: yPos,
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
      name: "Enemy"+this.enemyIds,
      id: this.enemyIds,
      speed: this.ENEMY_SPEED,
      state: enemyState,
      dead: false,
      img: this.ENEMY_ALIVE_IMAGE
    }

    this.enemies.set(enemy.id, enemy);
  }

  removeEnemy(id: number){
    this.enemies.delete(id);
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

    this.enemies.forEach((enemy: Player, key: number) => {

      if(didCollide(this.player.rect, enemy.rect)){
        enemy.dead = true;
        enemy.img = this.ENEMY_ALIVE_IMAGE
        setTimeout(() => { this.removeEnemy(enemy.id); }, 6000);
      }

     if (enemy.dead){
     }
     else{
       this.bullets.forEach((bullet: Bullet, key: number) => {
         if(didCollide(enemy.rect, bullet.rect)){
           enemy.dead = true;
           bullet.active = false;
           bullet.state.display = 'none';
           this.bullets.delete(bullet.id);
           enemy.img = this.ENEMY_DEAD_IMAGE
           setTimeout(() => { this.removeEnemy(enemy.id); }, 6000);
         }
       })
     }

   });



   this.worldItems.forEach((item: Item, key: number) => {

    if(didCollide(this.player.rect, item.rect)){
      item.usedState = true;
      item.img = this.ITEM_USED_IMAGE;
      setTimeout(() => { this.removeEnemy(item.id); }, 6000);
    }

   });   


  }

  getBulletImage(id: number){
    return this.bullets.get(id).img;
  }

  getBulletState(id: number){
    return this.bullets.get(id).state;
  }


  getEnemyImage(id: number){
    return this.enemies.get(id).img;
  }

  getEnemyState(id: number){
    return this.enemies.get(id).state;
  }

  getItemImage(id: number){
    return this.worldItems.get(id).img;
  }

  getItemState(id: number){
    return this.worldItems.get(id).state;
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

    this.enemies.forEach((enemy: Player, key: number) => {
      if(enemy.dead){

      }
      else{
        moveTowardPlayer(this.player, enemy,this.FPS);
      }
    });


  }


  




}

