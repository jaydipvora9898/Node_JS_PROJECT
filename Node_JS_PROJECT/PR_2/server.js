const express = require('express');
const server = express();

server.use(express.urlencoded({ extended: true }));

let Tasks = [
  {
    id: "1",
    title: "Study",
    desc: "Physics Chapter No.3 Topic Gravity",
    date: "26-july-2025",
    Priority: " High"
  },
  {
    id: "2",
    title: "Study",
    desc: "Chemistry Chapter No.2 Topic Thermodynamics",
    date: "26-july-2025",
    Priority: " Medium"
  },
  {
    id: "3",
    title: "Trip",
    desc: "With Friends - Trip to Bhaguda",
    date: "26-july-2025",
    Priority: " Low"
  }
];

server.set('view engine', 'ejs');


server.get('/', (req, res) => {
  res.render('index', { Tasks, task: null });  
});



server.post('/add-task', (req, res) => {
  const id = Math.floor(Math.random() * 10000).toString();
  const newTask = { id, ...req.body, status: 'pending'};
  console.log(newTask)
  Tasks.push(newTask,);
  res.redirect('/');
});

server.get('/delete-task/:id' , (req, res) => {
  let id =  req.params.id;
  Tasks =  Tasks.filter(task  => task.id != id)
  res.redirect('/')
})

server.get('/edit-task/:id', (req, res) => {
  let id = req.params.id;
  const task = Tasks.find(task => task.id === id);
  res.render('index', { Tasks, task }); 
});


server.post('/edit-task/:id', (req, res) => {
  const id = req.params.id;
  const SingleTask = Tasks.findIndex(task => task.id === id);
    Tasks[SingleTask] = { id, ...req.body };
  res.redirect('/');
});

server.post('/toggle-status/:id', (req, res) => {
  const id = req.params.id;
  const task = Tasks.find(t => t.id === id);

  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed';
  }

  res.redirect('/');
});


server.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
