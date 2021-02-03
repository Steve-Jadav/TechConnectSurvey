Survey
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
            questions: [
               {
                    name: "email",
                    type: "text",
                    title: "Please enter your organization affiliated email:",
                    placeHolder: "john.doe@xyz.org",
                    isRequired: true,
                    validators: [
                      { type: "email" }
                    ]
               },
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
                    isRequired: true,
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
                    isRequired: true,
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
                    isRequired: true,
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

$("#surveyElement").Survey({model: survey});
