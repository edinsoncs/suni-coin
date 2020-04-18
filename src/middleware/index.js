module.exports = (app) => {

	//localhost:{$port}/api
	app.use('/api', require('./Api'));


	//localhost:{$port}/
	app.use('/', require('./Frontend'));

	//app.use('/', require('./Frontend'));
	//app.use('/backend', require('./Backend'));
}