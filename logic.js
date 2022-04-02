var now_char = '',
    past_text = '',
    future_text = '';
var time_now = 0,
    count_errors = 0;
var timer_work = false;

document.addEventListener('keydown', function(event) {
    if (event.key != 'CapsLock') {
        document.getElementById(event.code.toString()).classList.add("key_down");
        if (event.key.length == 1)
            change_typing_text(event.key);
    } else if (event.getModifierState("CapsLock")) {
        document.getElementById('CapsLock').classList.add("key_down");
    } else {
        document.getElementById('CapsLock').classList.remove("key_down");
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key != 'CapsLock') {
        document.getElementById(event.code.toString()).classList.remove("key_down");
    }
});

async function start_typing() {
    document.getElementById("content").innerHTML = await (await fetch("text.html")).text();
    document.getElementById("parameters").style = "";
    now_char = '';
    past_text = '';
    future_text = '';
    time_now = 0;
    count_errors = 0;
    change_typing_text();
    start_parameters();
}

async function change_typing_text(char) {
    if (char == null) {
        let getText = await (await fetch("text.txt")).text();
        now_char = getText[0];
        future_text = getText.substring(1, getText.length);
        past_text = "";
        document.getElementById('past__text').innerHTML = past_text;
        document.getElementById('now__char').innerHTML = now_char;
        document.getElementById('future__text').innerHTML = future_text;
        stop_timer();
    } else {
        start_timer();
        if (char == now_char || now_char == '&nbsp;' && char == ' ') {
            past_text += char;
            if (future_text.length >= 0) {
                if (future_text[0] == ' ') {
                    now_char = '&nbsp;';
                } else {
                    now_char = future_text[0];
                }
                future_text = future_text.substring(1, future_text.length);
            }
            document.getElementById('past__text').innerHTML = past_text;
            if (now_char == null) {
                change_typing_text();
            } else {
                document.getElementById('now__char').innerHTML = now_char;
            }
            if (future_text[0] == ' ')
                document.getElementById('future__text').innerHTML = '&shy;' + future_text;
            else
                document.getElementById('future__text').innerHTML = future_text;
            document.getElementById('carriage__char').className = "style_ok";
        } else {
            document.getElementById('carriage__char').className = "style_wrong";
            add_wrong();
        }
    }
    let y_scroll = document.getElementById('carriage__char').getBoundingClientRect().left;
    document.getElementById('work__text').scrollBy(y_scroll - 1000, 0);
    if (now_char == '&nbsp;') {
        document.getElementById('big_char').innerHTML = "&apos;_&apos;";
    } else {
        document.getElementById('big_char').innerHTML = now_char;
    }
    change_speed();
}

function start_parameters() {
    document.getElementById("parameters__wrongs__value").innerHTML = (0).toString()
    restart_timer();
    start_timer();
    timer();
}

function add_wrong() {
    document.getElementById("parameters__wrongs__value").innerHTML = (++count_errors).toString();
}

function start_timer() {
    timer_work = true;
}

function stop_timer() {
    timer_work = false;
}

function restart_timer() {
    time_now = 0;
}

function timer() {
    if (time_now % 10 == 0) {
        let time = time_now / 10;
        document.getElementById("parameters__time__value").innerHTML =
            (Math.floor((Math.floor(Math.floor(time / 60) / 60) % 24) / 10)).toString() +
            (Math.floor(Math.floor(time / 60) / 60) % 24 % 10).toString() + ":" +
            (Math.floor(Math.floor(time / 60) % 60 / 10)).toString() +
            (Math.floor(time / 60) % 60 % 10).toString() + ":" +
            (Math.floor((time % 60) / 10)).toString() +
            ((time % 60) % 10).toString();
    }
    if (timer_work) {
        time_now++;
        change_speed();
    } else {
        time_now = 0;
    }
    setTimeout(timer, 100);
}

function change_speed() {
    if (past_text != "") {
        document.getElementById("parameters__speed__value").innerHTML = Math.floor(past_text.length / ((time_now / 10) / 60)).toString();
    } else {
        document.getElementById("parameters__speed__value").innerHTML = "Начните печать";
    }
}

// function get_text() {
//     let text = await (await fetch("text.html")).text();
//     let get_dots = get_fish_text(text);

// }

// function get_fish_text(text) {
//     let count = 0;
//     text.forEach(element => {
//         if (element == '.') {
//             count++;
//         }
//     });
//     return count;
// }

// function name() {

// }