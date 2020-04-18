module.exports = (app) => {

	//localhost:3000/api
	app.use('/api', require('./Api'));

	//app.use('/', require('./Frontend'));
	//app.use('/backend', require('./Backend'));
}