# Fireinthedark

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).




## TODO

* Update player shoting functionality to use mose click event position to figure out direction to shot the bullet
    * Currently when the player shots, the bullet is shot out based on the direction the player is moving in

* Add inventory interaction
    * Currently the player has an inventory with health items, but they cant interact with them

* Add game state (End/Start)
    * Add player death
      * Currently the player doesn't die when thier health reaches 0
  
* Create some sort of vector that I can have an addition/subtraction operation on.. so i can just add/subtract to vectors
    * Can also do ditance formulas and everything else vectors support
    * Currently im just tracking an x and y positions and checking thier pos/neg values to determine + or - operations

* Work on using/intergrating angular animations
    * Currently im just update the items on screens datastructure in the component which affects the css style
    * A call is made to get the current style dynamically, which generates the style from the items state/datastructure



