<?php

require __DIR__ . '/../vendor/autoload.php';

$app = new Silex\Application();

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/templates',
    'twig.options' => array(
        'debug' => true,
    ),
));

$app->get('/', function() use ($app) {
    return $app['twig']->render('home.twig', array(
        'env' => 'development'
    ));
});

// Generic REST API
/*
$m = new MongoClient();
$db = $m->selectDB('mkrause-site');

// List
$app->get('/api/{coll}', function($coll) use ($app, $db) {
    $db->$coll->find();
});

// Create
$app->put('/api/{coll}', function($coll) use ($app, $db) {
    $instance = //...
    $db->$coll->insert($instance);
});

// Read
$app->get('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $db->$coll->findOne(array('_id' => $id));
});

// Update
$app->post('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $instance = //...
    $instance['_id'] = $id;
    $db->$coll->save($instance);
});

// Delete
$app->delete('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $db->$coll->remove(array('_id' => $id));
});
*/

$app->run();
