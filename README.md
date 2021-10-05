## How to reproduce:


```bash
git clone git@github.com:avallete/prisma-9584-MRE.git
cd prisma-9584-MRE
npm install
npm run prisma:generate
docker-compose up
```

### Details

The issues occurs way more quickly with limited hardware on the docker deamon.

On OSX, you can set thoses limitations via the docker dashboard:

![Screenshot 2021-10-05 at 12 53 10](https://user-images.githubusercontent.com/8771783/136009865-63526b8b-617d-4ad0-9344-bcfd2469a6ef.png)


### Some notes:

The issue doesn't occurs with "sqlite", you can test it by doing:


```bash
git clone git@github.com:avallete/prisma-9584-MRE.git
cd prisma-9584-MRE
git checkout sqlite
npm install
npm run prisma:generate
docker-compose up
```