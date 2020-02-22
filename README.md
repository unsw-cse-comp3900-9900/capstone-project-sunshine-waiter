# SunshineWaiter

## How to Run with Docker

### First time SetUp

-   install [Docker](https://www.docker.com/products/docker-desktop)
-   After installation, start the docker in your computer
-   In the terminal, `git clone` the repository from remote and in the working directory run `docker-compse up --build`

### Subsequent runs

-   Just run `docker-compse up`
-   Access to the waiter page throught `https://localhost:3000`

## How to push your code

-   The only way to push is via pull request
-   How to do this?
    ```
    - git checkout -b branch_name
    - git add <files>
    - git commit -m "some thing"
    - git push origin branch_name:username/branch_name
    ```
-   After push code, go to `github`, your pr will be prompted in the page, go and click `compare & pul request` and fill information and request a reviewer

-   A PR cannot be merged before being approved

## Tech Stack

Frontemd: React + Antd + Semantic UI

Backend: Node.js + Express + MongoDB

DevOps: AWS EB + Docker + Nginx
