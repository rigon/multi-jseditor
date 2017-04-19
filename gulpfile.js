var gulp = require('gulp');
var httpServer = require('http-server');

gulp.task('simpleserver', [], function(cb) {
	httpServer.createServer({ root: '.', cache: 5 }).listen(8088);
	console.log('LISTENING on 8088');
});
