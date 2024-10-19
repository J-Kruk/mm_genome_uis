<?php
if (isset($_POST['url']) & isset($_POST['path_name'])) {
    $imageUrl = $_POST['url'];

    // Directory to save the downloaded image
    $saveDirectory = '../../data/images/';  // Ensure this folder exists and has write permissions

    // Full path to save the image
    $savePath = $saveDirectory . $_POST['path_name'];

    echo $savePath;

    // Use file_get_contents() and file_put_contents() to download and save the image
    try {
        // Download image data
        $imageData = file_get_contents($imageUrl);

        if ($imageData === false) {
            echo "Error: Could not download image.";
        } else {
            // Save the image to the server
            file_put_contents($savePath, $imageData);
            echo "Image downloaded successfully and saved to: " . $savePath;
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "No image URL provided.";
}
?>