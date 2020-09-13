# Dynamic-form
cd over to the folder
then npm install

then npm install express

then npm install body-parser

then npm install ejs

then npm install monngoose

node app.js

if you have mongodb installed in your desktop then open new tab in terminal and type mongod

when you can see " waiting for connections on port 27017"

then open new tab and type mongo

then a Command line will appear and type following commands

show dbs(it will show the databases in your desktop along with formDB)

use formDB

show collections

now you will see three collections 

1. inputs

2.feilds

3.values

now you can see values stored in these collection using

db.collectionName.find();
eg:-db.inputs.find()
