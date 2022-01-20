# Shopify Backend Challenge 2022
## Inventory Tracker
### Preambles
Hey there! ✌🏾 I'm Aaditya (or just Adi is fine too!). This is my attempt of the Shopify Backend Challenge for 2022.

I had a lot of fun with this project and worked really hard on it!

A bit about the project:
- It uses **Node.js**
- The backend is built in **Express.js**
- The database that is being used is **MongoDB**, with **Mongoose**
- The frontend is done with **HTML/CSS** (with the HTML being generated by the **Pug template engine**) and **vanilla JS**
- The extra feature that I have implemented in my project is the support for warehouses (CRUD and assigning them to items).

### Prerequisites
1. Please ensure that [Node.js](https://nodejs.org/en/download/) is installed. You may also choose to install `nvm` and install `Node.js` and `npm` through `nvm`. The project was built with `Node.js` version 14.16.0 and `npm` version 7.19.1, but any `Node.js` version from 14.16.0 and on should work.
2. Please ensure that [MongoDB](https://docs.mongodb.com/manual/installation/) is installed. I use version 4.4, but any version above and including 4.4 should work. You can optionally install MongoDBCompass if you wish to view the data in the database.
3. Recommended: Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) to clone the project with more ease
3. You may choose to also install Postman to test the API.

### Setting up The Project
1. Start off by cloning this repository. If you have Git installed, you can do `git clone https://github.com/AdiChops/shopify-backendChallenge2022.git`, otherwise:
    
    i. Click on `Code` on GitHub and click `Download ZIP`

    ii. Once the `zip` file is done downloading, extract/unzip the project with a program of choice

2. Once the repo is cloned, open a command line/terminal of choice

3. In that terminal/command line window, `cd` into the project (set the current working directory to be that of the project)

4. Once the project is the current working directory, run `npm install` to install all the dependencies for the project.

5. Next, in the repository's main directory, create a `.env` file

6. Write the following in the `.env` file:
```
CONNECTION_STRING = "mongodb://localhost:27017/inventorySystem"
PORT = 3001
```

7. Create a directory called `database` in the main project directory. You may also choose to create this database directory elsewhere, but the next step will then need to be adjusted accordingly.

8. In the terminal/command line window (with the current working directory being the project directory), run the mongo daemon by running `mongod --dbpath=./database`. If the database directory was created elsewhere, then the argument for `--dbpath` would then need to be updated to point to the appropriate directory.

    8.1. There may be an issue with regards to the PATH environment variable not being set up properly to include the daemon command and thus `mongod` not being recognized as a proper command. To bypass this, you can refer to [this section](#Troubleshooting) of the README to solve the problem, or alternatively, you can directly go to the `.exe` file and run it that way. For example, for the deafult Windows installation location, you can run: `"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath=./database` (adjusting accordingly to the installation path).

    8.2. Please also note that if the daemon port is adjusted from the default `27017`, then the `.env` file will also need to be adjusted accordingly to reference that port.

9. Once the mongo daemon is running (if there is no error displayed and the terminal still has `mongod` running), open a **separate** terminal window and set the current working directory to be the project directory.

10. Run `npm run clean-start` which will clear the database, reseed the data into the database and then run the server. 

    10.1. Alternatively, you can first run `node db-initializer.js` to clear and reseed the database.

    10.2. After running the database initializer script, you can then run `npm run start` or `node app.js`

11. Once the server is listening (`Server started on http://localhost:3001` should be displayed in the terminal window), you can now visit http://localhost:3001/ from a browser of choice or from Postman. Please note that Internet Explorer is not fully supported for the front-end of the project.

### Routes
**Quick Note:** For the editing of warehouses (i.e. `PUT /warehouses/:id`), if the postal code is being edited, then the country is required to be input as well, even if it is not being updated (and vice-versa, if the country is being updated, then the postal code should also be present). This is purely a performance choice so that the postal code + country combination can be verified properly rather than first querying the database to find the warehouse's country or postal code and then verifying the postal code + country combination that way.

|Method|Route          |Parameters                  |Sample Body  |Sample Response                                            |
|------|---------------|----------------------------|-------------|-----------------------------------------------------------|
|GET   | /             |    N/A                     | N/A         | 200 Status: HTML - Rendered home page pug template                    |
|GET   |/items         |    N/A                     | N/A         | 200 Status: HTML - Rendered items page pug template                   |
|GET   |/items/:id     |:id- specific item's ID     | N/A         | 200 Status: HTML - Rendered pug template for a specific item page     |
|GET   |/items/new     |    N/A                     | N/A         | 200 Status: HTML - Rendered pug template for item creation page       |
|GET   |/warehouses    |    N/A                     | N/A         | 200 Status: HTML - Rendered warehouses page pug template              |
|GET   |/warehouses/:id|:id- specific warehouse's ID| N/A         | 200 Status: HTML - Rendered pug template for a specific warehouse page|
|GET   |/warehouses/new|    N/A                     | N/A         | 200 Status: HTML - Rendered pug template for warehouse creation page  |
|PUT   |/items/:id     |:id- specific item's ID     | object representing attributes to edit for item, e.g.: ```{"name":"New Item", "stock": 5}```| Blank if valid with HTTP 204, JSON object with error message if error (e.g.: ```{"message": "An Error Occurred"}```) with HTTP 400 or 500|
|PUT   |/warehouses/:id|:id- specific warehouse's ID     | object representing attributes to edit for warehouse, e.g.: ```{"city":"Ottawa", "country": "Canada", "postalCode":"K2B 6N9"}```| Blank if valid with HTTP 204, JSON object with error message if error (e.g.: ```{"message": "An Error Occurred"}```) with HTTP 400 or 500|
|POST   |/items        | N/A                        | object representing attributes for new Item to create, e.g.: ```{"name": "Bicycle","description": "Transportation device that requires pedaling.", "stock": 0, "price": 342.79, "tags": ["exercise", "transportation", "adventure", "outdoors"], "warehouses":[ObjectId(<warehouse-id>)]}```| JSON of newly created Item object (e.g. ```{"_id":ObjectId(<newly-created-item-id>), "name": "Bicycle","description": "Transportation device that requires pedaling.", "stock": 0, "price": 342.79, "tags": ["exercise", "transportation", "adventure", "outdoors"], "warehouses":[ObjectId(<warehouse-id>)]}```) with HTTP 201, JSON object of error message if error occurred, e.g.: ```{"message":"An error occurred. There is a possibility of invalid data."}``` with HTTP 400 or HTTP 500|
|POST   |/warehouses        | N/A                        | object representing attributes for new Warehouse to create, e.g.: ```{"streetNumber": "5387", "streetName": "Thompson Rd.", "city": "Toronto", "province": "ON", "postalCode": "M5K 6P1", "phone": "416-543-2485", "country": "Canada"}```| JSON of newly created Item object (e.g. ```{"_id":ObjectId(<newly-created-warehouse-id>), "streetNumber": "5387", "streetName": "Thompson Rd.", "city": "Toronto", "province": "ON", "postalCode": "M5K 6P1", "phone": "416-543-2485", "country": "Canada"}```) with HTTP 201, JSON object of error message if error occurred, e.g.: ```{"message":"An error occurred. There is a possibility of invalid data."}``` with HTTP 400 or HTTP 500|
|DELETE|/warehouses/:id|:id- specific warehouse's ID     | N/A | Blank if deleted successfully with HTTP 204, JSON object of error message if error occurred, e.g.: ```{"message":"An error occurred."}``` with HTTP 500|
|DELETE|/items/:id|:id- specific item's ID     | N/A | Blank if deleted successfully with HTTP 204, JSON object of error message if error occurred, e.g.: ```{"message":"An error occurred."}``` with HTTP 500|