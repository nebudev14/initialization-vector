# Initialization Vector

## What is this?
This is a neat little tool I ended up making in about a week for MIT BWSI's Embedded Security and Hardware Hacking course. It primarily serves as a way for students to submit flags received from completed labs, and for instructors to track which students have completed which labs and vice versa.

This repository houses the web app that allows students to view labs and their completion status, and allows instructors to monitor student progress.

## How does it work?
When completing labs, users are greeted with a **flag string** representing whether their solution is correct or not. A flag string is formatted like `embsec{blah_123blah_431_warren}`.

Once this flag has been received, students can use [netcat](https://netcat.sourceforge.net/) to establish a TCP connection with the [listener](https://github.com/NebuDev14/init-vector-listener) hosted on a server. Students can paste their flag string and send it over for validation, and if correct, will receive a unique submission link where they can officially mark their lab as completed.

![Demo Image](demo.png)

## Why is it named Initialization Vector?

1. It is named after [Initialization Vectors](https://en.wikipedia.org/wiki/Initialization_vector) found in ciphers such as AES to ensure that encrypting the same message with the same key can result in different outputs.
2. It is coincidentally, also named after [Iv](https://github.com/aerobinsonIV), one of the lead instructors of the course, and also an all around cool guy.
