'use strict'

// Express
const express = require('express');
const bodyParser = require('body-parser');

//Configure Environment
const configModule = require('../shared-modules/config-helper/config.js');
var configuration = configModule.configure(process.env.NODE_ENV);

//Configure Logging
const winston = require('winston');
winston.level = configuration.loglevel;

// Custom Modules
const tokenManager = require('../shared-modules/token-manager/token-manager.js');

// Instantiate the application
var app = express();
var bearerToken = '';
var tenantId = '';

// Grab the tenantId from the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    bearerToken = req.get('Authorization');
    if(bearerToken)
    {
        tenantId = tokenManager.getTenantId(req);
    }
});


app.get('/cognitoTokenExample/health', function(req, res) {
    res.status(200).send({service: 'Cognito Token Example', isAlive: true});
});

// REST Endpoints
app.get('/cognitoTokenExample', function(req, res) {
    winston.debug('GET method invoked for Cognito Token Example for Tenant Id: ' + tenantId);
    tokenManager.getCredentialsFromToken(req, function(credentials) {
        var searchParams = {
            TableName: orderSchema.TableName,
            KeyConditionExpression: "tenantId = :tenantId",
            ExpressionAttributeValues: {
                ":tenantId": tenantId
            }
        };
    });

    if ( credentials != null )
    {
        res.status(200).send("<html><body>" + credentials + "</body></html>");
    }
});

// Start the server
app.listen(configuration.port.cognitoTokenExample);
console.log(configuration.name.cognitoTokenExample + ' service started on port ' + configuration.port.cognitoTokenExample);