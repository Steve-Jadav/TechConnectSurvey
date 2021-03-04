/* Survey
    .StylesManager
    .applyTheme("bootstrap");

Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
Survey.settings.lazyRowsRendering = true;

var json = {
    title: "TechBridge Survey",
    showProgressBar: "bottom",
    firstPageIsStarted: true,
    startSurveyText: "Start Survey",
    pages: [
        {
            questions: [
                {
                    type: "html",
                    html: "You are about to start this survey. <br/>We ensure that your responses will remain highly confidential.<br/>Please click on <b>'Start Survey'</b> button when you are ready."
                }
            ]
        }, {
            title: "Introduction",
            questions: [
                {
                    type: "html",
                    html: "  The purpose of this study is to examine the impact of NavalX Tech Bridges on their regional business and technology ecosystems. One way to accomplish this goal is to understand professional relationships among persons and organizations in professional circles linked to Tech Bridges. This survey will help create a map of people who work together across their respective organizations. Please make sure you have read and signed the Letter for Informed Consent before continuing with this form.   For the purposes of the questions below, any questions that reference your organization are asking about your immediate organization. Immediate Organization is defined as everyone who directly reports to the same person.   As mentioned in the Informed Consent letter, any identifying information on this form will not be associated with your responses to Section 3: Perceptions of your local Tech Bridge. "
                },
               {
                    name: "firstName",
                    type: "text",
                    title: "First Name:",
                    isRequired: false,
                    maxWidth: "200px",
                    validators: [
                      { type: "email" }
                    ]
               },
               {
                    name: "lastName",
                    type: "text",
                    title: "Last Name:",
                    isRequired: false,
                    maxWidth: "200px",
               },
               {
                    name: "jobTitle",
                    type: "text",
                    title: "Job Title:",
                    isRequired: false,
                    maxWidth: "200px",
               },
               {
                    name: "specialityAreas",
                    type: "text",
                    title: "Please list your specialty areas or your areas of capacity (e.g. additive manufacturing, artificial intelligence, fuels chemistry, underwater basket weaving, etc.)",
                    placeholder: "Artificial Intelligence, Fuels Chemistry, Additive Manufacturing",
                    isRequired: false,
                    maxWidth: "initial",
               },
               {
                    name: "email3",
                    type: "text",
                    title: "Enter the email of person you're mostly likely to work with:",
                    placeHolder: "john.doe@xyz.org",
                    isRequired: false,
                    validators: [
                      { type: "email" }
                    ]
               },
               {
                   type: "radiogroup",
                   name: "relationship",
                   isRequired: false,
                   title: "In what way do you most frequently communicate?",
                   choices: [
                       "Trouble Calls", "Email", "Respective Department", "In-person Direct Contact"
                   ],
                   correctAnswer: "1850-1900"
               }
            ]
        } , {
            questions: [
                {
                    type: "radiogroup",
                    name: "civilwar",
                    isRequired: false,
                    title: "In what way do you most frequently communicate?",
                    choices: [
                        "Trouble Calls", "Email", "Respective Department", "In-person Direct Contact"
                    ],
                    correctAnswer: "1850-1900"
                }
            ]
        }, {
            questions: [
                {
                    type: "rating",
                    name: "satisfaction",
                    title: "How satisfied are you with the Product?",
                    minRateDescription: "Not Satisfied",
                    maxRateDescription: "Completely satisfied"
                }
            ]
        }, {
            questions: [
                {
                    type: "dropdown",
                    name: "car",
                    title: "How frequently do you contact a different department/divison/shop in a given day and week?",
                    isRequired: false,
                    colCount: 0,
                    choices: [
                        "0",
                        "Twice",
                        "Thrice",
                        "More than 3 times",
                        "More than 6 times"
                      ]
                }
            ]
        }, {
            questions: [
                {
                    type: "radiogroup",
                    name: "libertyordeath",
                    isRequired: false,
                    title: "Whom do you normally contact?",
                    choicesOrder: "random",
                    choices: [
                        "Specific Person", "General Department"
                    ],
                    correctAnswer: "Patrick Henry"
                }
            ]
        }, {
            questions: [
                {
                    type: "checkbox",
                    name: "departments",
                    isRequired: false,
                    title: "Which departments do you contact?",
                    hasNone: true,
                    colCount: 5,
                    choices: [
                        "W", "X", "Y", "Z"
                    ],
                    correctAnswer: "The foundation of the British parliamentary system"
                }
            ]
        }
    ],
    completedHtml: "<h5>Thank you for taking our survey. We appreciate your time!</h5>"
};

window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        $.ajax({
          type: "POST",
          url: "/surveyCompleted",
          contentType: 'application/json',
          data: JSON.stringify(result.data)
        }).done(function() {
          console.log("Success!");
        }).fail(function(msg) {
          console.log("Failed!");
        });


        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);


    });

$("#surveyElement").Survey({ model: survey });
*/

let contactCounts = [0, 0, 0, 0, 0];

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});


function updateTextInput(val, index) {
    $(".badge-" + index.toString()).text(val);
}

function addContact(index) {
  contactCounts[index] += 1;

  if (contactCounts[index] >= 10) {
    $("#addContact-" + index.toString()).disabled = true;
  }
  else {
    let row = "<div class='row'>" +
    "<div class='col-md-4'> " +
      "<input type='text' class='form-control' placeholder='Name'> " +
    "</div> " +
     "<div class='col-md-6'> " +
          "<select id='inputState' class='form-control'>" +
            "<option selected>Choose Relationship Type...</option>" +
            "<option>Local Tech Bridge</option>" +
            "<option>Outreach Events</option>" +
          "</select>" +
      "</div>" +
    "</div>";

    $("#section-2-form-" + index.toString()).append(row);
  }
}

function submitSurvey() {
  let data = new Map();
  data.set("firstName", $("#firstName").val());
  data.set("lastName", $("#lastName").val());
  data.set("jobTitle", $("#jobTitle").val());
  data.set("specialityAreas", $("#specialityAreas").val());
  data.set("companyName", $("#companyName").val());
  data.set("joiningDate", $("#joiningDate").val());
  data.set("noOfPeople", $("#noOfPeople").val());
  data.set("supervisors", $("#supervisors").val());

  data.set("scales", new Array());

  for (let i = 1; i <= 7; i++) {
    data.get("scales").push(document.querySelector('input[name="likert-'+ i.toString() + '"]:checked').value);
  }

  console.log(data);

  $.ajax({
    type: 'PUT',
    url: '/surveyCompleted',
    contentType: 'application/json',
    data: JSON.stringify(data), // access in body
    }).done(function () {
        console.log('SUCCESS');
    }).fail(function (msg) {
        console.log('FAIL');
    }).always(function (msg) {
        console.log('ALWAYS');
    });
}
