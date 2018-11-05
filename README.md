# gulp-static-server

Automated workflow for frontend development with Gulp.js

### Building
Make sure you are running Node > 0.10.0 and run `npm install` to install the development dependencies.

* `gulp`: Compile CSS, JS, and run the project and Reloads the browser whenever HTML, CSS or JS files change.
* `gulp build`: Generate project file for distribution.
* `gulp clean`: Delete `dist` folder.
* `gulp clean:dist`: Delete all files (except `images` folder) under `dist` folder.

### Output

The output from the build phase will be available in the `dist` folder.