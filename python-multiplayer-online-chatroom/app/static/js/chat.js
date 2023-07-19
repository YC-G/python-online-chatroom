$(document).ready(function () {
    // Define a persistent connection
    var conn = null;

    // Get client's name and avatar
    var name = $("#input_name").val();
    var avatar = $("#input_avatar").val();
    console.log("name below")
    console.log(name)
    console.log("avatar below")
    console.log(avatar)

    // Append chat box
    function append_msg(name, data) {
        var html = "";
        // If me
        if (data.code == 2) {
            if (name == data.name) {
                // data represents localhost
                html += "<div class=\"row\">";
                html += "<div class=\"col-md-3\"></div>";
                html += "<div class=\"col-md-9\">";
                html += "<div class=\"media\">";
                html += "<div class=\"media-body\">";
                html += "<h6 class=\"user-nickname text-right\">" + data.name + "[" + data.dt + "]</h6>";
                html += "<div class=\"alert alert-success\" role=\"alert\">";
                html += data.content;
                html += "</div>";
                html += "</div>";
                html += "<img class=\"ml-3 rounded-circle\" style='width: 60px;height: 60px;' src=\"" + data.face + "\">";
                html += "</div></div></div>";
            } else {
                html += "<div class=\"row\">";
                html += "<div class=\"col-md-9\">";
                html += "<div class=\"media\">";
                html += "<img class=\"mr-3 rounded-circle\" style='width: 60px;height: 60px;' src=\"" + data.face + "\">";
                html += "<div class=\"media-body\">";
                html += "<h6 class=\"user-nickname\">" + data.name + "[" + data.dt + "]</h6>";
                html += "<div class=\"alert alert-info\" role=\"alert\">";
                html += data.content;
                html += "</div>";
                html += "</div>";
                html += "</div></div>";
                html += "<div class=\"col-md-3\"></div>";
                html += "</div>";
            }
        } else if (data.code == 1) {
            html += "<p class='text-center text-success'>欢迎" + data.name + "进入聊天室！<img src='/static/images/rorse.gif'><img src='/static/images/rorse.gif'><img src='/static/images/rorse.gif'></p>"
        }
        $("#chat-list").append(html);
        SyntaxHighlighter.highlight();
        $("#chat-list").scrollTop($("#chat-list").scrollTop() + 9999999);
    }

    // Define connection
    function connect() {
        // disconnect if connected
        disconnect();

        var transports = ["websocket", "xhr-streaming", "iframe-eventsource", "iframe-htmlfile", "xhr-polling", "iframe-xhr-polling", "jsonp-polling"];

        conn = new SockJS("http://" + window.location.host + "/chatroom", transports);

        // client initiates a connection
        conn.onopen = function () {

        };

        // full duplex communication
        conn.onmessage = function (e) {
            console.log(e);
        };

        // close the connection
        conn.onclose = function (e) {
            conn = null;
        };
    }


    // Disconnect
    function disconnect() {
        if (conn != null) {
            conn.close();
            conn = null;
        }
    }


    if (conn == null) {
        connect();
    } else {
        disconnect();
    }


    function getFormData() {
        var arr = $("#form-data").serializeArray();
        var obj = {};
        $.map(arr, function (n, i) {
            obj[n['name']] = n['value'];
        });
        return obj
    }


    $("#send_msg").click(function () {
        console.log("send_msg button is clicked")
        var msg_data = getFormData();
        if (msg_data.content) {
            msg_data.code = 2;
            ue.setContent('');
            console.log(msg_data);
            conn.send(JSON.stringify(msg_data));
        } else {
            alert("Can't send an empty message!");
        }
    });



});
