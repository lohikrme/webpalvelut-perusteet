# different ways to install stuff:
    # locally:
        # npm install <package> 
    # developerly:
        # npm install -D <package>
    # globally:
        # npm install -g <package>

npm install -g tsc
tsc --init

# change to tsconfig:
# target: "es2016"
# outDir: "./dist"
# rootDir: "./src"
# moduleResolution: "node10"

# compiloi typescript js:ksi komennolla 'tsc'

npm init -y

# tarkista  globaalit
# npm -g ls
npm install -g ts-node nodemon @types/node @types/express

npm install express
npm install @types/express # needed for typescript to use express

# check u have installed both successfully:
# npm ls

npm install dotenv

npm install mocha chai @types/node --save-dev
npm install mochawesome --save-dev