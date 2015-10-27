<?php
if (isset($_GET["https://ftrybizdev.blob.core.windows.net:443/cgidemo"])) {
    echo "Vous avez interrompu votre lecture. A bientôt...";
    exit();
}
else {
    $page = $_GET["page"];
    $nombrepages = $_GET["n"];
    echo "Dossier sur les abeilles - page $page sur $nombrepages";
}
?>