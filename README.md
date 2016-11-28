# Video Generation Frontend Boilerplate

This module is created as an input for [animation renderer](https://git.int.krds.com/tools/animation-renderer) (which renders animations to video) as well as to play the animation in web browser

> **Note :** If you have yarn, use yarn equivalent commands instead of npm commands

### Initial setup

* Clone the repository

* Then, set dimension in `src/js/sample-config.js` & `src/style/animation.less`

* From the module's root directory, run `npm install`

* Run `npm start` to start development server. Now, The server should be accessible at http://localhost:8080 or in your ip address at port 8080

* Run `npm run build` to build the module

* Run `npm run createvideo` to create video out of the animation


### Create scene

* The animation is the combination of multiple scenes

* A scene requires 3 files ( a "js" file, a "less" file, a "hbs" file)

* Duplicate `src/js/scene-krdslogo.js` file which is a sample scene file. Then, rename it. This is the **main** file of a scene

* Change the path of your less file in line `require('../style/scene-krdslogo')`

* Change the path of your hbs file in line `require('../view/scene-krdslogo')`

* Create your scene's less file inside `src/style` & scene's hbs file inside `src/view` directory

* Finally, add the scene to `createStoryBoard` method in `src/js/animation.js`

### Edit scene

* In your scene's js file, Inside `createTimeline` method, write a [gasp](https://greensock.com/gsap) timleline for the required animation

* Then, add the images to preload inside `createPreloadQueue` method.


### About HBS file

`.hbs` is the extenstion for [handlebars](http://handlebarsjs.com/) file. It is a popular html template framework. The **context** of all hbs files been set to module's **config** object. So that, you can access content from the config using the handlebars syntax in hbs files. This is helpful to load dynamic contents from config.
