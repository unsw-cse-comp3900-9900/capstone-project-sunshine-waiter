# SunshineWaiter

## Setting up environmental variables

In directory `/backend/`, copy `.env_file_template` to `.env_file`. 
Keep your secret string in it. 
You can generate a secret string by running this code in node.js:

```javascript
require('crypto').randomBytes(48, function(err, buffer) { var token = buffer.toString('hex'); console.log(token); });
```

like this: 

![Pasted_Image_18_3_20__21_26](README.assets/Pasted_Image_18_3_20__21_26.png)



## How to Run with Docker

### First time SetUp

- install [Docker](https://www.docker.com/products/docker-desktop)
- After installation, start the docker in your computer
- In the terminal, `git clone` the repository from remote and in the working directory run `docker-compose up --build`

### Subsequent runs

- Just run `docker-compose up`
- Access to the waiter page throught `http://localhost:3000`

## How to push your code

- The only way to push is via pull request
- How to do this?

  ```
  - git checkout -b branch_name
  - git add <files>
  - git commit -m "some thing"
  - git push origin branch_name:username/branch_name

  ```

- After push code, go to `github`, your pr will be prompted in the page, go and click `compare & pull request` and fill information and request a reviewer

- A PR cannot be merged before being approved
  - git checkout master
  - git branch -d branch_name

## Tech Stack

Frontemd: React + Antd + Semantic UI

Backend: Node.js + Express + MongoDB

DevOps: AWS EB + Docker + Nginx
