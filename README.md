# Interview Sirius

## What is this repository for?

This repository contains the project for showing a file upload component.

## How to run the web appliation

For live development purposes:

```
$ npm run start
```

For bulding a distribution:

```
$ npm run build
```

## How did I set it up?

The web application is built with `Angular` and `Typescript`.

## Implementation choices

The application is pretty simple, contains a basic Angular app including the File Upload component.

The File Upload component is implemented in a way to work via drag and drop operations or via keyboard navigation.

Accessibility is covered in the form elements (`<label />` and `<input />`) of the component.

While operations are executed, a notification box appears in the bottom left corner of the component. Double notifications are implemented, the first is stating the in progress state, the second is a confirmation.

I used `https://httpbingo.org` as a random api service, mainly to simulate a POST request for uploading file. Since the service doesn't allow to post form data bigger than a MB, it is easy to simulate also network errors.
I improved the notification box in case of an error.

`src/assets/` is used to contain assets as fonts or stylesheet.

Furthermore the `public/` folder contains public data, useful to the applcation itself.

## Possible improvements

- The `<label />` of the file component disappears from the layout and consequentially from the HTML, after the first files are uploaded. This is an accessibility issue. Design should be improved, maybe the label can be set always visible, right under the `<header />`.
- The filtered files, not allowed due to unaccepted exensions, can be listed somewhere in the notifications box, in order to give a sense of understanding of what is going on to the user.
- In the list of uploaded files, a deletion call to action can be added, that once clicked, it does a DELETE request to delete the file uploaded from the files bucket.
- Possibly, comments can be added along the codebase. Regarding this point, I would check the standards adopted by the team. I'm a fan of less comments as possible, since I believe that code should be written clear enough to be uncommented. Although I believe that there are cases where some explanation can be needed, in case of exceptions, obscure parts or simply to improve TSDoc for helping Typescript and implementation process.

## System architecture

A sketch of the system architecture can be found at the following [miro board](https://miro.com/app/board/uXjVKutBxsA=/).
