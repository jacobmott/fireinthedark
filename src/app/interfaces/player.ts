export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}


export interface Direction {
  x: number;
  y: number;
}

export interface State {
  position: string,  
  color: string,     
  width:  string,
  height:  string,
  left : string,
  top: string,
  display : string
}

export interface Player {
  rect: Rect;
  speed: number;
  name: string;
  id: number;
  dead: boolean;
  state: State;
  img: string
}


export interface Item {
  rect: Rect;
  speed: number;
  name: string;
  id: number;
  usedState: boolean;
  state: State;
  img: string
  isContainer: boolean;
  nestedItems: Item [];
  type: string;
}


export interface Bullet {
  direction: Direction;
  rect: Rect;
  id: number;
  speed: number;
  name: string;
  active: boolean;
  state: State;
  img: string
}
