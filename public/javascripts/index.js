// Hide section-2 and section-3 on document load
$(".section-2").hide();
$(".section-3").hide();
$("#submitButton").hide();
$("#section-2-form-2").hide();
$("#section-2-form-3").hide();
$("#section-2-form-4").hide();
$("#dropdown-2").hide();
$("#dropdown-3").hide();
$("#dropdown-4").hide();
$(".button-for-sec3").hide();

let contactCounts = [1, 1, 1, 1, 1];

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});


function updateTextInput(val, index) {
    $(".badge-" + index.toString()).text(val);
}

function addContact(index) {

  if (contactCounts[index] < 10) {
    let row = "<div class='row'>" +
    "<div class='col-md-3'> " +
      "<input type='text' class='form-control' placeholder='Full Name'> " +
    "</div> " +
    "<div class='col-md-4'>" +
      "<input type='text' class='form-control' placeholder='Organization Affiliation, Department'>" +
    "</div>" +
     "<div class='col-md-3'> " +
          "<select id='inputState' class='form-control'>" +
            "<option selected>Choose Relationship Type...</option>" +
            "<option>External Industry Group</option>" +
            "<option>Within Industry Group</option>" +
          "</select>" +
      "</div>" +
    "</div>";

    $("#section-2-form-" + index.toString()).append(row);
  }

  contactCounts[index] += 1;
  if (contactCounts[index] > 9) {
    document.getElementById("addContact-" + index.toString()).disabled = true;
  }

}


$("#form").submit(function(e) {

    e.preventDefault(); // avoid to execute the actual submit of the form.

    let data = {};

    // Fetch responses from section 1
    data["firstName"] = $("#firstName").val().trim();
    data["lastName"] = $("#lastName").val().trim();
    data["jobTitle"] = $("#jobTitle").val().trim();
    data["specialityAreas"] = $("#specialityAreas").val().trim();
    data["companyName"] = $("#companyName").val().trim();
    data["joiningDate"] = $("#joiningDate").val().trim();

    if (document.querySelector('input[name="techBridgeRadio"]:checked') === null) {
      data["techBridge"] = "null";
    }
    else {
      data["techBridge"] = document.querySelector('input[name="techBridgeRadio"]:checked').value;
    }

    data["organizationRole"] = [];
    data["noOfPeople"] = $("#noOfPeople").val().trim();
    data["supervisors"] = $("#supervisors").val().trim();
    data["section2"] = {
      "q1": [],
      "q2": [],
      "q3": [],
      "q4": []
    };
    data["likertScales"] = new Array();

    // Fetch checkbox checked values
    let checkedValues = $('input[type="checkbox"]:checked');
    for (var i = 0; i < checkedValues.length; i++) {
      data["organizationRole"].push(checkedValues[i].value);
    }

    // Fetch responses from section 2
    for (let formId = 1; formId <= 4; formId++) {
      let formElements =  document.getElementById("section-2-form-" + formId.toString());
      let l = 0;
      while (l < formElements.length) {
          if (l == 3) { l += 1; continue; }
          let name = formElements[l].value.trim();
          let org = formElements[l + 1].value.trim();
          let relationship = formElements[l + 2].value.trim();
          if (relationship === "Choose Relationship Type...") { relationship = ""; }
          let packet = { "name": name, "org": org, "relationship": relationship };
          data["section2"]["q" + formId.toString()].push(packet);
          l += 3;
      }

    }


    // Fetch the likert scale questions (section 3)
    for (let i = 1; i <= 13; i++) {
      if (document.querySelector('input[name="likert-'+ i.toString() + '"]:checked') === null) {
        data["likertScales"].push("null");
      }
      else {
        data["likertScales"].push(document.querySelector('input[name="likert-'+ i.toString() + '"]:checked').value);
      }
    }


    $.ajax({
      type: 'POST',
      url: '/surveyCompleted',
      contentType: 'application/json',
      data: JSON.stringify(data), // access in body
      }).done(function () {
          window.location = "/result";
      }).fail(function (msg) {
          return false;
      });

});


function next(sectionId) {
  $(".section-" + sectionId.toString()).fadeIn();
  $("#submitButton").fadeIn();
}

function drop(formId) {
  if (formId === 4) {
    $(".button-for-sec3").fadeIn();
  }
  $("#section-2-form-" + formId.toString()).fadeIn();
  $("#dropdown-" + formId.toString()).fadeIn();
}
