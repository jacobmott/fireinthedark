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


## Helpful links
*  Creating-isometric-worlds-a-primer-for-game-developers
     * https://gamedevelopment.tutsplus.com/tutorials/creating-isometric-worlds-a-primer-for-game-developers--gamedev-6511

* Angular Animations - transition-and-triggers
     * https://angular.io/guide/transition-and-triggers

* Envato Market - Game assets - isometric assets
     * https://graphicriver.net/graphics-with-isometric-in-game-assets?_ga=2.15940918.1677383907.1585510672-762106576.1585510672&as=1&referrer=homepage&type=c&utf8=%E2%9C%93
    
* CSS Position explained site
     * https://www.freecodecamp.org/news/how-to-use-the-position-property-in-css-to-align-elements-d8f49c403a26/

* Tileset sites
    * https://www.mapeditor.org/
    * https://github.com/andrewrk/node-tmx-parser
    * https://opengameart.org/content/isometric-64x64-outside-tileset
    * https://opengameart.org/content/isometric-tiles
    * https://graphicriver.net/item/the-green-isometric-tileset/20796124
    * https://www.gamedevmarket.net/user/login/


## TODO

* [X] Update player shoting functionality to use mose click event position to figure out direction to shot the bullet
    * Currently when the player shots, the bullet is shot out based on the direction the player is moving in
* [X] Update player shoting functionality to use mose click event position every click
    * Currently if you hold down left click.. it wont update the vector/direction.. and all bullets will travel to the original click position

* [x] Add inventory interaction
    * Currently the player has an inventory with health items, but they cant interact with them
* [ ] Fix player health when using health pot
    * Currently we track health and dmg for the pie chart, but it only does 100 values well when it divides them
    * Need to just track health and then deduce dmg taken so we dont have to update to values

* [ ] Add game state (End/Start)
    * Add player death
      * Currently the player doesn't die when thier health reaches 0
  
* [ ] Create some sort of vector that I can have an addition/subtraction operation on.. so i can just add/subtract to vectors
    * Can also do ditance formulas and everything else vectors support
    * Currently im just tracking an x and y positions and checking thier pos/neg values to determine + or - operations

* [ ] Work on using/intergrating angular animations
    * Currently im just update the items on screens datastructure in the component which affects the css style
    * A call is made to get the current style dynamically, which generates the style from the items state/datastructure

* [ ] Get my royalty free image files from Humble Bundle
    * I purchased a bunch on there
    * Currently im just using placeholder images from google images, and doctoring them up (Transparency) in sketchbook

* [ ] Implement character animation (use anuglar animation)
    * Currently the enemies/player just move around, but thier image stays the same/static (no animation)



