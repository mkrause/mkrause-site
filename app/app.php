<?php
/**
 * Back-end for mkrause-site.
 */

use Symfony\Component\HttpFoundation\Request;

require __DIR__ . '/../vendor/autoload.php';

$params = require __DIR__ . '/config/parameters.php';

$app = new Silex\Application();
$app['debug'] = !$parameters['production'];

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__ . '/templates',
    'twig.options' => array(
        'debug' => ($parameters['env'] !== 'production'),
    )
));

$app->get('/api/blog', function() use ($app, $params) {
    $posts = array_fill(0, 5, array(
        'title' => 'Lorem Ipsum',
        'body' => <<<EOT
<p>
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu tempus ligula. Mauris purus neque, ultrices convallis tellus vel, cursus adipiscing nibh. Phasellus vitae velit dolor. Duis tristique, nulla vitae vestibulum aliquet, risus odio posuere libero, ac pellentesque nulla urna quis eros. Duis volutpat ante in enim eleifend, sit amet venenatis arcu scelerisque. Phasellus dictum interdum nulla, ut sodales nunc viverra et. Donec vestibulum dignissim eros, a fermentum sem pellentesque ac. Nullam euismod quam dapibus tincidunt viverra.

Donec tristique suscipit nisi, ultrices imperdiet neque rutrum vitae. Vivamus mattis, tortor in interdum auctor, nisl enim tincidunt tortor, quis ullamcorper lorem nibh semper dui. Phasellus sit amet nisi volutpat, accumsan nisl pellentesque, aliquet arcu. Aliquam scelerisque porta massa, ut sagittis nibh molestie a. Nam luctus nulla eu nunc dignissim tempus. Maecenas sed justo vitae diam cursus tincidunt. Mauris imperdiet justo ut erat feugiat, sit amet semper ligula tincidunt. Sed id mi pretium, laoreet tortor semper, lobortis diam. Mauris lobortis erat at ante adipiscing, vitae ullamcorper elit vestibulum. Nullam rhoncus felis at vulputate dignissim. Nunc pharetra diam in dui ullamcorper, eu vestibulum lacus vehicula. Praesent vitae ornare quam. Integer cursus pharetra venenatis. Fusce rutrum magna a iaculis adipiscing. Maecenas sit amet diam ultrices, auctor nibh eu, eleifend elit. Sed sit amet condimentum leo. 
</p>
EOT
    ));
    
    return $app->json($posts);
});

$app->get('/api/blog/{id}', function($id) use ($app, $params) {
    return <<<EOT
<h2>Blog post - $id</h2>
<p>
 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu tempus ligula. Mauris purus neque, ultrices convallis tellus vel, cursus adipiscing nibh. Phasellus vitae velit dolor. Duis tristique, nulla vitae vestibulum aliquet, risus odio posuere libero, ac pellentesque nulla urna quis eros. Duis volutpat ante in enim eleifend, sit amet venenatis arcu scelerisque. Phasellus dictum interdum nulla, ut sodales nunc viverra et. Donec vestibulum dignissim eros, a fermentum sem pellentesque ac. Nullam euismod quam dapibus tincidunt viverra.

Donec tristique suscipit nisi, ultrices imperdiet neque rutrum vitae. Vivamus mattis, tortor in interdum auctor, nisl enim tincidunt tortor, quis ullamcorper lorem nibh semper dui. Phasellus sit amet nisi volutpat, accumsan nisl pellentesque, aliquet arcu. Aliquam scelerisque porta massa, ut sagittis nibh molestie a. Nam luctus nulla eu nunc dignissim tempus. Maecenas sed justo vitae diam cursus tincidunt. Mauris imperdiet justo ut erat feugiat, sit amet semper ligula tincidunt. Sed id mi pretium, laoreet tortor semper, lobortis diam. Mauris lobortis erat at ante adipiscing, vitae ullamcorper elit vestibulum. Nullam rhoncus felis at vulputate dignissim. Nunc pharetra diam in dui ullamcorper, eu vestibulum lacus vehicula. Praesent vitae ornare quam. Integer cursus pharetra venenatis. Fusce rutrum magna a iaculis adipiscing. Maecenas sit amet diam ultrices, auctor nibh eu, eleifend elit. Sed sit amet condimentum leo. 
</p>
EOT;
});

// Generic REST API

/*
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
    $db->$coll->save($instance);
    return true;
});

// Delete
$app->delete('/api/{coll}/{id}', function($coll, $id) use ($app, $db) {
    $db->$coll->remove(array('_id' => new MongoId($id)));
    return true;
});
*/

// Fallback route
$app->get('/{path}', function() use ($app, $params) {
    return $app['twig']->render('home.twig', $params);
})->assert('path', '.*');

return $app;
