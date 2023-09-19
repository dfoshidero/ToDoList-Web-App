import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

mongoose.connect(`mongodb+srv://admin-favour:ODJNGBtoJCskt8v9@cluster0.amukh4z.mongodb.net/todolistDB`).then(() => { console.log("Successfully connected to the database.") });

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const generalToDoSchema = {
    name: {
        type: String,
        required: true
    },
    complete: Boolean,
    uid: Number
};

const workToDoSchema = {
    name: {
        type: String,
        required: true
    },
    complete: Boolean,
    uid: Number
};

const generalitem = mongoose.model('ToDo', generalToDoSchema);
const workitem = mongoose.model('WorkToDo', workToDoSchema);


const item1 = new generalitem({
    name: "Welcome to your personal todo list!",
    uid: 1
});
async function createDefaultGeneral() {
    try {
        await generalitem.create(item1);
        console.log("Successfully saved default items.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


const item2 = new workitem({
    name: "Welcome to your work todo list!",
    uid: 2
});
async function createDefaultWork() {
    try {
        await workitem.create(item2);
        console.log("Successfully created default items.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

let cPage;
let data;

async function deleteItem(button) {
    console.log("Delete Item function called")
    if (cPage === 'index') {
        try {
            const itemID = button.getAttribute('data-id');
            const generalDelete = await generalitem.deleteOne(
                { _id: itemID }
            );
            console.log("Successfully deleted data")
        } catch (err) {
            console.log("Failed to delete data:")
            console.log(err);
        }
    } else if (cPage === 'work') {
        try {
            const itemID = button.getAttribute('data-id');
            const workDelete = await workitem.deleteOne(
                { _id: itemID }
            );
            console.log("Successfully deleted data")
        } catch (err) {
            console.log("Failed to delete data:")
            console.log(err);
        }
    }
};






app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    let generalItems = await generalitem.find();
    console.log(generalItems);

    if (generalItems.length === 0) {
        try {
            await createDefaultGeneral();
            generalItems = await generalitem.find();
        } catch (err) {
            console.log("FAILED TO INSERT DATA");
            console.log(err);
        }
    }

    cPage = 'index';
    data = {
        currentPage: cPage,
        generalList: generalItems
    };


    res.render((__dirname + '/views/index.ejs'), data);
});

app.get('/index', async (req, res) => {
    let generalItems = await generalitem.find();
    console.log(generalItems);

    if (generalItems.length === 0) {
        try {
            await createDefaultGeneral();
            generalItems = await generalitem.find();
        } catch (err) {
            console.log("FAILED TO INSERT DATA");
            console.log(err);
        }
    }

    cPage = 'index';
    data = {
        currentPage: cPage,
        generalList: generalItems
    };
    res.render((__dirname + '/views/index.ejs'), data);
});

app.get('/work', async (req, res) => {
    let workItems = await workitem.find();
    console.log(workItems);
    if (workItems.length === 0) {
        try {
            await createDefaultWork();
            workItems = await workitem.find();
        } catch (err) {
            console.log("FAILED TO INSERT DATA");
            console.log(err);
        }
    } else {
        workItems = await workitem.find();
    }
    cPage = 'work';
    data = {
        currentPage: cPage,
        workList: workItems
    };
    res.render((__dirname + '/views/work.ejs'), data);
});

app.post('/submit', async (req, res) => {
    const todoName = req.body.todo;

    try {
        if (cPage === 'index') {
            const newItem = new generalitem({
                name: todoName,
            });
            await newItem.save();
        } else if (cPage === 'work') {
            const newItem = new workitem({
                name: todoName,
            });
            await newItem.save();
        } else {
            console.log('error');
        }

        res.redirect(`/${cPage}`);
    } catch (err) {
        console.error('An error occurred:', err);
        res.status(500).send('Error occurred while adding the todo.');
    }
});

app.post('/delete', async (req, res) => {
    const itemID = req.body.itemToDelete;
    try {
        if (cPage === 'index') {
            const deleteMany = await generalitem.deleteMany({ _id: { $in: itemID } });
            console.log("Successfully deleted data");
        } else if (cPage === 'work') {
            const deleteMany = await workitem.deleteMany({ _id: { $in: itemID } });
        }
        res.redirect(`/${cPage}`);
    } catch (err) {
        console.log("Failed to delete data:")
        console.log(err);
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    console.log('Press Ctrl+C to quit.');
});