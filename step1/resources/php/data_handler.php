<?php
// Define the CSV file path
$out_file = "../../data/inputs.csv";

function debug_to_console($data) {
    $output = $data;
    if (is_array($output))
        $output = implode(',', $output);

    echo "<script>console.log('Debug Objects: " . $output . "' );</script>";
}

debug_to_console("Test");
debug_to_console($_SERVER["REQUEST_METHOD"]);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the data from the AJAX request
    $anno_id = $_POST['anno_id'];
    $culture = $_POST['culture'];
    $example_id = $_POST['example_id'];
    $category = $_POST['category'];
    $concept = $_POST['seed_concept'];
    $q1_input = $_POST['q1_input'];
    $q1_exp = $_POST['q1_exp'];
    $q2_input = $_POST['q2_input'];
    $q2_exp = $_POST['q2_exp'];
    $q3_input = $_POST['q3_input'];
    $q3_query = $_POST['q3_query'];
    $q3_rank = $_POST['q3_rank'];
    $q4_input = $_POST['q4_input'];

    // Open the file in append mode
    $handle = fopen($out_file, 'a');

    // Write the data as a new row in the CSV file
    fputcsv($handle, array($anno_id, $culture, $example_id, $category, $concept, $q1_input, $q1_exp, $q2_input , $q2_exp , $q3_input, $q3_query, $q3_rank, $q4_input));

    // Close the file
    fclose($handle);
}
?>
