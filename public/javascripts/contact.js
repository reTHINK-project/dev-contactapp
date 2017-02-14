var contactsList = [];
//var url = 'http://130.149.22.133:5002';

function addContactEvent() {
    // Delete User link click
    $('#userList table tbody').on('click', 'td button.deleteUser', removeContact);

    // Show User link click
    $('#userList table tbody').on('click', 'td button.updateContact', updateContact);

    // Show User link click
    $('#userList table tbody').on('click', 'td button.callUser', callUser);
    //$('#userList table tbody').on('click', 'td button.callUser', callWebRTC);

    $('.addContact').on('click', addContact);

}

function addContact(event) {
    // event.preventDefault();

    var emptyInput = 0;
    var exist = false;
    var valueName = $('#inputFirstName').val();
    var valueGUID = $("#inputGuid").val();

    if (valueName != "" && valueGUID != "")
    {
        event.preventDefault();
        $('#addUser input').each(function (index, val) {
            if ($(this).val() === '') { emptyInput++; }
        });

        var newUser = {
            'firstname': valueName,
            'lastname': $('#inputLastName').val(),
            'information': $("#inputInfo").val(),
            'guid': valueGUID,
        }

        $.each(contactsList, function () {
            if (this.contactlist.guid === newUser.guid) exist = true
        });

        // Check and make sure errorCount's still at zero
        //if (emptyInput === 0) {
        if (!exist) {
            $.ajax({
                type: 'POST',
                data: newUser,
                url: '/users/addcontact/',
                dataType: 'JSON'
            }).done(function (response) {
                // Check for successful (blank) response
                if (response.msg === '') {
                    // Clear the form inputs
                    $(".form-signin")[0].reset();
                    getContactList();
                }
                else { alert('Error: ' + response.msg); }  // If something goes wrong, alert the error message that our service returned
            });
        }
        else {
            alert('User already imported, please update it');
        }
    }
}

function removeContact(event) {
    event.preventDefault();
    $.ajax({
        type: 'DELETE',
        url: '/users/removecontact/' + $(this).attr('rel')
    }).done(function (response) {
        // Check for a successful (blank) response
        if (response.msg != '') alert('Error: ' + response.msg);

        // Update the table
        getContactList();
    });
}

function updateContact(event) {
    event.preventDefault();
    var contactGUID  = $(this).attr('rel');
    // Check and make sure errorCount's still at zero
    $.ajax({
        type: 'POST',
        data: '',
        url: '/users/updatecontact/' +  contactGUID,
        dataType: 'JSON'
    }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
            // Clear the form inputs
            $(".form-signin")[0].reset();
            getContactList();
        }
        else { alert('Error: ' + response.msg); }  // If something goes wrong, alert the error message that our service returned
    });
}

function getContactList() {
    // Empty content string
    var tableContent = '';

    $.getJSON('/users/getcontactlists', function (data) {

        // Stick our user data array into a userlist variable in the global object
        contactsList = data;
        $.each(data, function () {
            var callId = "";
            var uids = "";
            var callSection = "<table >";
            if (typeof this.contactlist.uids !== 'undefined')
            {
                $.each(JSON.parse(this.contactlist.uids), function () {
                    var id = this.uid?this.uid:this.id;
                    var domain = this.domain?this.domain:this.category;
                    callSection += "<tr><td>";
                    if (this.uid){callSection += '<img src="/favicon.ico"/>'};
                    callSection += id + "<br>" + "domain: " + domain;
                    if (typeof domain !== "undefined" && domain.indexOf("orange-labs.fr") != -1) {
                        callSection += '<td><button type="button" class="callUser btn btn-xs btn-success" uid="' + id + '" domain="' + domain + '">call</button></td>'
                    }
                    callSection += "</td></tr>";
                });
            }
            callSection += "</table>";
            tableContent += '<tr>';
            tableContent += '<td>' + this.contactlist.firstname + ' ' + this.contactlist.lastname + '</td>';
            tableContent += '<td>' + this.contactlist.guid + '</td>';
            tableContent += '<td>' + this.contactlist.info  + '</td>';
            tableContent += '<td><button type="button" class="updateContact btn btn-xs btn-info" rel="' + this.contactlist.guid + 
            '" >Update</button><br/><button type="button" class="deleteUser btn btn-xs btn-danger" rel="' + this._id + '" >delete</button></td>';
//            tableContent += '<td id="" rel="">' + uids + '</td>';
            tableContent += '<td>' + callSection + '</td>';
            //else tableContent +='<td><button type="button" class="callUser btn btn-xs btn-default">call</button></td>';
            tableContent += '</tr>';

        });
        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);

    });
}

function callUser(event) {
    event.preventDefault();
    $.ajax({
        type: 'GET',
        url: '/users/getRoom/' + $(this).attr('uid')
    }).done(function (response) {
        if (response.url != '') {
            window.location.href = response.url
        }
        else {
            alert("Your contact is offline");
        }
    });
}