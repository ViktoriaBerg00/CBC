<?php
declare(strict_types=1);

// one.com requires an ACTIVE sender mailbox on this website's domain.
// Create website@copenhagenboxcup.com in one.com's email settings before testing.
const CBC_SENDER = 'website@copenhagenboxcup.com';
const CBC_RECIPIENT = 'cbc@dabu.dk';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}
function field(string $key): string {
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (empty($_SESSION['cbc_csrf'])) {
        $_SESSION['cbc_csrf'] = bin2hex(random_bytes(32));
    }
    respond(200, ['csrf_token' => $_SESSION['cbc_csrf']]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['ok' => false, 'message' => 'Method not allowed.']);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 30000) {
    respond(413, ['ok' => false, 'message' => 'Your message is too long.']);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, ['https://copenhagenboxcup.com', 'https://www.copenhagenboxcup.com'], true)) {
    respond(403, ['ok' => false, 'message' => 'Please reload the page and try again.']);
}
if (!isset($_SESSION['cbc_csrf']) || !hash_equals($_SESSION['cbc_csrf'], field('csrf_token'))) {
    respond(403, ['ok' => false, 'message' => 'Please reload the page and try again.']);
}
if (field('website') !== '') {
    respond(400, ['ok' => false, 'message' => 'Your message could not be sent. Please email cbc@dabu.dk.']);
}
$name = field('name');
$surname = field('surname');
$email = field('email');
$message = field('message');
if ($name === '' || $surname === '' || $message === '' ||
    strlen($name) > 400 || strlen($surname) > 400 || strlen($message) > 20000 ||
    strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    preg_match('/[\r\n\x00-\x1f\x7f]/', $name . $surname . $email)) {
    respond(422, ['ok' => false, 'message' => 'Please enter your name, a valid email address and a message.']);
}

// Keep only a timestamp for rate limiting; no message or IP address is stored.
$ratePath = sys_get_temp_dir() . '/cbc-contact-' . hash('sha256', __DIR__ . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.lock';
$rateFile = @fopen($ratePath, 'c+');
if (!$rateFile || !flock($rateFile, LOCK_EX)) {
    respond(503, ['ok' => false, 'message' => 'The form is temporarily unavailable. Please email cbc@dabu.dk.']);
}
$lastSent = (int) stream_get_contents($rateFile);
if ($lastSent > time() - 60) {
    header('Retry-After: 60');
    respond(429, ['ok' => false, 'message' => 'Please wait one minute before sending another message.']);
}
$body = "New message from the Copenhagen Box Cup website\n\n"
    . "Name: {$name} {$surname}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [
    'From' => 'Copenhagen Box Cup <' . CBC_SENDER . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];
$accepted = @mail(CBC_RECIPIENT, 'Copenhagen Box Cup website enquiry', $body, $headers);
if ($accepted) {
    rewind($rateFile);
    ftruncate($rateFile, 0);
    fwrite($rateFile, (string) time());
}
flock($rateFile, LOCK_UN);
fclose($rateFile);
if (!$accepted) {
    respond(503, ['ok' => false, 'message' => 'Your message could not be sent. Please email cbc@dabu.dk.']);
}
respond(200, ['ok' => true]);
