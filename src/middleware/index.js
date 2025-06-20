import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import api from './Api/index.js';
import frontend from './Frontend/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (app) => {
        //localhost:{$port}/api
        app.use('/api', api);

        // Static frontend files
        app.use(express.static(path.join(__dirname, '../public')));

        //localhost:{$port}/
        app.use('/', frontend);

        //app.use('/', require('./Frontend'));
        //app.use('/backend', require('./Backend'));
};

