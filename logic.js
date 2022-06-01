var objecct;

var now_char = '',
    past_text = '',
    future_text = '';
var time_now = 0,
    count_errors = 0;
var timer_work = false;

var text_timer = "",
    text_speed = "",
    text_mistakes = "";

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
        let textForTyping = await get_text();
        future_text = textForTyping.substring(1, textForTyping.length);
        now_char = textForTyping[0];
        past_text = "";
        document.getElementById('past__text').innerHTML = past_text;
        document.getElementById('now__char').innerHTML = now_char;
        document.getElementById('future__text').innerHTML = future_text;
        stop_timer();
    } else {
        if (char == now_char || now_char == '&nbsp;' && char == ' ') {
            start_timer();
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
                next_text();
                set_results(text_timer, text_speed, text_mistakes);
                change_typing_text();
            } else {
                document.getElementById('now__char').innerHTML = now_char;
            }
            if (future_text[0] == ' ')
                document.getElementById('future__text').innerHTML = '&shy;' + future_text;
            else
                document.getElementById('future__text').innerHTML = future_text;
            document.getElementById('carriage__char').className = "style_ok";
        } else if (timer_work) {
            document.getElementById('carriage__char').className = "style_wrong";
            add_wrong();
        }
    }
    let y_scroll = document.getElementById('carriage__char').getBoundingClientRect().left;
    console.log(y_scroll);

    document.getElementById('work__text').scrollBy(y_scroll - window.innerWidth / 2, 0);
    console.log(document.getElementById('carriage__char').getBoundingClientRect().left);
    if (now_char == '&nbsp;') {
        document.getElementById('big_char').innerHTML = "&apos;_&apos;";
    } else {
        document.getElementById('big_char').innerHTML = now_char;
    }
    change_speed();
}

function start_parameters() {
    text_mistakes = (0).toString();
    document.getElementById("parameters__wrongs__value").innerHTML = text_mistakes;
    restart_timer();
    start_timer();
    timer();
}

function add_wrong() {
    text_mistakes = (++count_errors).toString();
    document.getElementById("parameters__wrongs__value").innerHTML = text_mistakes;
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
        text_timer =
            (Math.floor((Math.floor(Math.floor(time / 60) / 60) % 24) / 10)).toString() +
            (Math.floor(Math.floor(time / 60) / 60) % 24 % 10).toString() + ":" +
            (Math.floor(Math.floor(time / 60) % 60 / 10)).toString() +
            (Math.floor(time / 60) % 60 % 10).toString() + ":" +
            (Math.floor((time % 60) / 10)).toString() +
            ((time % 60) % 10).toString();
        document.getElementById("parameters__time__value").innerHTML = text_timer;
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
        text_speed = Math.floor(past_text.length / ((time_now / 10) / 60)).toString();
        document.getElementById("parameters__speed__value").innerHTML = Math.floor(past_text.length / ((time_now / 10) / 60)).toString();
    } else {
        document.getElementById("parameters__speed__value").innerHTML = "Начните печать";
    }
}

async function next_text() {
    let num = 0;
    if (localStorage.getItem('num') != null) {
        num = parseInt(localStorage.getItem('num'));
    }
    num++;
    num %= 81;
    num = num == 0 ? 1 : num;
    localStorage.setItem('num', num.toString());
}

async function get_text() {
    let num = 0;
    if (localStorage.getItem('num') != null) {
        num = parseInt(localStorage.getItem('num'));
    }
    num %= 81;
    num = num == 0 ? 1 : num;
    localStorage.setItem('num', num.toString());
    return await (await fetch("texts/" + num.toString() + ".txt")).text()
}

function get_result() {
    if (localStorage.getItem('results') == null) {
        alert("no results");
    } else {
        alert("Task {" + localStorage.getItem('num') + "}. " + localStorage.getItem('results'));
    }
}

function set_results(time, speed, mistaks) {
    var dateTime = new Date();
    // var dateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
    localStorage.setItem("results", "Время завершения: " + dateTime.toString() + "\n" + "Время выполнения: " + time.toString() + "\n" + "Полезная скорость: " + speed.toString() + "\n" + "Кол-во ошибок: " + mistaks.toString());
}