<?php


include_once("connect.php");


$encodeurl = rawurlencode($_GET["url"]);
$encodeurl = $encodeurl ? $encodeurl : 'public';
$msgid = rawurlencode($_GET["msgid"]);
$msgid = $msgid ? $msgid : 0;
$connect = new Connect();


echo $connect->getRecentMessage($encodeurl, $msgid);


?>