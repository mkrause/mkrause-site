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

$params = array(
    'env' => 'development'
);

$app->get('/{path}', function() use ($app, $params) {
    return $app['twig']->render('home.twig', $params);
})->assert('path', '.*');

/*
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
$app->put('/api/{coll}/{id}', function(Request $request, $coll, $id) use ($app, $db) {
    $instance = json_decode($request->getContent(), true);
    $instance['_id'] = $id;
    var_dump($instance);exit;
    $db->$coll->save($instance);
    return true;
});

// Delete
$app->delete('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $db->$coll->remove(array('_id' => new MongoId($id)));
    return true;
});
*/

$app->run();
