# AmbienceMax
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

Work Done So Far
-------------------
Login Page (Fully Working)
Sign Up Page (Fully Working)
Dashboard Page (Fully Working)

Functionalities
------------------------
1. Only Requester can raise a request so only he sees the 
new Request button as well as the rest buttons.
Everyone else can see the rest of the buttons.

2.The requester can choose the approvers he wants the
approval of at the time of submitting the request.

3.As of now there is no backend or a db to our app
so I have put in place a local strategy in a Service 
for authentication and 

4.A lot of other functions and methods
which will help in assigning requests to the approvers
which have to be approved by them etc. are also added using Services (for now)

5.Once the Request is approved by the one of the approver 
the status of that request changes from Pending to closed for 
that particular approver.

6.User Schema and Requeste Schemas are also defined.

7.Dummy data with 14 Requests and 7 user accounts is hardcoded
in the services itself.

Future Enhancements
------------------------------------------------------
1.Working comment and resend option
2.New and more secure auth policy once backend is added.
3.Improvements in UI.

-----------------------------------------------------------

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
"# ambiencemax" 
