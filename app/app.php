<?php

use Symfony\Component\HttpFoundation\Request;

require __DIR__ . '/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true;

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

try {
    $m = new MongoClient();
} catch (MongoConnectionException $e) {
    echo $e->getMessage();
    exit;
}

$db = $m->selectDB('mkrause-site');

// List
$app->get('/api/{coll}', function($coll) use ($app, $db) {
    $cursor = $db->$coll->find();
    $instances = array_values(iterator_to_array($cursor));
    
    foreach ($instances as &$instance) {
        $instance['id'] = (string)$instance['_id'];
        unset($instance['_id']);
    }
    
    return $app->json($instances);
});

// Create
$app->post('/api/{coll}', function(Request $request, $coll) use ($app, $db) {
    $instance = json_decode($request->getContent(), true);
    $db->$coll->insert($instance);
    return true;
});

// Read
$app->get('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $instance = $db->$coll->findOne(array('_id' => new MongoId($id)));
    
    $instance['id'] = (string)$instance['_id'];
    unset($instance['_id']);
    
    return $app->json($instance);
});

// Update
$app->put('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $instance = //...
    $instance['_id'] = $id;
    $db->$coll->save($instance);
});

// Delete
$app->delete('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $db->$coll->remove(array('_id' => new MongoId($id)));
    return true;
});

$app->run();
