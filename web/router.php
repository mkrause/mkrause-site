<?php
/**
 * Basic router for the PHP built-in web server.
 */

$root = __DIR__;
$path = $root . parse_url($_SERVER['REQUEST_URI'])['path'];

$out = fopen('php://stdout', 'w');
fputs($out, $path . "\n");

if (file_exists($path) && !is_dir($path)) {
    // Security check: only allow paths within the root directory
    $path_resolved = realpath($path);
    if (substr($path_resolved, 0, strlen($root)) !== $root) {
        return false;
    }
    
    $mime_types = array(
        'txt' => 'text/plain',
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'woff' => 'application/x-font-woff',
        'ttf' => 'application/octet-stream',
    );
    
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    $mime_type = isset($mime_types[$ext]) ? $mime_types[$ext] : $mime_types['txt'];
    
    header("Content-Type: {$mime_type}");
    
    require $path;
} else {
    require 'app.php';
}

fclose($out);
