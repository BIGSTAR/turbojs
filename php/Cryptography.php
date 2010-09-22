<?php
class Cryptography {
  function Encrypt ($p) {
    $t = strlen($p);
    $s = $this->Salt(8);
    $l = str_repeat("\x1a", $t);
    $h = str_repeat("\xe5", $t);
    $k = str_pad("", $t, $s);
    $f = (($p ^ $k) & $l) | ($p & $h);
    $f = substr($f, 0, strlen($f) / 2) . $s . substr($f, strlen($f) / 2, strlen($f));
    return $f;
  }

  function Decrypt($y) {
    $t = (strlen($y) - 8);
    $s = substr($y, $t / 2, 8);
    $p = substr($y, 0, $t / 2) . substr($y, ($t / 2) + 8, $t);
    $l = str_repeat("\x1a", $t);
    $h = str_repeat("\xe5", $t);
    $k = str_pad("", $t, $s);
    $f = (($p ^ $k) & $l) | ($p & $h);
    return $f;
  }

  function Salt($l=32) {
    $s = "1234567890@#%^_() abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; $r='';
    for ($a = 0; $a < $l; $a++) {
      $r.= substr($s, rand(0, (strlen($s) - 1)), 1);
    }
    return $r;
  }
}
?>
