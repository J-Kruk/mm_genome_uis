$(document).ready(function () {
    console.log('ready!!');
    const data_url = 'data/prompts/batches/pilot.csv'

    // DEBUG :: reset the idx:
    // localStorage.setItem('df_idx', 1)
    // localStorage.clear();

    var df_idx = localStorage.getItem('df_idx');
    if (df_idx == null) {
        df_idx = 1
        localStorage.setItem('df_idx', df_idx);
    };
    console.log("Input data id: ", df_idx)

    // Loading annotator id
    var anno_id = localStorage.getItem('anno_id');
    var culture_gl = localStorage.getItem('culture');
    var region_gl = localStorage.getItem('region');
    var ethnicity_gl = localStorage.getItem('ethnicity');
    console.log("Annotator ID: ", anno_id)
    console.log("Culture: ", culture_gl)
    console.log("Region: ", region_gl)
    console.log("Ethnicity: ", ethnicity_gl)
    updateHTML(data_url, culture_gl, df_idx);

    if ((anno_id == null) | (culture_gl == null) | (region_gl == null)) {
        $('#popupOverlay').show();
        $("#anno_id_popup").show();
        $(".concept_container").hide();
    }

    var example_id_gl = localStorage.getItem('example_id');
    var category_gl = localStorage.getItem('category');
    var seed_concept_gl = localStorage.getItem('seed_concept');

    // Function to fetch the latest row from the CSV
    async function fetchNewCSVRow(url, culture, df_idx) {
        // Fetch the CSV file
        const response = await fetch(url);
        const data = await response.text();

        // Parse CSV into rows
        const rows = data.split('\n');
        const len = rows.length;
        const place = parseFloat(df_idx) + parseFloat(1);

        if (place < len) {
            const select_row = rows[df_idx];
            const cols = select_row.split('|');

            // Extract column names
            const col_names = rows[0].split('|');
            const quest_col_name = `${culture}_q`
            const example_ans_col_name = `${culture}_outputs`

            const quest_col_id = col_names.indexOf(quest_col_name)
            const example_ans_col_id = col_names.indexOf(example_ans_col_name)
            const img_col_id = col_names.indexOf('Id')

            // Create variables from CSV that we will use
            const category = cols[0];
            const seed_concept = cols[2];
            const question = cols[quest_col_id];
            const example_ans = cols[example_ans_col_id];
            const img_id = cols[img_col_id];

            category_gl = category;
            seed_concept_gl = seed_concept;
            example_id_gl = img_id;

            localStorage.setItem('category', category);
            localStorage.setItem('seed_concept', seed_concept);
            localStorage.setItem('example_id', img_id);

            console.log("IMG_ID:  ", img_id)
            console.log("Categroy:  ", category)
            console.log("Seed Concept:  ", seed_concept)

            return { culture, category, seed_concept, question, example_ans, img_id }
        }
        else {
            // let the annotator know they are done!
            message = "You have answered all the questions in this batch! Thank you for your contribution to this research. You may now navigate away from this page."
            $("#error_message").text(message);
            $('#close-popup-1').css('display', 'None');
            $('#popupOverlay').show()
            $("#input_error_popup").show();

            localStorage.removeItem('anno_id');
            localStorage.removeItem('culture');
            localStorage.removeItem('df_idx');

            localStorage.removeItem('example_id');
            localStorage.removeItem('category');
            localStorage.removeItem('seed_concept');

            localStorage.removeItem('q3_input');
            localStorage.removeItem('all_image_results');
        };
    }

    // Function to populate the HTML
    async function updateHTML(data_url, culture, df_idx) {
        var csvData = await fetchNewCSVRow(data_url, culture, df_idx);
        var category_ = capitalizeWords(csvData.category);
        if (csvData) {
            $('#concept_head').html(`${category_}, ${csvData.seed_concept}`);
            $('#concept_question').html(`${csvData.question}`);
            $('#example_img_cap').html(`<b>Reasoning:</b> ${csvData.example_ans}`);
            $(".exp_concept_img").attr("src", `https://mm-genome.s3.amazonaws.com/annotation-data/example_images/${csvData.culture}_${csvData.img_id}_img_0.png`);
        }
    }

    // Updating the HTML as per data in the CSV
    updateHTML(data_url, culture_gl, df_idx);

    // submit error pop-up
    $("#close-popup-2").click(function () {
        if (($("#anno_id_input").val().length != 4) || ($("#anno_id_input").val().charAt(0) != 'A')) {
            if ($('#anno_id_popup').find('#anno_input_message').length === 0) {
                $('#anno_id_popup').append('<p id="anno_input_message"><b>The input appears to be incorrect.</b> Your participant ID should have the form "A999".</p>');
            } else {
                $('#anno_input_message').html('<b>The input appears to be incorrect.</b> Your participant ID should have the form "A999".')
            }

        } else if (($("#culture_input").val() == null) | ($("#culture_input").val() == "")) {
            if ($('#anno_id_popup').find('#anno_input_message').length === 0) {
                $('#anno_id_popup').append('<p id="anno_input_message"><b>Please select your cultural background.</b></p>');
            } else {
                $('#anno_input_message').html('<b>Please select your cultural background.</b>')
            }

        } else if (($("#region_input").val() == null) | ($("#region_input").val() == "")) {
            if ($('#anno_id_popup').find('#anno_input_message').length === 0) {
                $('#anno_id_popup').append('<p id="anno_input_message"><b>Please declare the region or state you are from.</b></p>');
            } else {
                $('#anno_input_message').html('<b>Please declare the region or state you are from.</b>')
            }

        } else if (($("#ethnicity_input").val() == null) | ($("#ethnicity_input").val() == "")) {
            if ($('#anno_id_popup').find('#anno_input_message').length === 0) {
                $('#anno_id_popup').append('<p id="anno_input_message"><b>Please declare your ethnicity.</b></p>');
            } else {
                $('#anno_input_message').html('<b>Please declare your ethnicity.</b>')
            }

        } else {
            anno_id = $("#anno_id_input").val()
            localStorage.setItem('anno_id', anno_id);
            console.log(anno_id)

            culture_gl = $("#culture_input").val()
            localStorage.setItem('culture', $("#culture_input").val());
            console.log(culture_gl)

            region_gl = $("#region_input").val()
            localStorage.setItem('region', $("#region_input").val());
            console.log(region_gl)

            ethnicity_gl = $("#ethnicity_input").val()
            localStorage.setItem('ethnicity', $("#ethnicity_input").val());
            console.log(ethnicity_gl)

            $('#popupOverlay').hide()
            $("#anno_id_popup").hide();
            updateHTML(data_url, culture_gl, df_idx);
            $(".concept_container").show();
        };
    });

    var q1_2_initial = "Explain in 1 - 3 sentences ...";
    var q2_2_initial = "Explain in 1 - 3 sentences ...";
    var q4_initial = $("#q4").val();

    // Getting state information from local storage
    var q1_input = localStorage.getItem('q1_input');
    var q1_exp = localStorage.getItem('q1_exp');
    var q2_input = localStorage.getItem('q2_input');
    var q2_exp = localStorage.getItem('q2_exp');
    var q3_input = localStorage.getItem('q3_input');
    var q3_query = localStorage.getItem('q3_query');
    var q3_rank = localStorage.getItem('q3_rank');
    var q4_input = localStorage.getItem('q4_input');
    var all_img_search = localStorage.getItem('all_image_results');
    var all_img_search_ranks = localStorage.getItem('all_image_results_ranks');

    console.log('q1_input: ', q1_input)
    console.log('q1_exp: ', q1_exp)
    console.log('q2_input: ', q2_input)
    console.log('q2_exp: ', q2_exp)
    console.log('q3_input: ', q3_input)
    console.log('q3_query: ', q3_query)
    console.log('q3_rank: ', q3_rank)
    console.log('q4_input: ', q4_input)
    console.log('all_images_on_search: ', all_img_search)
    console.log('all_images_ranks_on_search: ', all_img_search_ranks)


    // activating buttons that have been selected before
    restoreButtonClicks(q1_input, q2_input)

    // filling text areas that have contain input before
    if ((q2_input == 'no' || q2_input == 'not_sure')
        & (q2_exp != null)
    ) {
        $(q2_2).val(q2_exp)
    };

    if (q4_input != null) {
        $(q4).val(q4_input)
    };

    // showing image if one was previously selected
    // Visualize the selected image so annotator could review
    if (q3_input != null) {
        $('#selected_img_box').append('<img id="selected_img" src="' + q3_input + '" alt="Image selected by annotator.">');
        $('#selected_img_box').append('<p><b>This is the image you selected for Q3!</b> You may update your selection as many times as you like before moving on to Q4.</p>');
        $('#selected_img_box').css({
            // "background-color": "red",
            "width": "40%",
            "position": "relative",
            "margin": "auto",
            "text-align": "center",
            "border-radius": "10px",
            "background-color": "#f1faff",
            "padding-left": "30px",
            "padding-right": "30px",
            "padding-bottom": "20px",
            "padding-top": "20px",
        });
        $('#selected_img').css({
            "width": "60%",
            "position": "relative",
            "margin": "auto",
            "text-align": "center",
            "border": "2px solid black",
        });
    }

    // $('.anno_caption > p').replaceWith("<p><strong>Caption: </strong> ${caption}</p>");

    $("#expand_intro_button").click(function () {
        $("#exp_intro").slideToggle(1000);

        var view_text = "View Task Descriptions";
        var hide_text = "Hide Task Descriptions";
        var button_text = $("#expand_intro_button").text();

        if (~button_text.indexOf("View")) {
            $("#expand_intro_button").html(hide_text);
        }
        else {
            $("#expand_intro_button").html(view_text);
        };
    });

    $("#issue_button").click(function () {
        $("#issue_message").slideToggle(500);
    });


    // Clear the text inside the textarea when it is clicked
    $("textarea").click(function () {
        if (($(this).val() == q1_2_initial) || ($(this).val() == q2_2_initial) || ($(this).val() == q4_initial)) {
            $(this).val('');
        };
    });

    $("button").click(function () {
        var backg = rgb2hex($(this).css("background-color"));

        // changing color of buttons when clicked
        if (
            ($(this).attr("id") != "submit_button")
            & ($(this).attr("id") != "close-popup-1")
            & ($(this).attr("id") != "close-popup-2")
        ) {
            if (backg == '#4d90fe') {
                $(this).css('background-color', '#e0e1e2');
            }
            else {
                $(this).css('background-color', '#4d90fe');
                $(this).siblings().each(function () {
                    $(this).css('background-color', '#e0e1e2');
                });
            }
        }

        // setting variables through button clicks:
        if ($(this).parent().attr('id') == 'concept_excists') {
            q1_input = $(this).val();
            localStorage.setItem('q1_input', q1_input)
        }

        if ($(this).parent().attr('id') == 'good_rep') {
            q2_input = $(this).val();
            localStorage.setItem('q2_input', q2_input)
        }

        // visualizing supplement question for q1:
        if (($(this).attr("class") == "q1") & (($(this).val() == "no") || ($(this).val() == "not_sure"))) {
            $('#exists_expl').css('display', 'block');

            // make every other input disappear:
            $('#q2_div').css('display', 'None');
            $('#good_rep_expl').css('display', 'None');
            $('#q3_div').css('display', 'None');
            $('#q4_div').css('display', 'None');
            $('#selected_img_box').css('display', 'None');
        }
        if (($(this).attr("class") == "q1") & ($(this).val() == "yes")) {
            $('#exists_expl').css('display', 'None');

            // make every other input re-appear:
            $('#q2_div').css('display', 'block');
            $('#q3_div').css('display', 'block');
            $('#q4_div').css('display', 'block');

            if ((q2_input == "no") || (q2_input == "not_sure")) {
                $('#good_rep_expl').css('display', 'block');
            };
        }

        // visualizing supplement question for q2:
        if (($(this).attr("class") == "q2") & (($(this).val() == "no") || ($(this).val() == "not_sure"))) {
            $('#good_rep_expl').css('display', 'block');
        }
        if (($(this).attr("class") == "q2") & ($(this).val() == "yes")) {
            $('#good_rep_expl').css('display', 'None');
        }

    });

    // Insert it before the Search Element code snippet so the global properties like parsetags and callback
    // are available when cse.js runs.
    window.__gcse || (window.__gcse = {});
    window.__gcse.searchCallbacks = {
        image: {
            rendered: WebResultsRenderedCallback,
        },
    };

    // Save the textarea content to localStorage on change
    $('#q1_2').on('input', function () {
        q1_exp = $(this).val();
        localStorage.setItem('q1_exp', q1_exp);
    });
    $('#q2_2').on('input', function () {
        q2_exp = $(this).val();
        localStorage.setItem('q2_exp', q2_exp);
    });

    $('#q4').on('input', function () {
        q4_input = $(this).val();
        localStorage.setItem('q4_input', q4_input);
    });

    // submit error pop-up
    $("#close-popup-1").click(function () {
        $('#popupOverlay').hide()
        $("#input_error_popup").hide();
    });

    $("#submit_button").click(function () {
        // verifying all inputs are valid before submitting form.
        q1_exp = $("#q1_2").val()
        q2_exp = $("#q2_2").val()
        q3_input = localStorage.getItem('q3_input')
        q3_query = localStorage.getItem('q3_query')
        q3_rank = localStorage.getItem('q3_rank')
        q4_input = $("#q4").val()

        if (q1_input == null) {
            message = "Please select an option for Q1 before submitting. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q1 check failed...");
        }
        else if ((q1_input != "yes") & ((q1_exp == null) || (q1_exp == '') || (q1_exp == q1_2_initial) || (q1_exp.length <= 50))) {
            message = "Please provide a 1 - 3 sentence explanation for your input to Q1 before continuing. If you have entered your answer and are still receiving this message, it may be because it's not long enough. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q1 explanation check failed...");
        }
        else if ((q1_input == "yes") & (q2_input == null)) {
            message = "Please select an option for Q2 before submitting. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q2 check failed...");
        }
        else if ((q1_input == "yes") & (q2_input != "yes") & ((q2_exp == null) || (q2_exp == '') || (q2_exp == q2_2_initial) || (q2_exp.length <= 50))) {
            message = "Please provide a 1 - 3 sentence explanation for your input to Q2 before continuing. If you have entered your answer and are still receiving this message, it may be because it's not long enough. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q2 explanation check failed...");
        }
        else if ((q1_input == "yes") & (q3_input == null)) {
            message = "Please select an image for Q3 before submitting. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q3 check failed...");
        }
        else if ((q1_input == "yes") & ((q4_input == null) || (q4_input == '') || (q4_input == q4_initial) || (q4_input.length <= 100))) {
            message = "Please provide a 2 - 3 sentence answer to Q4 before continuing. If you have entered your answer and are still receiving this message, it may be because it's not long enough. Thank you!"
            $("#error_message").text(message);
            $('#popupOverlay').show()
            $("#input_error_popup").show();
            console.log("q4 check failed...");

        }
        else {
            console.log("SUBMITTED!!!");

            if (q1_input == 'yes') {
                q1_exp = null;
            } else if ((q1_input == "no") || (q1_input == "not_sure")) {
                q2_input = null;
                q2_exp = null;
                q4_input = null;
            };

            if (q2_input == 'yes') {
                q2_exp = null;
            };


            // Send the data to a PHP file for processing
            // $.ajax({
            //     type: "POST",
            //     url: "nodejs-ssl-server/mm_genome_uis/step1/resources/php/data_handler.php",
            //     data: {
            //         anno_id: anno_id,
            //         culture: culture_gl,
            //         example_id: example_id_gl,
            //         category: category_gl,
            //         seed_concept: seed_concept_gl,
            //         q1_input: q1_input,
            //         q1_exp: q1_exp,
            //         q2_input: q2_input,
            //         q2_exp: q2_exp,
            //         q3_input: q3_input,
            //         q3_query: q3_query,
            //         q3_rank: q3_rank,
            //         q4_input: q4_input
            //     },
            //     error: function (xhr, status, error) {
            //         alert("An error occurred: " + error);
            //     }
            // });

            // Send the POST request with Fetch API
            const data = {
                anno_id: anno_id,
                culture: culture_gl,
                region: region_gl,
                ethnicity: ethnicity_gl,
                example_id: example_id_gl,
                category: category_gl,
                seed_concept: seed_concept_gl,
                q1_input: q1_input,
                q1_exp: q1_exp,
                q2_input: q2_input,
                q2_exp: q2_exp,
                q3_input: q3_input,
                q3_query: q3_query,
                q3_rank: q3_rank,
                q4_input: q4_input
            }

            fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  // Send the data as JSON
                },
                body: JSON.stringify(data)
            })
                .then(response => response.text())  // Handle the response from the server
                .then(result => {
                    console.log('Success:', result);
                })
                .catch(error => {
                    console.error('Error:', error);
                });


            // Download image to server of S3:
            if (q1_input == "yes") {
                var image_path = `${category_gl}_${seed_concept_gl}_${anno_id}.png`
                image_path = image_path.replace(/\s+/g, '_');

                // $.ajax({
                //     url: 'nodejs-ssl-server/mm_genome_uis/step1/resources/php/download_image.php',  // PHP file that will handle the image download
                //     type: 'POST',
                //     data: { url: q3_input, path_name: image_path },    // Send the image URL
                //     success: function (response) {
                //         $('#status').text(response);  // Show the status of the download
                //     },
                //     error: function () {
                //         $('#status').text('Error downloading the image.');
                //     }
                // });

                // Prepare the data to send
                const img_data = {
                    url: q3_input,
                    path_name: image_path
                };

                // Send the POST request using Fetch API
                fetch('/download-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'  // Send data as JSON
                    },
                    body: JSON.stringify(img_data)  // Convert data object to JSON string
                })
                    .then(response => response.text())  // Handle the response (as text)
                    .then(result => {
                        console.log('Success:', result);
                        alert(result);  // Display success message
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error: ' + error.message);  // Display error message
                    });

                // Saving all image urls from the search page
                const img_search_data = {
                    anno_id: anno_id,
                    culture: culture_gl,
                    example_id: example_id_gl,
                    q3_query: q3_query,
                    selected_img_path: image_path,
                    selected_img_rank: q3_rank,
                    image_search_page: all_img_search,
                    image_search_page_ranks: all_img_search_ranks,
                }
                // Send POST request using Fetch API
                fetch('/save-image-results-page', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'  // Send the data as JSON
                    },
                    body: JSON.stringify(img_search_data)
                })
                    .then(response => response.text())  // Handle the response from the server
                    .then(result => {
                        console.log('Success:', result);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            };


            // Loading new prompts for annotators
            df_idx = parseFloat(df_idx) + parseFloat(1);
            localStorage.setItem('df_idx', df_idx);

            updateHTML(data_url, culture_gl, df_idx);
            restore_variables(q1_2_initial, q2_2_initial, q4_initial)

            // Set all input values to null
            q1_input = null;
            q1_exp = null;
            q2_input = null;
            q2_exp = null;
            q3_input = null;
            q3_query = null;
            q3_rank = null;
            q4_input = null;
            all_img_search = null;
            all_img_search_ranks = null;

            // Clear all image search results
            ClearImageWebResults()

            // Scroll back to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scrolling effect
            });

            // message = "All inputs saved and image downloaded!"
            // $("#error_message").text(message);
            // $('#popupOverlay').show()
            // $("#input_error_popup").show();
        }
    });

});