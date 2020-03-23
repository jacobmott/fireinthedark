export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
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
  dead: boolean;
  state: State;
  img: string
}

