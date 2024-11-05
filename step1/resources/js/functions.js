// Helper function that capitalizes words:
function capitalizeWords(sentence) {
    return sentence.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}


// Color HEX interpretor functions
var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
var hex = function (x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
};

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};


// DEVELOPEMENT OF IMAGE SELECT ::
WebResultsRenderedCallback = function (name, q, promos, results) {
    // document.getElementById('image-url').innerHTML = 'Callback fired post-render'

    $('.gsc-result').on('click', function (e) {
        // Code to handle the image click event goes here
        e.preventDefault(); // Prevent default link behavior
        var imageElement = $(this).find("> div.gs-imagePreviewArea > a.gs-previewLink > img.gs-imagePreview")[0];
        var imageUrl = imageElement['src'];
        var rank = $(this).index()

        localStorage.setItem('q3_input', imageUrl)
        localStorage.setItem('q3_query', q)
        localStorage.setItem('q3_rank', rank)

        // Visualize the selected image so annotator could review
        if ($('#selected_img_box').find('img').length > 0) {
            $('#selected_img').attr("src", imageUrl)
            $("#selected_img_box").show();
        } else {
            $('#selected_img_box').append('<img id="selected_img" src="' + imageUrl + '" alt="Image selected by annotator.">');
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
        };
    });
};


// submit logic & button
async function downloadImage_local(url, out_name) {
    // VERSION 3: SAVES IMAGE LOCALLY NOT ON SERVER!
    // Will likely need to use Ajax & PHP
    const image = await fetch(url)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'TEST.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

};


async function restore_variables(q1_2_initial, q2_2_initial, q4_initial) {
    // Clearing all local storage
    localStorage.removeItem('q1_input');
    localStorage.removeItem('q2_input');
    localStorage.removeItem('q2_exp');
    localStorage.removeItem('q3_input');
    localStorage.removeItem('q3_query');
    localStorage.removeItem('q3_rank');
    localStorage.removeItem('q4_input');
    console.log("local storage cleared!");

    // Reset all default values and hide image select
    $("#q1_2").val(q1_2_initial);
    $("#q2_2").val(q2_2_initial);
    $("#q4").val(q4_initial);

    // Returning div visability to standard
    $('#exists_expl').css('display', 'None');
    $('#q2_div').css('display', 'block');
    $('#good_rep_expl').css('display', 'None');
    $('#q3_div').css('display', 'block');
    $('#q4_div').css('display', 'block');
    $("#selected_img_box").hide();

    // resetting all button colors
    $('button').each(function () {
        if (
            ($(this).attr("class") == "q1")
            | ($(this).attr("class") == "q2")
        ) {
            var backg = rgb2hex($(this).css("background-color"));
            if (backg == '#4d90fe') {
                $(this).css('background-color', '#e0e1e2');
            };
        }
    });
};


// Visually clicks buttons if they've been clicked pre-refresh
async function restoreButtonClicks(q1_input, q2_input) {
    if (q1_input != null) {
        $('.q1').each(function () {
            if ($(this).val() == q1_input) {
                $(this).css('background-color', '#4d90fe');
            };
        });
        if ((q1_input == "no") || (q1_input == "not_sure")) {
            $('#exists_expl').css('display', 'block');

            // make every other input disappear:
            $('#q2_div').css('display', 'None');
            $('#good_rep_expl').css('display', 'None');
            $('#q3_div').css('display', 'None');
            $('#q4_div').css('display', 'None');
        };
    };
    if (q2_input != null) {
        $('.q2').each(function () {
            if ($(this).val() == q2_input) {
                $(this).css('background-color', '#4d90fe');
            };
        });
        if (((q2_input == "no") || (q2_input == "not_sure")) & (q1_input == "yes")) {
            $('#good_rep_expl').css('display', 'block');
        };
    };
};
