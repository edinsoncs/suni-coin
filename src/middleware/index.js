import express from 'express';
import path from 'path';

module.exports = (app) => {

        //localhost:{$port}/api
        app.use('/api', require('./Api'));

        // Static frontend files
        app.use(express.static(path.join(__dirname, '../public')));

        //localhost:{$port}/
        app.use('/', require('./Frontend'));

        //app.use('/', require('./Frontend'));
        //app.use('/backend', require('./Backend'));
}